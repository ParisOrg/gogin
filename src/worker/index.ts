import { Hono } from "hono";

import { registerProxyRoutes } from "./routes/proxy";

export const app = new Hono();

app.get("/", (c) =>
  c.json({
    name: "gogin",
    status: "ok",
  }),
);

app.get("/healthz", (c) => c.json({ status: "ok" }));
app.get("/readyz", (c) => c.json({ status: "ok" }));

registerProxyRoutes(app);

app.notFound((c) =>
  c.json(
    {
      error: {
        message: "Route not found.",
        type: "not_found",
        param: null,
        code: "not_found",
      },
    },
    404,
  ),
);

app.onError((error, c) =>
  c.json(
    {
      error: {
        message: error.message,
        type: "internal_error",
        param: null,
        code: "internal_error",
      },
    },
    500,
  ),
);

export default app;
