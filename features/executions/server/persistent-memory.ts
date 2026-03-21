import { embed } from "ai";
import prisma from "@/lib/db";
import {
  CredentialProvider,
  PersistentMemoryScope,
  Prisma,
  type PersistentMemoryEntry,
  type ExecutionMemoryVisibility,
  type ExecutionMemoryWriteMode,
} from "@/lib/prisma/client";
import { readCredentialSecret } from "@/features/credentials/server/payload";
import {
  createGoogleProvider,
  createOpenAIProvider,
} from "@/lib/ai/proxy";

type PersistentMemoryRecord = {
  id: string;
  scope: PersistentMemoryScope;
  ownerId: string;
  userId: string;
  workflowId: string | null;
  namespace: string;
  key: string;
  value: Prisma.JsonValue;
  textValue: string | null;
  embedding: number[] | null;
  embeddingProvider: CredentialProvider | null;
  embeddingModel: string | null;
  sourceExecutionId: string | null;
  sourceStepId: string | null;
  sourceNodeId: string | null;
  updatedAt: Date;
};

type ResolvedEmbeddingRuntime = {
  provider: "GOOGLE" | "OPENAI";
  credentialId: string;
  credentialField: string;
  apiKey: string;
  model: string;
};

export type RuntimePersistentMemoryWrite = {
  namespace: string;
  key: string;
  value: Prisma.InputJsonValue;
  mode?: ExecutionMemoryWriteMode;
  visibility?: ExecutionMemoryVisibility;
  persist?: boolean;
  persistenceScope?: PersistentMemoryScope;
  semanticIndex?: boolean;
};

export type RuntimePersistentMemoryState = {
  entries: Map<string, PersistentMemoryRecord>;
  embeddingRuntime: ResolvedEmbeddingRuntime | null;
};

export type PersistentMemoryTemplateSnapshot = {
  workflow: Record<string, Prisma.JsonValue>;
  user: Record<string, Prisma.JsonValue>;
};

export type PersistentMemoryMatch = {
  id: string;
  scope: PersistentMemoryScope;
  namespace: string;
  key: string;
  value: Prisma.JsonValue;
  textValue: string | null;
  score: number;
  updatedAt: Date;
};

const DEFAULT_EMBEDDING_MODELS = {
  GOOGLE: "text-embedding-004",
  OPENAI: "text-embedding-3-small",
} as const;

const PERSISTENT_MEMORY_EMBEDDINGS_ENABLED =
  process.env.ENABLE_PERSISTENT_MEMORY_EMBEDDINGS === "true";

function createPersistentMemoryIdentity(entry: {
  scope: PersistentMemoryScope;
  ownerId: string;
  namespace: string;
  key: string;
}) {
  return [entry.scope, entry.ownerId, entry.namespace, entry.key].join(":");
}

function isPlainObject(
  value: Prisma.JsonValue | Prisma.InputJsonValue | null,
): value is Record<string, Prisma.JsonValue | Prisma.InputJsonValue> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeJsonValue(
  current: Prisma.JsonValue | null,
  incoming: Prisma.InputJsonValue,
): Prisma.InputJsonValue {
  if (!isPlainObject(current) || !isPlainObject(incoming)) {
    return incoming;
  }

  const result: Record<string, Prisma.InputJsonValue> = {
    ...(current as Record<string, Prisma.InputJsonValue>),
  };

  for (const [key, value] of Object.entries(incoming)) {
    const existing = current[key];

    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = mergeJsonValue(
        existing as Prisma.JsonValue,
        value as Prisma.InputJsonValue,
      );
      continue;
    }

    result[key] = value as Prisma.InputJsonValue;
  }

  return result;
}

function appendJsonValue(
  current: Prisma.JsonValue | null,
  incoming: Prisma.InputJsonValue,
): Prisma.InputJsonValue {
  if (Array.isArray(current)) {
    return [...current, incoming] as Prisma.InputJsonValue;
  }

  if (current == null) {
    return [incoming] as Prisma.InputJsonValue;
  }

  return [current, incoming] as Prisma.InputJsonValue;
}

