/**
 * Reject common email TLD typos (e.g. `.cpm` instead of `.com`).
 */

const TLD_TYPOS: Readonly<Record<string, string>> = {
  cpm: "com",
  con: "com",
  cmo: "com",
  coom: "com",
  comm: "com",
  vom: "com",
  xom: "com",
  cim: "com",
  ner: "net",
  nrt: "net",
  nett: "net",
  orgg: "org",
};

/** Returns a user-facing message when the domain TLD looks like a typo; otherwise null. */
export function emailTldTypoMessage(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;

  const domain = email.slice(at + 1).toLowerCase();
  const dot = domain.lastIndexOf(".");
  if (dot < 0 || dot === domain.length - 1) return null;

  const tld = domain.slice(dot + 1);
  const suggested = TLD_TYPOS[tld];
  if (!suggested) return null;

  return `Check your email address — did you mean .${suggested}?`;
}
