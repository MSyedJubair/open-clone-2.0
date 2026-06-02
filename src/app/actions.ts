"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { buildChannel } from "@/inngest/channels";

export async function getRealtimeToken(
  projectId: string
) {
  return getClientSubscriptionToken(inngest, {
    channel: buildChannel({ projectId }),
    topics: ["status", "files"],
  });
}