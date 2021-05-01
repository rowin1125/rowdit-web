import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";

import theme from "../theme";
import { useApollo } from "../../lib/apolloClient";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
