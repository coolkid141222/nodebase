import { inngest } from "./client";
import { generateText } from "ai";
import { google } from "@/lib/ai/proxy";
import { zhipu } from "ai-sdk-zhipu";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { runExecution } from "@/features/executions/server/execution-runner";

const deepseek = createDeepSeek();

export const testAI = inngest.createFunction(
  { id: "AI-providers" },
  { event: "test/ai.providers" },
  async ({ step }) => {
    await step.sleep("pretend", "5s");

    const gemini = await step.ai.wrap(
      "Gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        messages: [
          { role: "system", content: "You are a good student!" },
          { role: "user", content: "In math, 1 + 1 = ?" },
        ],
      }
    );

    await step.sleep("gap", "3s");

    const zhipuRes = await step.ai.wrap(
      "zhipu-generate-text",
      generateText,
      {
        model: zhipu("glm-4.7"),
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "What is the capital of France?" },
          { role: "assistant", content: "The capital of France is Paris." },
          { role: "user", content: "And what about Germany?" },
        ],
      }
    );
    
    await step.sleep("gap", "3s");

    const deepseekRes = await step.ai.wrap(
      "DeepSeek-generate-text",
      generateText,
      {
        model: deepseek('deepseek-chat'),
        messages: [
          { role: "system", content: "You are a good student!" },
          { role: "user", content: "In math, 1 + 1 = ?" },
        ],
      }
    );

    return {
      geminiText: gemini.text,
      geminiUsage: gemini.usage,
      zhipuText: zhipuRes.text,
      zhipuUsage: zhipuRes.usage,
      deepseekText: deepseekRes.text,
      deepseekUsage: deepseekRes.usage,
    };
  }
);

export const runManualWorkflow = inngest.createFunction(
  { id: "workflow-manual-execution" },
  { event: "workflow/manual.triggered" },
  async ({ event, step }) => {
    const execution = await step.run("run-manual-workflow", async () => {
      return runExecution(event.data.executionId);
    });

    return {
      executionId: event.data.executionId,
      status: execution?.status ?? "UNKNOWN",
    };
  },
);
