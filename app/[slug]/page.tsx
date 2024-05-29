import Link from "next/link";
import React from "react";

import { executeQuery } from "@/lib/fetch-contents";

const CURRENT_POST_QUERY = `
query CurrentPost($slug: String) {
  currentPost: post(filter: { slug: { eq: $slug }}) {
    slug
    title
    content {
      value
    }
    _firstPublishedAt
    author {
      id
      name
    }
  }
}
`;

const PREVIOUS_AND_NEXT_POSTS_QUERY = `
query PreviousAndNextPosts($firstPublishedAt: DateTime, $slug: String) {
  previousPost: post(
    orderBy: _firstPublishedAt_DESC,
    filter: {slug: {neq: $slug}, _firstPublishedAt: {lt: $firstPublishedAt}}
  ) {
    id
    title
    slug
    _status
    _firstPublishedAt
  }
  
  nextPost: post(
    orderBy: _firstPublishedAt_ASC,
    filter: {slug: {neq: $slug}, _firstPublishedAt: {gt: $firstPublishedAt}}
  ) {
    id
    title
    slug
    _status
    _firstPublishedAt
  }
}
`;

export const dynamic = "error";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function Page({ params }: Props) {
  const { slug } = params;

  const { data: currentPostData, tags: currentPostTags } = await executeQuery(
    CURRENT_POST_QUERY,
    { slug },
  );

  const { currentPost } = currentPostData;
  const { _firstPublishedAt: firstPublishedAt } = currentPost;

  const { data: previousAndNextPostsData, tags: previousAndNextPostsTags } =
    await executeQuery(PREVIOUS_AND_NEXT_POSTS_QUERY, {
      firstPublishedAt,
      slug,
    });

  const { previousPost, nextPost } = previousAndNextPostsData;

  return (
    <>
      <h1>{currentPost.title}</h1>

      <p><Link href={`/authors/${currentPost.author.id}`}>{currentPost.author.name}</Link></p>

      <ul className="horizontal navigation">
        <li>
          Previous:{" "}
          {previousPost ? (
            <Link href={`/${previousPost.slug}`}>{previousPost.title}</Link>
          ) : (
            "—"
          )}
        </li>
        <li>
          Next:{" "}
          {nextPost ? (
            <Link href={`/${nextPost.slug}`}>{nextPost.title}</Link>
          ) : (
            "—"
          )}
        </li>
      </ul>

      <footer>
        <p>
          Cache tags from page queries:
          <code>
            {JSON.stringify([...currentPostTags, ...previousAndNextPostsTags])}
          </code>
        </p>
      </footer>
    </>
  );
}

export default Page;
