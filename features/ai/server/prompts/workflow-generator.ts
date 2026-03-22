/**
 * Static prompt content for the workflow generator LLM.
 * Extracted from `workflow-generator.ts` to reduce file size and improve maintainability.
 */

import type { WorkflowGenerationMode } from "../../workflow-generator/shared";

const MODE_INSTRUCTIONS: Record<WorkflowGenerationMode, string> = {
  SIMPLE: [
    "Generation mode: SIMPLE",
    "- Prefer the smallest clear graph.",
    "- Avoid adding loops, extra AI steps, or tools unless the user explicitly asks for them.",
    "- Stay close to 2-3 nodes when possible.",
  ].join("\n"),
  PROBLEM_SOLVER: [
    "Generation mode: PROBLEM_SOLVER",
    "- Expand the workflow into a multi-stage problem-solving graph.",
    "- Prefer analyze -> optional refine -> final answer -> delivery.",
    "- Use at least two AI processing nodes for non-trivial requests.",
  ].join("\n"),
  RESEARCH_DELIVERY: [
    "Generation mode: RESEARCH_DELIVERY",
    "- Generate a fixed browser -> analyze -> loop -> final answer -> Feishu skeleton where the LOOP node controls the refinement body.",
    "- Use one browser tool first, one analysis node, one local refinement loop, one final answer node, and one native Feishu delivery node.",
    "- Stabilize memory around problem.task, problem.raw, problem.url, research.context, analysis.summary, refinement.draft, and answers.final.",
    "- Assume the trigger payload carries the task text and research URL for the browser step.",
  ].join("\n"),
  AUTO: [
    "Generation mode: AUTO",
    "- Pick the smallest workflow that still solves the request correctly.",
    "- Expand into multiple stages when the request implies analysis, research, refinement, or delivery.",
  ].join("\n"),
};

/**
 * Build the full workflow generator prompt.
 * The credential and tool inventories are injected dynamically.
 */
