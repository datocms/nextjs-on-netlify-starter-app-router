import { revalidateTag } from "next/cache";

import type { CacheTag } from './cache-tags';

export async function invalidateCacheTags(cacheTags: CacheTag[]) {
  for (const tag of cacheTags) {
    revalidateTag(tag.toLowerCase());
  }
}
