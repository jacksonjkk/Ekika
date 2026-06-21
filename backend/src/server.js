import http from "node:http";
import { createApp } from "./app.js";
import { config, validateProductionConfig } from "./config.js";
import { createSupabaseClient } from "./supabase-client.js";
import { createSupabaseAuth } from "./supabase-auth.js";

validateProductionConfig(config);
const supabase = createSupabaseClient();
const authProvider = createSupabaseAuth(config);
const server = http.createServer(createApp({ supabase, appConfig: config, authProvider }));

server.listen(config.port, config.host, () => {
  console.log(`Ekika API listening on http://${config.host}:${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down.`);
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
