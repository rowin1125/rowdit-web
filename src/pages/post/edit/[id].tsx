import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";

import React from "react";

import InputField from "../../../components/InputField";
import Layout from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useGetIntId } from "../../../hooks/useGetIntId";

import { createUrqlClient } from "../../../utils/createUrqlClient";

const EditPost = () => {
  const { back } = useRouter();
  const intId = useGetIntId();
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [, updatePost] = useUpdatePostMutation();

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
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          const { error } = await updatePost({ id: intId, ...values });
          if (!error) {
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

export default withUrqlClient(createUrqlClient)(EditPost);
