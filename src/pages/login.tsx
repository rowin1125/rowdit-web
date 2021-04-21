import React from "react";
import NextLink from "next/link";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { Box, Button, Flex, Link } from "@chakra-ui/react";

import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";

import { toErrorMap } from "../utils/toErrorMap";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
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
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
