import "server-only";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function parseEmailAllowlist(rawValue: string | undefined) {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean);
}

export const googleAuthConfig =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    : null;

export const githubAuthConfig =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }
    : null;

export const emailSignupAllowlist = new Set(
  parseEmailAllowlist(process.env.EMAIL_SIGNUP_ALLOWLIST),
);

export const authUiConfig = {
  googleEnabled: googleAuthConfig !== null,
  githubEnabled: githubAuthConfig !== null,
  ownerEmailSignupEnabled: emailSignupAllowlist.size > 0,
};

export function isEmailSignupAllowed(email: string) {
  return emailSignupAllowlist.has(normalizeEmail(email));
}
