import React from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { Box, Button } from "@chakra-ui/react";

import { toErrorMap } from "../utils/toErrorMap";

import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";

import { useRegisterMutation } from "../generated/graphql";

import { createUrqlClient } from "../utils/createUrqlClient";
import Layout from "../components/Layout";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // Register worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="Username"
            />
            <Box my={4}>
              <InputField name="email" label="Email" placeholder="Email" />
            </Box>
            <Box my={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
            </Box>
            <Button isLoading={isSubmitting} type="submit" colorScheme="green">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Register);
