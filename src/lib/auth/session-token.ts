// Web Crypto API HMAC token generator and verifier for Next.js Middleware & Client

const TOKEN_SALT = "DG_SARABUN_AUTH_SECURE_TOKEN_SALT_2569";

export interface TokenPayload {
  userId: string;
  roles: string[];
  issuedAt: number;
  expiresAt: number;
}

// Convert string to hex
function buf2hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

// Simple SHA-256 HMAC digest
async function computeHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(TOKEN_SALT);
  const msgData = encoder.encode(data);

  try {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
    return buf2hex(signature);
  } catch {
    // Fallback simple checksum if subtle crypto is somehow not available
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
}

export async function createSignedSessionToken(userId: string, roles: string[]): Promise<string> {
  const now = Date.now();
  const payload: TokenPayload = {
    userId,
    roles,
    issuedAt: now,
    expiresAt: now + 8 * 60 * 60 * 1000, // 8 hours
  };

  const payloadStr = JSON.stringify(payload);
  const encodedPayload = btoa(unescape(encodeURIComponent(payloadStr)));
  const signature = await computeHash(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifySignedSessionToken(tokenString: string): Promise<TokenPayload | null> {
  if (!tokenString || !tokenString.includes(".")) return null;

  try {
    const [encodedPayload, receivedSignature] = tokenString.split(".");
    if (!encodedPayload || !receivedSignature) return null;

    const expectedSignature = await computeHash(encodedPayload);
    if (receivedSignature !== expectedSignature) {
      return null; // Tampered token!
    }

    const jsonStr = decodeURIComponent(escape(atob(encodedPayload)));
    const payload: TokenPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.expiresAt) {
      return null; // Expired!
    }

    return payload;
  } catch {
    return null;
  }
}
