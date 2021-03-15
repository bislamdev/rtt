import React from "react";
import { Flex, Heading } from "@chakra-ui/react";

export default function Header() {
  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="2rem"
        bg="rgb(107, 185, 240)"
        color="white"
        marginBottom="2rem"
      >
        <Flex as="nav" align="center">
          <Heading as="h1" size="lg">
            RTT
          </Heading>
        </Flex>
      </Flex>
    </>
  );
}
