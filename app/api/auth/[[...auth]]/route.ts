import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const runtime = "nodejs";
export const maxDuration = 300;

export const { GET, POST } = toNextJsHandler(auth);
