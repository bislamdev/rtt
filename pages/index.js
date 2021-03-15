import { useState, useRef, useEffect } from "react";
import { BsUpload } from "react-icons/bs";
import {
  Heading,
  Button,
  Input,
  InputGroup,
  Container,
  Box,
  Divider,
  Badge,
  ListItem,
  List,
  Text,
  Icon,
  InputLeftElement,
} from "@chakra-ui/react";
import ProtectedPage from "../components/protectedPage";

import { useAuth, useInterval } from "../hooks";

export default function Home() {
  const [file, setFile] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const audioRef = useRef(null);
  const { token } = useAuth();
  const [conversationId, setConversationId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("not started");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const src = URL.createObjectURL(new Blob([file], { type: "audio/mpeg" }));
    setAudioSrc(src);
  }, [file]);

  useEffect(() => {
    if (status === "completed") {
      getTranscripts();
    }
  }, [status]);

  useInterval(
    () => {
      fetch(`https://api.symbl.ai/v1/job/${jobId}`, {
        method: "GET",
        headers: {
          "x-api-key": token,
        },
      })
        .then((rawResult) => rawResult.json())
        .then((result) => setStatus(result.status));
    },
    1000,
    status === "completed" || (status !== "not_started" && !jobId)
  );

  const getTranscripts = () => {
    fetch(`https://api.symbl.ai/v1/conversations/${conversationId}/messages`, {
      method: "GET",
      headers: {
        "x-api-key": token,
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((rawResult) => rawResult.json())
      .then((result) => setMessages(result.messages));
  };

  const submitFile = (file) => {
    fetch("https://api.symbl.ai/v1/process/audio", {
      method: "POST",
      headers: {
        "x-api-key": token,
        "Content-Type": "audio/mpeg",
      },
      body: file,
      json: true,
    })
      .then((rawResult) => rawResult.json())
      .then((result) => {
        setConversationId(result.conversationId);
        setJobId(result.jobId);
        setStatus("in_progress");
      });
  };

  return (
    <ProtectedPage>
      <Container maxWidth="1200px">
        <Box marginBottom="1rem">
          <InputGroup marginBottom="1.5rem">
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={BsUpload} />}
            />
            <Input
              style={{ paddingTop: "0.2rem" }}
              type="file"
              id="input"
              accept="audio/*"
              ref={audioRef}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </InputGroup>
          <Box bg="transparent" align="center" marginBottom="2rem">
            <audio
              style={{ outline: "none" }}
              id="audio-summary"
              ref={audioRef}
              controls
              src={audioSrc}
            />
          </Box>
          <Button
            color="white"
            bg="rgb(107, 185, 240)"
            size="md"
            // disabled={submitted}
            onClick={() => {
              submitFile(file);
            }}
          >
            {status === "not started"
              ? "Send it"
              : status === "in_progress"
              ? "processing..."
              : "Send it"}
          </Button>
        </Box>
        <Divider orientation="horizontal" />
        <Heading align="center">Transcript: </Heading>
        <Box
          marginTop="2rem"
          align="center"
          boxShadow="dark-lg"
          p="6"
          rounded="md"
          bg="white"
        >
          <Container margin="1rem">
            <List spacing={3} margin="2rem">
              {messages.map((message) => (
                <ListItem>
                  <Container>
                    <Text fontSize="lg">{message.text}</Text>
                    <Badge color="rgb(25, 181, 254)">
                      {`${new Date(message.startTime).toDateString()} `}
                    </Badge>
                  </Container>
                </ListItem>
              ))}
            </List>
          </Container>
        </Box>
      </Container>
    </ProtectedPage>
  );
}
