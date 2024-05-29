import { NextResponse } from "next/server";

import { CacheTag } from "@/lib/cache-tags";
import { invalidateCacheTags } from "@/lib/netlify-invalidation-strategy";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request: Request) {
  if (request.headers.get("Webhook-Token") !== process.env.WEBHOOK_TOKEN) {
    return NextResponse.json(
      {
        error:
          'This endpoint requires an "Webhook-Token" header with a secret token.',
      },
      { status: 401 },
    );
  }

  // Read the request content: that's a comma separated list of cache tags sent
  // by DatoCMS as the body of the webhook.
  const body = await request.text();

  const data = JSON.parse(body);

  const cacheTags = data["entity"]["attributes"]["tags"].map(
    (tag: string) => tag as CacheTag,
  );

  await invalidateCacheTags(cacheTags);

  return NextResponse.json({ cacheTags });
}
