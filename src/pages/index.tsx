import React from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

import Layout from "../components/Layout";
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import UpdootSection from "../components/UpdootSection";

import EditOrDeletePost from "../components/EditOrDeletePost";
import { withApollo } from "../../lib/withApollo";
import { initializeApollo, addApolloState } from "../../lib/apolloClient";
import { GetStaticProps } from "next";

const Index = () => {
  // TODO: make ssr
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 5,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <Layout>
        <div>Query failed</div>
        <div>{error?.message}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {!data && loading ? (
        <div>Loading....</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) =>
            !post ? null : (
              <Flex p={5} shadow="md" borderWidth="1px" key={post.id}>
                <UpdootSection post={post} />
                <Box flex={1}>
                  <NextLink href={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text color="gray.400">
                    posted by {post.creator.username}
                  </Text>
                  <Flex>
                    <Text flex={1} mt={4}>
                      {post.textSnippet}
                    </Text>

                    <EditOrDeletePost
                      creatorId={post.creator.id}
                      id={post.id}
                    />
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex justifyContent="center" mt={8}>
          <Button
            onClick={() =>
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              })
            }
            isLoading={loading}
            as="a"
            variant="solid"
            colorScheme="blue"
          >
            Load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({
    query: PostsDocument,
    variables: {
      limit: 5,
      cursor: null as null | string,
    },
  });

  return addApolloState(apolloClient, {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  });
};

export default Index;
// export default withApollo({ ssr: true })(Index);
