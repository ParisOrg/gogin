import { describe, expect, it } from "vitest";

import { app } from "../../src/worker";
import { proxyEndpoints } from "../../src/worker/routes/proxy";

describe("Proxy endpoint stubs", () => {
  it("keeps the proxy route table explicit", () => {
    expect(proxyEndpoints.map((endpoint) => `${endpoint.method} ${endpoint.path}`)).toEqual([
      "GET /v1/models",
      "GET /v1/models/:model",
      "POST /v1/chat/completions",
      "POST /v1/responses",
      "GET /v1/responses/:response_id",
      "DELETE /v1/responses/:response_id",
      "GET /v1/responses/:response_id/input_items",
      "POST /v1/responses/:response_id/cancel",
      "POST /v1/responses/input_tokens",
      "POST /v1/embeddings",
      "POST /v1/messages",
      "POST /v1/messages/count_tokens",
    ]);
  });

  it.each(proxyEndpoints)("$method $path returns a not implemented response", async (proxyEndpoint) => {
    const response = await app.request(examplePath(proxyEndpoint.path), {
      method: proxyEndpoint.method,
    });
    const body = await response.json();

    expect(response.status).toBe(501);
    assertRecord(body);
    assertRecord(body.error);
    assertRecord(body.endpoint);
    expect(body.error.code).toBe("not_implemented");
    expect(body.endpoint.method).toBe(proxyEndpoint.method);
    expect(body.endpoint.path).toBe(proxyEndpoint.path);
  });

  it("returns a structured 404 for unknown routes", async () => {
    const response = await app.request("/v1/unknown");
    const body = await response.json();

    expect(response.status).toBe(404);
    assertRecord(body);
    assertRecord(body.error);
    expect(body.error.code).toBe("not_found");
  });
});

function examplePath(path: string): string {
  return path.replace(":model", "test-model").replace(":response_id", "resp_test");
}

function assertRecord(value: unknown): asserts value is Record<string, unknown> {
  expect(typeof value).toBe("object");
  expect(value).not.toBeNull();
  expect(Array.isArray(value)).toBe(false);
}
