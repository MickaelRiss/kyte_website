import { sign, verify, createPrivateKey, createPublicKey } from "crypto";
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

export const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAysSG93pDLjmsnY88yDT/71WqBHA8jr2vqdiYh2T/YlA=
-----END PUBLIC KEY-----`);

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function verifyAndDecodeLicenceKey(
  licenceKey: string,
): { customerId: string; payload: Record<string, unknown> } | { error: string; status: number } {
  const parts = licenceKey.split(".");
  if (parts.length !== 3) {
    return { error: "Invalid key format", status: 400 };
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  if (
    !verify(
      null,
      Buffer.from(`${headerB64}.${payloadB64}`),
      PUBLIC_KEY,
      base64urlDecode(signatureB64),
    )
  ) {
    return { error: "Invalid signature", status: 403 };
  }

  const payload = JSON.parse(base64urlDecode(payloadB64).toString("utf-8"));
  const customerId = payload.sub;
  if (!customerId || typeof customerId !== "string") {
    return { error: "Invalid payload", status: 400 };
  }

  return { customerId, payload };
}

export async function findActiveSubscription(
  stripe: Stripe,
  customerId: string,
): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  const activeSub = subscriptions.data[0];
  if (activeSub) return activeSub;

  const allSubs = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
  });

  const sub = allSubs.data[0];
  if (sub && getSubscriptionPeriodEnd(sub) > Math.floor(Date.now() / 1000)) {
    return sub;
  }

  return null;
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
