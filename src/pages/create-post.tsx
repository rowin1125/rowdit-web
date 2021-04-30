import React from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Box, Button } from "@chakra-ui/react";

import Layout from "../components/Layout";
import { useIsAuth } from "../hooks/useIsAuth";
import InputField from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { withApollo } from "../../lib/withApollo";

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  useIsAuth();
  const router = useRouter();
  const [createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { data, errors } = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: "posts:{}" });
            },
          });

          if (!errors) {
            router.push(`/`);
            // router.push(`/post/${data?.createPost.id}`);
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

export default withApollo({ ssr: false })(CreatePost);
