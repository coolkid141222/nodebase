import type { Prisma } from "@/lib/prisma/client";

export type ExecutionTemplateContext = {
  execution: {
    id: string;
    triggerType: string;
  };
  workflow: {
    id: string;
    name: string;
  };
  trigger: Prisma.JsonValue;
  input: Prisma.JsonValue | null;
  inputRaw: Prisma.JsonValue | null;
  inputs: Record<string, Prisma.JsonValue | Prisma.JsonValue[] | null>;
  inputsRaw: Record<string, Prisma.JsonValue | Prisma.JsonValue[] | null>;
  current: {
    status: string | null;
    input: Prisma.JsonValue | null;
    output: Prisma.JsonValue | null;
    error: Prisma.JsonValue | null;
  };
  memory: {
    shared: Record<string, Prisma.JsonValue>;
    node: Record<string, Prisma.JsonValue>;
  };
  upstream: Array<{
    connectionId: string;
    fromNodeId: string;
    fromNodeName: string;
    fromNodeType: string;
    fromOutput: string;
    toInput: string;
    data: Prisma.JsonValue | null;
    status: string | null;
    input: Prisma.JsonValue | null;
    output: Prisma.JsonValue | null;
    value: Prisma.JsonValue | null;
    error: Prisma.JsonValue | null;
  }>;
  steps: Record<
    string,
    {
      id: string;
      nodeId: string;
      nodeName: string;
      nodeType: string;
      status: string;
      input: Prisma.JsonValue | null;
      output: Prisma.JsonValue | null;
      error: Prisma.JsonValue | null;
    }
  >;
};

const TEMPLATE_PATTERN = /\{\{\s*([^}]+?)\s*\}\}/g;

function getPathValue(source: unknown, rawPath: string): unknown {
  const normalizedPath = rawPath.replace(/\[(\d+)\]/g, ".$1");
  const segments = normalizedPath.split(".").filter(Boolean);

  let current: unknown = source;

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = Number(segment);
      current = Number.isInteger(index) ? current[index] : undefined;
      continue;
    }

    if (typeof current === "object") {
      current = (current as Record<string, unknown>)[segment];
      continue;
    }

    return undefined;
  }

  return current;
}

export function resolveTemplateString(
  value: string,
  context: ExecutionTemplateContext,
): unknown {
  const matches = Array.from(value.matchAll(TEMPLATE_PATTERN));

  if (matches.length === 0) {
    return value;
  }

  if (matches.length === 1 && matches[0][0] === value) {
    return getPathValue(context, matches[0][1]);
  }

  return value.replace(TEMPLATE_PATTERN, (_, expression: string) => {
    const resolved = getPathValue(context, expression.trim());

    if (resolved === null || resolved === undefined) {
      return "";
    }

    if (typeof resolved === "object") {
      return JSON.stringify(resolved);
    }

    return String(resolved);
  });
}

export function resolveTemplateValue(
  value: Prisma.JsonValue,
  context: ExecutionTemplateContext,
): Prisma.InputJsonValue {
  if (typeof value === "string") {
    const resolved = resolveTemplateString(value, context);
    return (resolved ?? null) as Prisma.InputJsonValue;
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveTemplateValue(item, context));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        resolveTemplateValue(item as Prisma.JsonValue, context),
      ]),
    );
  }

  return value as Prisma.InputJsonValue;
}
