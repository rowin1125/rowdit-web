import React, { useState } from "react";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>Query failed</div>;
  }
  return (
    <Layout>
      <Flex justifyContent="space-between" mb={4} align="center">
        <Heading>Rowdit</Heading>
        <NextLink href="/create-post" passHref>
          <Button as="a" variant="solid" colorScheme="green">
            Create Post
          </Button>
        </NextLink>
      </Flex>
      {!data && fetching ? (
        <div>Loading....</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Box p={5} shadow="md" borderWidth="1px" key={post.title}>
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex justifyContent="center" mt={8}>
          <Button
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            isLoading={fetching}
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
