import React, { useState } from "react";
import NextLink from "next/link";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { Box, Flex, Link, Button } from "@chakra-ui/react";

import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              If an account exist with this email you will receive an email
              shortly 🥳
            </Box>
          ) : (
            <Form>
              <Box my={4}>
                <InputField
                  name="email"
                  label="Email"
                  placeholder="Email"
                  type="email"
                />
              </Box>
              <Flex my={2} justifyContent="flex-end">
                <NextLink href="/forgot-password">
                  <Link variant="">Forgot password?</Link>
                </NextLink>
              </Flex>
              <Button
                isLoading={isSubmitting}
                type="submit"
                colorScheme="green"
              >
                Recover password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ForgotPassword);
