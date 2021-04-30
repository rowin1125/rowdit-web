import { Flex, Heading } from "@chakra-ui/layout";

import React from "react";
import { withApollo } from "../../../lib/withApollo";
import EditOrDeletePost from "../../components/EditOrDeletePost";
import Layout from "../../components/Layout";
import { useGetPostFromUrl } from "../../hooks/useGetPostFromUrl";

const Post: React.FC = () => {
  const { data, loading } = useGetPostFromUrl();
  if (loading)
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

export default withApollo({ ssr: true })(Post);