function applyMemoryWriteMode(
  current: Prisma.JsonValue | null,
  incoming: Prisma.InputJsonValue,
  mode: ExecutionMemoryWriteMode,
) {
  switch (mode) {
    case "MERGE":
      return mergeJsonValue(current, incoming);
    case "APPEND":
      return appendJsonValue(current, incoming);
    case "REPLACE":
    default:
      return incoming;
  }
}

function setNestedValue(
  target: Record<string, Prisma.JsonValue>,
  namespace: string,
  key: string,
  value: Prisma.JsonValue,
) {
  const path = [namespace, key]
    .filter(Boolean)
    .flatMap((segment) => segment.split("."))
    .filter(Boolean);

  if (path.length === 0) {
    return;
  }

  let current: Record<string, Prisma.JsonValue> = target;

  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];
    const existing = current[segment];

    if (!isPlainObject(existing)) {
      current[segment] = {};
    }

    current = current[segment] as Record<string, Prisma.JsonValue>;
  }

  current[path[path.length - 1]] = value;
}

function materializeEntries(
  entries: Iterable<PersistentMemoryRecord>,
): Record<string, Prisma.JsonValue> {
  const result: Record<string, Prisma.JsonValue> = {};

  for (const entry of entries) {
    setNestedValue(result, entry.namespace, entry.key, entry.value);
  }

  return result;
}

