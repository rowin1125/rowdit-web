import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";

import React from "react";
import { withApollo } from "../../../../lib/withApollo";

import InputField from "../../../components/InputField";
import Layout from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useGetIntId } from "../../../hooks/useGetIntId";

const EditPost = () => {
  const { back } = useRouter();
  const intId = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();

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
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          const { errors } = await updatePost({
            variables: { id: intId, ...values },
          });
          if (!errors) {
            back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              label="Title"
              placeholder="Give a nice title"
            />
            <Box my={4}>
              <InputField
                textarea
                name="text"
                label="Body"
                placeholder="text...."
                type="textarea"
              />
            </Box>

            <Button isLoading={isSubmitting} type="submit" colorScheme="green">
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
