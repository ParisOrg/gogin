import type { Context, Hono } from "hono";

type Method = "GET" | "POST" | "DELETE";

export type ProxyEndpoint = {
  method: Method;
  path: string;
};

export const proxyEndpoints = [
  {
    method: "GET",
    path: "/v1/models",
  },
  {
    method: "GET",
    path: "/v1/models/:model",
  },
  {
    method: "POST",
    path: "/v1/chat/completions",
  },
  {
    method: "POST",
    path: "/v1/responses",
  },
  {
    method: "GET",
    path: "/v1/responses/:response_id",
  },
  {
    method: "DELETE",
    path: "/v1/responses/:response_id",
  },
  {
    method: "GET",
    path: "/v1/responses/:response_id/input_items",
  },
  {
    method: "POST",
    path: "/v1/responses/:response_id/cancel",
  },
  {
    method: "POST",
    path: "/v1/responses/input_tokens",
  },
  {
    method: "POST",
    path: "/v1/embeddings",
  },
  {
    method: "POST",
    path: "/v1/messages",
  },
  {
    method: "POST",
    path: "/v1/messages/count_tokens",
  },
] satisfies ProxyEndpoint[];

export function registerProxyRoutes(app: Hono): void {
  for (const endpoint of proxyEndpoints) {
    app.on(endpoint.method, endpoint.path, (c) => notImplemented(c, endpoint));
  }
}

function notImplemented(c: Context, endpoint: ProxyEndpoint): Response {
  return c.json(
    {
      error: {
        message: "Endpoint is not implemented yet.",
        type: "not_implemented",
        param: null,
        code: "not_implemented",
      },
      endpoint: {
        method: endpoint.method,
        path: endpoint.path,
        request_path: c.req.path,
      },
    },
    501,
  );
}
