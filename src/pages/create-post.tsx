import React from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { Box, Button } from "@chakra-ui/react";

import Layout from "../components/Layout";
import { useIsAuth } from "../hooks/useIsAuth";
import InputField from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  useIsAuth();
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error, data } = await createPost({ input: values });

          if (!error) {
            router.push(`/post/${data?.createPost.id}`);
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
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
