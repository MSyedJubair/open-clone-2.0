// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { buildCode, editCode } from "@/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [ buildCode, editCode ],
});