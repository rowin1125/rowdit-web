import React from "react";
import NextLink from "next/link";
import { Button } from "@chakra-ui/button";
import { useApolloClient } from "@apollo/client";
import { Box, Flex, Heading, Link } from "@chakra-ui/layout";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}
const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery();
  const apolloClient = useApolloClient();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr="4">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex alignItems="center">
        <NextLink href="/create-post" passHref>
          <Button as={Link} variant="solid" colorScheme="green" mr={4}>
            Create Post
          </Button>
        </NextLink>
        <Box>{data.me.username}</Box>
        <Button
          isLoading={logoutLoading}
          onClick={async () => {
            logout();
            await apolloClient.resetStore();
          }}
          ml="4"
          variant="link"
          type="button"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      bg="tan"
      position="sticky"
      top={0}
      p={4}
      alignItems="center"
      zIndex={1}
    >
      <Flex flex={1} margin="auto" maxW={800}>
        <Heading>
          <NextLink href="/">
            <Link>RowDit</Link>
          </NextLink>
        </Heading>
        <Flex alignItems="center" ml="auto">
          {body}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NavBar;