export function buildWorkflowGeneratorPrompt(params: {
  userPrompt: string;
  credentialInventory: string;
  toolInventory: string;
  mode: WorkflowGenerationMode;
}): string {
  const modeInstruction = MODE_INSTRUCTIONS[params.mode] ?? MODE_INSTRUCTIONS.AUTO;

  return `
You are generating a Nodebase workflow draft for a visual low-code editor.

Supported node types:
- MANUAL_TRIGGER: starts the workflow manually. Config keys: memoryWrites.
- WEBHOOK_TRIGGER: starts the workflow from an inbound webhook. Config keys: memoryWrites.
- AI_TEXT: generate text. Config keys: provider, model, prompt, system, credentialName, credentialField, memoryWrites.
- HTTP_REQUEST: make an HTTP request. Config keys: endpoint, method, body, authType, credentialName, credentialField, headerName, memoryWrites.
- LOOP: controls a local repeated cycle. Config keys: maxIterations, memoryWrites.
- TOOL: call a runtime tool. Config keys: provider, serverId, toolId, argumentsJson, memoryWrites.
- DISCORD_MESSAGE: send content to Discord. Config keys: content, credentialName, credentialField, memoryWrites.
- SLACK_MESSAGE: send content to Slack. Config keys: content, credentialName, credentialField, memoryWrites.

Template rules:
- Use {{input}} for the previous node's semantic output.
- Use {{inputRaw}} for raw output.
- Use {{current.attempt}} inside loop bodies.
- Use {{memory.shared.run.trigger.body.<field>}} when you need trigger payload values.

Memory rules:
- Use shared memory for values that later nodes must read again.
- Use node private memory for scratch output, intermediate reasoning, or drafts that should not become the workflow-wide source of truth.
- Prefer a small number of stable shared keys such as:
  - problem.task
  - research.context
  - answers.final
- Good memoryWrites examples:
  - {"scope":"SHARED","namespace":"problem","key":"task","value":"{{trigger.body.message}}","mode":"REPLACE","visibility":"PUBLIC","persist":true,"persistenceScope":"WORKFLOW","semanticIndex":false}
  - {"scope":"SHARED","namespace":"research","key":"context","value":"{{current.output.result}}","mode":"REPLACE","visibility":"PUBLIC","persist":true,"persistenceScope":"WORKFLOW","semanticIndex":false}
  - {"scope":"NODE","namespace":"analysis","key":"draft","value":"{{current.output.text}}","mode":"REPLACE","visibility":"PRIVATE","persist":false,"persistenceScope":"WORKFLOW","semanticIndex":false}

Problem-solving rules:
- When the request needs external information, create a TOOL node before AI reasoning.
- Prefer MCP ddg-search for free web search (no API key needed).
- Prefer INTERNAL tool "internal.browser_page" for fetching specific web pages.
- If the user mentions Feishu, Lark, or 飞书, prefer a TOOL node with provider "FEISHU" and toolId "feishu.message.send".
- Do not use HTTP_REQUEST for Feishu webhook delivery when the native Feishu tool is available.
- After a TOOL node, feed the extracted result into an AI_TEXT node with {{input}}.
- Use LOOP only when iterative refinement is part of the strategy.
- For non-trivial problem-solving prompts, use at least two processing nodes.
- Prefer a structure like: gather context -> analyze -> final answer.
- For research and delivery prompts, prefer a structure like: browser -> analyze -> loop -> final -> Feishu.
- For task dispatch, messaging, or Feishu delivery prompts, prefer a structure like: trigger -> analyze -> optional refinement loop -> final formatted message -> delivery.
- When a request sounds complex, multi-stage, or user-facing, target at least 4 nodes instead of collapsing everything into one AI node.
- Do not collapse a research or investigation workflow into a single AI_TEXT node unless the user explicitly asks for the smallest possible flow.

Loop rules:
- A local loop uses exactly one LOOP node.
- Upstream nodes connect directly to the first body node with DEFAULT edges.
- Downstream nodes connect directly from the last body node with DEFAULT edges.
- Use exactly two loop-specific edges:
  - LOOP_BODY: go from LOOP to the first node inside the repeated body.
  - LOOP_BACK: go from the last repeated body node back into LOOP.
- All other edges should use DEFAULT.

Layout rules:
- Return column and row for each node.
- Keep flows left-to-right.
- Place LOOP above or beside the nodes it controls, but keep the body readable.

Credential inventory you may reference by credentialName:
${params.credentialInventory}

Available tools:
${params.toolInventory}

Preferred tool usage:
- internal.browser_page
  - Use for fetching and reading specific web pages.
  - provider: INTERNAL
  - Use includeLinks:true to get all links from a page for further processing
  - argumentsJson example: {"url":"https://example.com","maxChars":4000,"includeLinks":true}
- ddg-search (MCP DuckDuckGo)
  - Use for free web search without API keys.
  - provider: MCP, serverId: ddg-search
  - IMPORTANT: Use toolId: duckduckgo_web_search (exact tool name)
  - argumentsJson example: {"query":"search term","count":10,"safeSearch":"moderate"}
- feishu.message.send
  - Use to send the final text result to Feishu / Lark.
  - provider: FEISHU
  - argumentsJson example: {"text":"{{memory.shared.answers.final}}"}

News/research workflow pattern:
- Use MCP ddg-search with serverId: ddg-search and toolId: duckduckgo_web_search
- Use INTERNAL browser_page tool for fetching web pages

Important constraints:
- Use exactly one trigger node.
- Do not use node types outside the supported list.
- Prefer concrete prompts and URLs.
- If a credential is needed, reference a matching credentialName from the inventory when possible.
- Return strict JSON only. No markdown, no explanation.

${modeInstruction}

Required JSON shape:
{
  "title": "Workflow title",
  "summary": "What this workflow does",
  "notes": ["optional implementation notes"],
  "nodes": [
    {
      "id": "trigger",
      "type": "WEBHOOK_TRIGGER",
      "column": 0,
      "row": 1,
      "config": {
        "memoryWrites": [
          {
            "scope": "SHARED",
            "namespace": "problem",
            "key": "task",
            "value": "{{trigger.body.message}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          },
          {
            "scope": "SHARED",
            "namespace": "problem",
            "key": "raw",
            "value": "{{trigger.body}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          },
          {
            "scope": "SHARED",
            "namespace": "problem",
            "key": "url",
            "value": "{{trigger.body.url}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          }
        ]
      }
    },
    {
      "id": "research",
      "type": "TOOL",
      "column": 1,
      "row": 1,
      "config": {
        "provider": "INTERNAL",
        "toolId": "internal.browser_page",
        "argumentsJson": "{\"url\":\"{{trigger.body.url}}\",\"maxChars\":4000,\"includeLinks\":true}",
        "memoryWrites": [
          {
            "scope": "SHARED",
            "namespace": "research",
            "key": "context",
            "value": "{{current.output.result}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          },
          {
            "scope": "SHARED",
            "namespace": "research",
            "key": "url",
            "value": "{{current.output.finalUrl}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          },
          {
            "scope": "SHARED",
            "namespace": "research",
            "key": "summary",
            "value": "{{current.output.excerpt}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          }
        ]
      }
    },
    {
      "id": "analyze",
      "type": "AI_TEXT",
      "column": 2,
      "row": 1,
      "config": {
        "provider": "DEEPSEEK",
        "model": "deepseek-chat",
        "credentialName": "DeepSeek API",
        "credentialField": "apiKey",
        "prompt": "Analyze the browser output into a concise research brief.\n\nShared task:\n{{memory.shared.problem.task}}\n\nShared URL:\n{{memory.shared.problem.url}}\n\nBrowser context:\n{{input}}",
        "memoryWrites": [
          {
            "scope": "NODE",
            "namespace": "analysis",
            "key": "draft",
            "value": "{{current.output.text}}",
            "mode": "REPLACE",
            "visibility": "PRIVATE",
            "persist": false,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          },
          {
            "scope": "SHARED",
            "namespace": "analysis",
            "key": "summary",
            "value": "{{current.output.text}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          }
        ]
      }
    },
    {
      "id": "loop",
      "type": "LOOP",
      "column": 3,
      "row": 0,
      "config": {
        "maxIterations": 3,
        "memoryWrites": [
          {
            "scope": "SHARED",
            "namespace": "loop",
            "key": "attempt",
            "value": "{{current.output.attempt}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": false,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          },
          {
            "scope": "SHARED",
            "namespace": "loop",
            "key": "isFinalAttempt",
            "value": "{{current.output.isFinalAttempt}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": false,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          },
          {
            "scope": "SHARED",
            "namespace": "loop",
            "key": "maxIterations",
            "value": "{{current.output.maxIterations}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": false,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          }
        ]
      }
    },
    {
      "id": "refine",
      "type": "AI_TEXT",
      "column": 4,
      "row": 1,
      "config": {
        "provider": "MINIMAX",
        "model": "MiniMax-M2.5",
        "credentialName": "MiniMax API",
        "credentialField": "apiKey",
        "prompt": "Refine the current draft for loop attempt {{current.attempt}}.\n\nShared task:\n{{memory.shared.problem.task}}\n\nAnalysis summary:\n{{memory.shared.analysis.summary}}\n\nPrevious draft:\n{{memory.node.refinement.draft}}\n\nUpstream draft:\n{{input}}",
        "memoryWrites": [
          {
            "scope": "NODE",
            "namespace": "refinement",
            "key": "draft",
            "value": "{{current.output.text}}",
            "mode": "REPLACE",
            "visibility": "PRIVATE",
            "persist": false,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          },
          {
            "scope": "SHARED",
            "namespace": "analysis",
            "key": "refined",
            "value": "{{current.output.text}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          }
        ]
      }
    },
    {
      "id": "final_message",
      "type": "AI_TEXT",
      "column": 5,
      "row": 1,
      "config": {
        "provider": "MINIMAX",
        "model": "MiniMax-M2.5",
        "credentialName": "MiniMax API",
        "credentialField": "apiKey",
        "prompt": "Turn the refined draft into the final Feishu-ready answer.\n\nShared task:\n{{memory.shared.problem.task}}\n\nAnalysis summary:\n{{memory.shared.analysis.summary}}\n\nRefined draft:\n{{input}}",
        "memoryWrites": [
          {
            "scope": "SHARED",
            "namespace": "answers",
            "key": "final",
            "value": "{{current.output.text}}",
            "mode": "REPLACE",
            "visibility": "PUBLIC",
            "persist": true,
            "persistenceScope": "WORKFLOW",
            "semanticIndex": false
          }
        ]
      }
    },
    {
      "id": "deliver_feishu",
      "type": "TOOL",
      "column": 6,
      "row": 1,
      "config": {
        "provider": "FEISHU",
        "toolId": "feishu.message.send",
        "argumentsJson": "{\n  \"text\": \"{{memory.shared.answers.final}}\"\n}",
        "memoryWrites": []
      }
    }
  ],
  "edges": [
    { "source": "trigger", "target": "research", "role": "DEFAULT" },
    { "source": "research", "target": "analyze", "role": "DEFAULT" },
    { "source": "analyze", "target": "refine", "role": "DEFAULT" },
    { "source": "loop", "target": "refine", "role": "LOOP_BODY" },
    { "source": "refine", "target": "loop", "role": "LOOP_BACK" },
    { "source": "refine", "target": "final_message", "role": "DEFAULT" },
    { "source": "final_message", "target": "deliver_feishu", "role": "DEFAULT" }
  ]
}

User request:
${params.userPrompt}
`.trim();
}
