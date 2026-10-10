import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Serve R2 uploads at `/media/*`, ahead of SSR.
 *
 * This TanStack Start version has no server-route API, so the Worker fetch is
 * the only place a non-React response can be produced. Range support matters
 * for PDF viewers, which fetch the trailer before the body.
 */
async function serveMedia(request: Request, env: unknown): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/media/")) return undefined;

  const bucket = resolveMediaBucket(request, env);
  if (!bucket) return new Response("Media storage unavailable", { status: 503 });

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
  }

  const key = decodeURIComponent(url.pathname.slice("/media/".length));
  if (!key || key.includes("..")) return new Response("Not found", { status: 404 });

  const rangeHeader = request.headers.get("range");
  const object = await bucket.get(key, rangeHeader ? { range: request.headers } : undefined);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("accept-ranges", "bytes");
  // Keys embed a UUID, so a given URL never changes content.
  headers.set("cache-control", "public, max-age=31536000, immutable");

  const body = request.method === "HEAD" ? null : object.body;
  const range = object.range as { offset?: number; length?: number } | undefined;

  if (rangeHeader && range && typeof range.offset === "number") {
    const start = range.offset;
    const end = start + (range.length ?? object.size - start) - 1;
    headers.set("content-range", `bytes ${start}-${end}/${object.size}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(body, { status: 206, headers });
  }

  headers.set("content-length", String(object.size));
  return new Response(body, { headers });
}

type MediaEnv = { MEDIA?: R2Bucket };
type RuntimeRequest = Request & { runtime?: { cloudflare?: { env?: MediaEnv } } };

function resolveMediaBucket(request: Request, env: unknown): R2Bucket | undefined {
  return (
    (request as RuntimeRequest).runtime?.cloudflare?.env?.MEDIA ??
    (globalThis as { __env__?: MediaEnv }).__env__?.MEDIA ??
    (env as MediaEnv | undefined)?.MEDIA
  );
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const media = await serveMedia(request, env);
      if (media) return media;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
