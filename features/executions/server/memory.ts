import prisma from "@/lib/db";
import {
  ExecutionMemoryScope,
  ExecutionMemoryVisibility,
  ExecutionMemoryWriteMode,
  PersistentMemoryScope,
  type Prisma,
} from "@/lib/prisma/client";

type MemoryEntryRecord = {
  executionId: string;
  scope: ExecutionMemoryScope;
  visibility: ExecutionMemoryVisibility;
  ownerNodeId: string;
  namespace: string;
  key: string;
  value: Prisma.JsonValue;
  sourceStepId: string | null;
};

export type RuntimeExecutionMemoryWrite = {
  scope: ExecutionMemoryScope;
  namespace: string;
  key: string;
  value: Prisma.InputJsonValue;
  ownerNodeId?: string;
  visibility?: ExecutionMemoryVisibility;
  mode?: ExecutionMemoryWriteMode;
  persist?: boolean;
  persistenceScope?: PersistentMemoryScope;
  semanticIndex?: boolean;
};

export type ExecutionMemoryTemplateSnapshot = {
  shared: Record<string, Prisma.JsonValue>;
  node: Record<string, Prisma.JsonValue>;
};

export type RuntimeExecutionMemoryState = {
  entries: Map<string, MemoryEntryRecord>;
};

type PersistMemoryWriteParams = {
  executionId: string;
  stepId?: string;
  nodeId?: string;
  writes: RuntimeExecutionMemoryWrite[];
  state: RuntimeExecutionMemoryState;
};

