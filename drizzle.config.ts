import { defineConfig } from "drizzle-kit";
import {readConfig} from "./dist/config.js";

const config = readConfig();
export default defineConfig({
  schema: "src/schema.ts",
  out: "src/lib/db",
  dialect: "postgresql",
  dbCredentials: {
    url: config.dbUrl,
  },
});