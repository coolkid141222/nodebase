import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { runManualWorkflow, testAI } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    testAI,
    runManualWorkflow,
  ],
});
