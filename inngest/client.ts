import { Inngest } from "inngest";

const appVersion =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.NEXT_DEPLOYMENT_ID ||
  undefined;

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "nodebase",
  ...(appVersion
    ? {
        appVersion,
      }
    : {}),
});
