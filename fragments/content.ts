import { ResultOf } from "gql.tada";
import { StructuredTextGraphQlResponse } from "react-datocms";

import { FragmentOf, graphql, readFragment } from "@/lib/graphql";

import { ResponsiveImage } from "./responsive-image";

export const Content = graphql(
  `
    fragment Content on PostModelContentField {
      value
      blocks {
        __typename
        ... on ImageBlockRecord {
          id
          image {
            responsiveImage(
              imgixParams: { fit: crop, w: 300, h: 300, auto: format }
            ) {
              ...ResponsiveImage
            }
          }
        }
      }
    }
  `,
  [ResponsiveImage]
);

type Block = ResultOf<typeof Content>["blocks"][number];

export const readContentFragment = (content: FragmentOf<typeof Content>) => {
  return readFragment(Content, content) as StructuredTextGraphQlResponse<Block>;
};
