import { randomUUID } from "node:crypto";
import { inngest } from "./client";
import prisma from "@/lib/db";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("fetching", "5s");
    await step.sleep("processing", "5s");
    
    await step.run("create-workflow", () => {
        return prisma.workflow.create({
            data:{
                id: randomUUID(),
                name: "Workflow-create-from-inngest",
            }
        })
    })
    return { message: `Hello ${event.data.email}!` };
  },
);