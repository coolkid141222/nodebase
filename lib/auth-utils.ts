import "server-only";
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function requireAuth() {
    const requestHeaders = await headers();
    const forwardedProto = requestHeaders.get("x-forwarded-proto");
    const forwardedHost = requestHeaders.get("x-forwarded-host");
    const host = forwardedHost ?? requestHeaders.get("host");
    const origin = host
        ? `${forwardedProto ?? "http"}://${host}`
        : (process.env.BETTER_AUTH_URL ?? "http://localhost:3000");

    const response = await fetch(`${origin}/api/auth/get-session`, {
        method: "GET",
        headers: {
            cookie: requestHeaders.get("cookie") ?? "",
            "user-agent": requestHeaders.get("user-agent") ?? "",
        },
        cache: "no-store",
    });

    const session = response.ok ? await response.json() : null;

    if (!session) {
        redirect("/login")
    }

    return session
}
