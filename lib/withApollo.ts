import { withApollo as createWithApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { PaginatedPosts } from "../src/generated/graphql";

const createClient = (ctx?: NextPageContext) => {
  const headers: any = typeof window === "undefined" ? ctx?.req?.headers : {};
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    uri: process.env.NEXT_PUBLIC_API_URL as string,
    credentials: "include",
    headers: { ...headers },
    // cookie:
    //   (typeof window === "undefined"
    //     ? ctx?.req?.headers.cookie
    //     : undefined) || "",
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });
};

export const withApollo = createWithApollo(createClient);
