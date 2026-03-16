import { sign, createPrivateKey } from "crypto";
import type Stripe from "stripe";

// Lazily parsed on first use — avoids crashing at import time in test environments.
let _privateKey: ReturnType<typeof createPrivateKey> | null = null;
function getPrivateKey() {
  if (!_privateKey) {
    _privateKey = createPrivateKey(
      process.env.ED25519_PRIVATE_KEY!.replace(/\\n/g, "\n").replace(/^ +| +$/gm, ""),
    );
  }
  return _privateKey;
}

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

export function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription | null | undefined,
): number {
  return subscription?.items?.data[0]?.current_period_end ?? 0;
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
  const signature = sign(null, Buffer.from(signedContent), getPrivateKey());
  return `${signedContent}.${base64urlEncode(signature)}`;
}
