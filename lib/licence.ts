import { createSign } from "crypto";

// Parsed once at module load — avoids re-processing on every key generation.
const PRIVATE_KEY = process.env.ED25519_PRIVATE_KEY!.replace(/\\n/g, "\n");

export function base64urlEncode(data: string | Buffer): string {
  const buf = typeof data === "string" ? Buffer.from(data) : data;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function base64urlDecode(str: string): Buffer {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "==".slice(0, (4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64");
}

export function generateLicenceKey(customerId: string, periodEnd: number): string {
  const header = base64urlEncode(JSON.stringify({ alg: "EdDSA", typ: "licence" }));
  const payload = base64urlEncode(
    JSON.stringify({
      sub: customerId,
      features: ["passphrase", "variable_fragments", "decoy"],
      fragment_limit: 10,
      iat: Math.floor(Date.now() / 1000),
      exp: periodEnd,
    }),
  );
  const signedContent = `${header}.${payload}`;
  const signer = createSign("Ed25519");
  signer.update(signedContent);
  const signature = signer.sign(PRIVATE_KEY);
  return `${signedContent}.${base64urlEncode(signature)}`;
}
