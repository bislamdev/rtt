import React, { useContext, useEffect, useState } from "react";
import { Container, Button, Input, Stack } from "@chakra-ui/react";
import Header from "./header";
import { useAuth } from "../hooks";

export default function ProtectedPage({ children }) {
  const { token, setToken } = useAuth("");
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const isLoggedIn = token;

  async function loginToSymbl() {
    const response = await fetch("https://api.symbl.ai/oauth2/token:generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        type: "application",
        appId,
        appSecret,
      }),
    });
    const json = await response.json();
    setToken(json.accessToken);
  }

  return (
    <>
      <Header />
      {!isLoggedIn ? (
        <Container>
          <Stack marginBottom="1rem">
            <Input
              placeholder="appId"
              size="md"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
            />
            <Input
              placeholder="appSecret"
              size="md"
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
            />
          </Stack>
          <Button
            color="white"
            bg="rgb(107, 185, 240)"
            onClick={() => loginToSymbl()}
          >
            Sign In
          </Button>
        </Container>
      ) : (
        children
      )}
    </>
  );
}