function createMemoryEntryIdentity(entry: {
  executionId: string;
  scope: ExecutionMemoryScope;
  ownerNodeId: string;
  namespace: string;
  key: string;
}) {
  return [
    entry.executionId,
    entry.scope,
    entry.ownerNodeId,
    entry.namespace,
    entry.key,
  ].join(":");
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
  } as Record<string, Prisma.InputJsonValue>;

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

    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${serializeJsonValue(record[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function applyMemoryWriteMode(
  current: Prisma.JsonValue | null,
  incoming: Prisma.InputJsonValue,
  mode: ExecutionMemoryWriteMode,
) {
  switch (mode) {
    case ExecutionMemoryWriteMode.MERGE:
      return mergeJsonValue(current, incoming);
    case ExecutionMemoryWriteMode.APPEND:
      return appendJsonValue(current, incoming);
    case ExecutionMemoryWriteMode.REPLACE:
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
  entries: Iterable<MemoryEntryRecord>,
): Record<string, Prisma.JsonValue> {
  const result: Record<string, Prisma.JsonValue> = {};

  for (const entry of entries) {
    setNestedValue(result, entry.namespace, entry.key, entry.value);
  }

  return result;
}

export function createExecutionMemoryState(
  entries: Array<{
    executionId: string;
    scope: ExecutionMemoryScope;
    visibility: ExecutionMemoryVisibility;
    ownerNodeId: string;
    namespace: string;
    key: string;
    value: Prisma.JsonValue;
    sourceStepId: string | null;
  }> = [],
): RuntimeExecutionMemoryState {
  const map = new Map<string, MemoryEntryRecord>();

  for (const entry of entries) {
    map.set(createMemoryEntryIdentity(entry), entry);
  }

  return {
    entries: map,
  };
}

export function buildExecutionMemoryTemplateSnapshot(
  state: RuntimeExecutionMemoryState,
  nodeId: string,
): ExecutionMemoryTemplateSnapshot {
  const sharedEntries = Array.from(state.entries.values()).filter(
    (entry) =>
      entry.scope === ExecutionMemoryScope.SHARED &&
      entry.visibility === ExecutionMemoryVisibility.PUBLIC,
  );
  const nodeEntries = Array.from(state.entries.values()).filter(
    (entry) =>
      entry.scope === ExecutionMemoryScope.NODE &&
      entry.ownerNodeId === nodeId,
  );

  return {
    shared: materializeEntries(sharedEntries),
    node: materializeEntries(nodeEntries),
  };
}

export async function persistExecutionMemoryWrites({
  executionId,
  stepId,
  nodeId,
  writes,
  state,
}: PersistMemoryWriteParams) {
  for (const write of writes) {
    const namespace = write.namespace.trim() || "default";
    const key = write.key.trim();

    if (!key) {
      continue;
    }

    const scope = write.scope;
    const ownerNodeId =
      scope === ExecutionMemoryScope.NODE
        ? write.ownerNodeId?.trim() || nodeId || ""
        : "";
    const visibility =
      write.visibility ??
      (scope === ExecutionMemoryScope.NODE
        ? ExecutionMemoryVisibility.PRIVATE
        : ExecutionMemoryVisibility.PUBLIC);
    const mode = write.mode ?? ExecutionMemoryWriteMode.REPLACE;
    const identity = createMemoryEntryIdentity({
      executionId,
      scope,
      ownerNodeId,
      namespace,
      key,
    });
    const existingEntry = state.entries.get(identity) ?? null;
    const nextValue = applyMemoryWriteMode(
      existingEntry?.value ?? null,
      write.value,
      mode,
    );

    if (
      existingEntry &&
      existingEntry.visibility === visibility &&
      serializeJsonValue(existingEntry.value) === serializeJsonValue(nextValue)
    ) {
      continue;
    }

    await prisma.executionMemoryEntry.upsert({
      where: {
        executionId_scope_ownerNodeId_namespace_key: {
          executionId,
          scope,
          ownerNodeId,
          namespace,
          key,
        },
      },
      create: {
        executionId,
        scope,
        visibility,
        ownerNodeId,
        namespace,
        key,
        value: nextValue,
        sourceStepId: stepId ?? null,
      },
      update: {
        visibility,
        value: nextValue,
        sourceStepId: stepId ?? null,
      },
    });

    await prisma.executionMemoryEvent.create({
      data: {
        executionId,
        stepId: stepId ?? null,
        nodeId: nodeId ?? "",
        scope,
        visibility,
        ownerNodeId,
        namespace,
        key,
        mode,
        value: nextValue,
      },
    });

    state.entries.set(identity, {
      executionId,
      scope,
      visibility,
      ownerNodeId,
      namespace,
      key,
      value: nextValue as Prisma.JsonValue,
      sourceStepId: stepId ?? null,
    });
  }
}

/**
 * Compress and save all execution memory entries to persistent memory.
 * Called after workflow execution completes to archive the final memory state.
 */
export async function compressExecutionMemoryToPersistent(params: {
  executionId: string;
  workflowId: string;
  userId: string;
  state: RuntimeExecutionMemoryState;
}) {
  const { executionId, workflowId, userId, state } = params;

  // Get all SHARED execution memory entries (these are the ones worth persisting)
  const sharedEntries = Array.from(state.entries.values()).filter(
    (entry) =>
      entry.scope === ExecutionMemoryScope.SHARED &&
      entry.visibility === ExecutionMemoryVisibility.PUBLIC,
  );

  if (sharedEntries.length === 0) {
    return;
  }

  // Group by namespace.key and keep only the latest value
  const latestEntries = new Map<string, {
    namespace: string;
    key: string;
    value: Prisma.JsonValue;
  }>();

  for (const entry of sharedEntries) {
    const compositeKey = `${entry.namespace}:${entry.key}`;
    const existing = latestEntries.get(compositeKey);

    // Keep the latest by comparing sourceStepId (higher position = later)
    if (!existing || (entry.sourceStepId && (!existing as unknown as { sourceStepId?: string }).sourceStepId)) {
      latestEntries.set(compositeKey, {
        namespace: entry.namespace,
        key: entry.key,
        value: entry.value,
      });
    }
  }

  // Save to persistent memory
  for (const entry of latestEntries.values()) {
    await prisma.persistentMemoryEntry.upsert({
      where: {
        scope_ownerId_namespace_key: {
          scope: PersistentMemoryScope.WORKFLOW,
          ownerId: workflowId,
          namespace: entry.namespace,
          key: entry.key,
        },
      },
      create: {
        scope: PersistentMemoryScope.WORKFLOW,
        ownerId: workflowId,
        userId,
        workflowId,
        namespace: entry.namespace,
        key: entry.key,
        value: entry.value as Prisma.InputJsonValue,
        sourceExecutionId: executionId,
      },
      update: {
        value: entry.value as Prisma.InputJsonValue,
        sourceExecutionId: executionId,
        updatedAt: new Date(),
      },
    });
  }
}
