import React from "react";
import NextLink from "next/link";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Box, Button, Flex, Link } from "@chakra-ui/react";

import InputField from "../components/InputField";

import { toErrorMap } from "../utils/toErrorMap";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import Layout from "../components/Layout";
import { withApollo } from "../../lib/withApollo";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            // Register worked
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="Username or email"
              placeholder="rowin / rowin@gmail.com"
            />
            <Box my={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
            </Box>
            <Flex my={2} justifyContent="flex-end">
              <NextLink href="/forgot-password">
                <Link variant="">Forgot password?</Link>
              </NextLink>
            </Flex>
            <Button isLoading={isSubmitting} type="submit" colorScheme="green">
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Login);
