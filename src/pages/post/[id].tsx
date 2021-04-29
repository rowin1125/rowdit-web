import { Flex, Heading } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React from "react";
import EditOrDeletePost from "../../components/EditOrDeletePost";
import Layout from "../../components/Layout";
import { useGetPostFromUrl } from "../../hooks/useGetPostFromUrl";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Post: React.FC = () => {
  const [{ data, fetching }] = useGetPostFromUrl();
  if (fetching)
    return (
      <Layout>
        <div>Loading....</div>
      </Layout>
    );
  if (!data?.post) {
    return (
      <Layout>
        <div>No post found</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <Flex justifyContent="space-between">
        <Heading mb={4}>{data?.post?.title}</Heading>
        <EditOrDeletePost creatorId={data.post.creator.id} id={data.post.id} />
      </Flex>
      {data?.post?.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
