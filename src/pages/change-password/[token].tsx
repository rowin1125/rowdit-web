import router from "next/router";
import NextLink from "next/link";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";

import Wrapper from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import InputField from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface ChangePasswordProps {
  token: string;
}

const ChangePassword: NextPage<any> = ({ token }: ChangePasswordProps) => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
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
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      token: query.token as string,
    },
  };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