function serializeJsonValue(
  value: Prisma.JsonValue | Prisma.InputJsonValue | null,
): string {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => serializeJsonValue(item)).join(",")}]`;
  }

  if (typeof value === "object") {
    const record = value as Record<
      string,
      Prisma.JsonValue | Prisma.InputJsonValue | null
    >;

    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${serializeJsonValue(record[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function stringifyValueForEmbedding(
  value: Prisma.JsonValue | Prisma.InputJsonValue | null,
): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fff]+/i)
    .map((token) => token.trim())
    .filter(Boolean);
}

function calculateLexicalScore(query: string, text: string | null) {
  if (!text) {
    return 0;
  }

  const queryTokens = new Set(tokenize(query));
  const textTokens = new Set(tokenize(text));

  if (queryTokens.size === 0 || textTokens.size === 0) {
    return 0;
  }

  let overlap = 0;

  for (const token of queryTokens) {
    if (textTokens.has(token)) {
      overlap += 1;
    }
  }

  return overlap / queryTokens.size;
}

function cosineSimilarity(left: number[], right: number[]) {
  if (left.length === 0 || right.length === 0 || left.length !== right.length) {
    return 0;
  }

  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }

  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

async function resolveEmbeddingRuntime(
  userId: string,
): Promise<ResolvedEmbeddingRuntime | null> {
  if (!PERSISTENT_MEMORY_EMBEDDINGS_ENABLED) {
    return null;
  }

  const credentials = await prisma.credential.findMany({
    where: {
      userId,
      provider: {
        in: ["GOOGLE", "OPENAI"],
      },
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
  });

  const preferredOrder = ["GOOGLE", "OPENAI"] as const;

  for (const provider of preferredOrder) {
    const credential = credentials.find((item) => item.provider === provider);

    if (!credential) {
      continue;
    }

    const secret = readCredentialSecret(credential.encryptedData);
    const field =
      typeof secret.apiKey === "string" && secret.apiKey.trim()
        ? "apiKey"
        : Object.entries(secret).find(
            ([, value]) => typeof value === "string" && value.trim(),
          )?.[0];

    if (!field) {
      continue;
    }

    const apiKey = secret[field];
    if (typeof apiKey !== "string" || !apiKey.trim()) {
      continue;
    }

    return {
      provider,
      credentialId: credential.id,
      credentialField: field,
      apiKey: apiKey.trim(),
      model: DEFAULT_EMBEDDING_MODELS[provider],
    };
  }

  return null;
}

async function createEmbeddingVector(params: {
  runtime: ResolvedEmbeddingRuntime;
  value: string;
  taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";
}) {
  if (!PERSISTENT_MEMORY_EMBEDDINGS_ENABLED) {
    return null;
  }

  const text = params.value.trim();

  if (!text) {
    return null;
  }

  if (params.runtime.provider === "GOOGLE") {
    const result = await embed({
      model: createGoogleProvider({
        apiKey: params.runtime.apiKey,
      }).textEmbeddingModel(params.runtime.model),
      value: text,
      providerOptions: {
        google: {
          taskType: params.taskType,
        },
      },
    });

    return result.embedding;
  }

  const result = await embed({
    model: createOpenAIProvider({
      apiKey: params.runtime.apiKey,
    }).textEmbeddingModel(params.runtime.model),
    value: text,
  });

  return result.embedding;
}

export function createPersistentMemoryState(params?: {
  entries?: PersistentMemoryEntry[];
  embeddingRuntime?: ResolvedEmbeddingRuntime | null;
}): RuntimePersistentMemoryState {
  const map = new Map<string, PersistentMemoryRecord>();

  for (const entry of params?.entries ?? []) {
    map.set(
      createPersistentMemoryIdentity(entry),
      {
        id: entry.id,
        scope: entry.scope,
        ownerId: entry.ownerId,
        userId: entry.userId,
        workflowId: entry.workflowId,
        namespace: entry.namespace,
        key: entry.key,
        value: entry.value,
        textValue: entry.textValue,
        embedding: Array.isArray(entry.embedding)
          ? entry.embedding.filter((value): value is number => typeof value === "number")
          : null,
        embeddingProvider: entry.embeddingProvider ?? null,
        embeddingModel: entry.embeddingModel ?? null,
        sourceExecutionId: entry.sourceExecutionId ?? null,
        sourceStepId: entry.sourceStepId ?? null,
        sourceNodeId: entry.sourceNodeId ?? null,
        updatedAt: entry.updatedAt,
      },
    );
  }

  return {
    entries: map,
    embeddingRuntime: params?.embeddingRuntime ?? null,
  };
}

export async function loadPersistentMemoryState(params: {
  userId: string | null;
  workflowId: string;
}) {
  if (!params.userId) {
    return createPersistentMemoryState();
  }

  const [entries, embeddingRuntime] = await Promise.all([
    prisma.persistentMemoryEntry.findMany({
      where: {
        userId: params.userId,
        OR: [
          {
            scope: PersistentMemoryScope.WORKFLOW,
            ownerId: params.workflowId,
          },
          {
            scope: PersistentMemoryScope.USER,
            ownerId: params.userId,
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    resolveEmbeddingRuntime(params.userId),
  ]);

  return createPersistentMemoryState({
    entries,
    embeddingRuntime,
  });
}

export function buildPersistentMemoryTemplateSnapshot(
  state: RuntimePersistentMemoryState,
): PersistentMemoryTemplateSnapshot {
  const workflowEntries = Array.from(state.entries.values()).filter(
    (entry) => entry.scope === PersistentMemoryScope.WORKFLOW,
  );
  const userEntries = Array.from(state.entries.values()).filter(
    (entry) => entry.scope === PersistentMemoryScope.USER,
  );

  return {
    workflow: materializeEntries(workflowEntries),
    user: materializeEntries(userEntries),
  };
}

export async function persistPersistentMemoryWrites(params: {
  executionId: string;
  workflowId: string;
  userId: string | null;
  stepId?: string;
  nodeId?: string;
  writes: RuntimePersistentMemoryWrite[];
  state: RuntimePersistentMemoryState;
}) {
  if (!params.userId) {
    return;
  }

  for (const write of params.writes) {
    if (!write.persist) {
      continue;
    }

    const namespace = write.namespace.trim() || "default";
    const key = write.key.trim();

    if (!key) {
      continue;
    }

    const scope = write.persistenceScope ?? PersistentMemoryScope.WORKFLOW;
    const ownerId =
      scope === PersistentMemoryScope.WORKFLOW
        ? params.workflowId
        : params.userId;
    const workflowId =
      scope === PersistentMemoryScope.WORKFLOW ? params.workflowId : null;
    const identity = createPersistentMemoryIdentity({
      scope,
      ownerId,
      namespace,
      key,
    });
    const existingEntry = params.state.entries.get(identity) ?? null;
    const nextValue = applyMemoryWriteMode(
      existingEntry?.value ?? null,
      write.value,
      write.mode ?? "REPLACE",
    );
    const textValue = stringifyValueForEmbedding(nextValue);
    let embedding = write.semanticIndex ? existingEntry?.embedding ?? null : null;
    let embeddingProvider = write.semanticIndex
      ? existingEntry?.embeddingProvider ?? null
      : null;
    let embeddingModel = write.semanticIndex
      ? existingEntry?.embeddingModel ?? null
      : null;

    if (write.semanticIndex && textValue && params.state.embeddingRuntime) {
      embedding = await createEmbeddingVector({
        runtime: params.state.embeddingRuntime,
        value: textValue,
        taskType: "RETRIEVAL_DOCUMENT",
      });
      embeddingProvider = params.state.embeddingRuntime.provider;
      embeddingModel = params.state.embeddingRuntime.model;
    }

    const valueChanged =
      !existingEntry ||
      serializeJsonValue(existingEntry.value) !== serializeJsonValue(nextValue);
    const textChanged =
      !existingEntry || (existingEntry.textValue ?? null) !== (textValue ?? null);
    const embeddingChanged =
      !existingEntry ||
      serializeJsonValue(
        (existingEntry.embedding ?? null) as Prisma.JsonValue | null,
      ) !==
        serializeJsonValue((embedding ?? null) as Prisma.JsonValue | null);

    if (!valueChanged && !textChanged && !embeddingChanged) {
      continue;
    }

    const embeddingValue = embedding
      ? (embedding as Prisma.InputJsonValue)
      : Prisma.DbNull;

    const persisted = await prisma.persistentMemoryEntry.upsert({
      where: {
        scope_ownerId_namespace_key: {
          scope,
          ownerId,
          namespace,
          key,
        },
      },
      create: {
        scope,
        ownerId,
        userId: params.userId,
        workflowId,
        namespace,
        key,
        value: nextValue,
        textValue,
        embedding: embeddingValue,
        embeddingProvider,
        embeddingModel,
        sourceExecutionId: params.executionId,
        sourceStepId: params.stepId ?? null,
        sourceNodeId: params.nodeId ?? null,
      },
      update: {
        value: nextValue,
        textValue,
        embedding: embeddingValue,
        embeddingProvider,
        embeddingModel,
        sourceExecutionId: params.executionId,
        sourceStepId: params.stepId ?? null,
        sourceNodeId: params.nodeId ?? null,
      },
    });

    params.state.entries.set(identity, {
      id: persisted.id,
      scope,
      ownerId,
      userId: params.userId,
      workflowId,
      namespace,
      key,
      value: nextValue as Prisma.JsonValue,
      textValue,
      embedding,
      embeddingProvider,
      embeddingModel,
      sourceExecutionId: params.executionId,
      sourceStepId: params.stepId ?? null,
      sourceNodeId: params.nodeId ?? null,
      updatedAt: persisted.updatedAt,
    });
  }
}

export async function recallPersistentMemoryMatches(params: {
  state: RuntimePersistentMemoryState;
  scope: PersistentMemoryScope;
  ownerId: string;
  query: string;
  limit: number;
}) {
  const query = params.query.trim();

  if (!query) {
    return [] as PersistentMemoryMatch[];
  }

  const candidates = Array.from(params.state.entries.values()).filter(
    (entry) => entry.scope === params.scope && entry.ownerId === params.ownerId,
  );

  if (candidates.length === 0) {
    return [] as PersistentMemoryMatch[];
  }

  let queryEmbedding: number[] | null = null;

  if (params.state.embeddingRuntime) {
    queryEmbedding = await createEmbeddingVector({
      runtime: params.state.embeddingRuntime,
      value: query,
      taskType: "RETRIEVAL_QUERY",
    });
  }

  return candidates
    .map((entry) => {
      const vectorScore =
        queryEmbedding && entry.embedding
          ? cosineSimilarity(queryEmbedding, entry.embedding)
          : 0;
      const lexicalScore = calculateLexicalScore(query, entry.textValue);
      const score = vectorScore > 0 ? vectorScore : lexicalScore;

      return {
        id: entry.id,
        scope: entry.scope,
        namespace: entry.namespace,
        key: entry.key,
        value: entry.value,
        textValue: entry.textValue,
        score,
        updatedAt: entry.updatedAt,
      } satisfies PersistentMemoryMatch;
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.updatedAt.getTime() - left.updatedAt.getTime();
    })
    .slice(0, params.limit);
}
