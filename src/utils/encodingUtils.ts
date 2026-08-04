import { JwtParsed } from "../types";

export function encodeBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    return btoa(binString);
  } catch (err: any) {
    throw new Error("Failed to Base64 encode text: " + err.message);
  }
}

export function decodeBase64(b64: string): string {
  try {
    const cleanB64 = b64.trim().replace(/\s+/g, "");
    const binString = atob(cleanB64);
    const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (err: any) {
    throw new Error("Invalid Base64 string format");
  }
}

export function parseJwtToken(token: string): JwtParsed {
  const cleanToken = token.trim().replace(/^Bearer\s+/i, "");
  const parts = cleanToken.split(".");

  if (parts.length !== 3) {
    return {
      raw: token,
      header: null,
      payload: null,
      signature: "",
      isValid: false,
      error: "Invalid JWT structure: A valid JWT must contain exactly 3 dot-separated parts (Header.Payload.Signature).",
    };
  }

  try {
    const headerStr = decodeBase64Url(parts[0]);
    const payloadStr = decodeBase64Url(parts[1]);

    const header = JSON.parse(headerStr);
    const payload = JSON.parse(payloadStr);

    let isExpired = false;
    let expiresAt: string | undefined;
    let issuedAt: string | undefined;
    let expiresInSeconds: number | undefined;

    if (payload.exp && typeof payload.exp === "number") {
      const expDate = new Date(payload.exp * 1000);
      expiresAt = expDate.toLocaleString() + " (" + expDate.toISOString() + ")";
      const now = Math.floor(Date.now() / 1000);
      expiresInSeconds = payload.exp - now;
      isExpired = expiresInSeconds <= 0;
    }

    if (payload.iat && typeof payload.iat === "number") {
      const iatDate = new Date(payload.iat * 1000);
      issuedAt = iatDate.toLocaleString() + " (" + iatDate.toISOString() + ")";
    }

    return {
      raw: cleanToken,
      header,
      payload,
      signature: parts[2],
      isValid: true,
      issuedAt,
      expiresAt,
      isExpired,
      expiresInSeconds,
    };
  } catch (err: any) {
    return {
      raw: token,
      header: null,
      payload: null,
      signature: parts[2] || "",
      isValid: false,
      error: "Failed to parse JWT JSON payloads: " + err.message,
    };
  }
}

function decodeBase64Url(b64url: string): string {
  let base64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeBase64(base64);
}

export function parseUrlQueryParams(urlStr: string): {
  protocol: string;
  host: string;
  pathname: string;
  hash: string;
  params: { key: string; value: string }[];
  error?: string;
} {
  try {
    let fullUrl = urlStr.trim();
    if (!/^https?:\/\//i.test(fullUrl) && !fullUrl.startsWith("http")) {
      fullUrl = "https://" + fullUrl;
    }

    const url = new URL(fullUrl);
    const params: { key: string; value: string }[] = [];

    url.searchParams.forEach((value, key) => {
      params.push({ key, value });
    });

    return {
      protocol: url.protocol,
      host: url.host,
      pathname: url.pathname,
      hash: url.hash,
      params,
    };
  } catch (err: any) {
    return {
      protocol: "",
      host: "",
      pathname: "",
      hash: "",
      params: [],
      error: "Invalid URL syntax",
    };
  }
}
