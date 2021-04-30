import { useRouter } from "next/router";
import NextLink from "next/link";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { NextPage } from "next";

import { toErrorMap } from "../../utils/toErrorMap";
import InputField from "../../components/InputField";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../../generated/graphql";
import Layout from "../../components/Layout";
import { withApollo } from "../../../lib/withApollo";

const ChangePassword: NextPage = () => {
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  const router = useRouter();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const token = router.query.token;
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token: typeof token === "string" ? token : "",
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user,
                },
              });
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            // Register worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="New password"
              placeholder="New password"
              type="password"
            />
            {tokenError && (
              <Flex>
                <Box mr={2} textColor="red">
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link variant="">Click here to get a new one</Link>
                </NextLink>
              </Flex>
            )}
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="green"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
