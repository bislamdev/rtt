import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "../hooks";
// Theme colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
// Extend theme with provided colors, fonts, etc
const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;
