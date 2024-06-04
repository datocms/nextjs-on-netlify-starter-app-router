import React from "react";

import { executeQuery } from "@/lib/fetch-contents";
import { graphql } from "@/lib/graphql";
import { ResponsiveImage } from "@/fragments/responsive-image";
import ContentImage from "@/components/ResponsiveImage";

const AUTHOR_QUERY = graphql(
  `
    query Author($id: ItemId) {
      author(filter: { id: { eq: $id } }) {
        name
        picture {
          responsiveImage(
            imgixParams: { fm: jpg, fit: crop, w: 2000, h: 1000 }
          ) {
            ...ResponsiveImage
          }
        }
      }
    }
  `,
  [ResponsiveImage]
);

export const dynamic = "error";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function Page({ params }: Props) {
  const { id } = params;

  const { data: authorData, cacheTags: authorTags } = await executeQuery(
    AUTHOR_QUERY,
    { id }
  );

  const { author } = authorData;

  if (!author) return null;

  return (
    <>
      <article className="grid">
        {author.picture?.responsiveImage && (
          <ContentImage responsiveImage={author.picture.responsiveImage} />
        )}
        <h1>
          <span
            data-tooltip={`The content of this page is generated with a GraphQL query that also returned these cache tags: "${authorTags.join(
              ", "
            )}"`}
            data-placement="bottom"
          >
            {author.name}
          </span>
        </h1>
      </article>
    </>
  );
}

export default Page;
