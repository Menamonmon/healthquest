import { Box, Flex, List, Heading } from "@chakra-ui/layout";
import React, { useCallback, useEffect, useRef } from "react";
import { firestore } from "../services/firebase";
import { getParamFromUrl } from "../utils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "../components/ChatMessage";
import ChatInputBox from "../components/ChatInputBox";
import { BackFooter } from "../components/BackFooter";

const ChatConversationPage: React.FC = () => {
  const convId = getParamFromUrl("conversation_id");
  const messagesRef = firestore.collection("messages");
  const query = messagesRef
    .where("conv_id", "==", convId)
    .orderBy("created_at");
  const [messages] = useCollectionData(query, { idField: "id" });

  const feedRef: any = useRef<HTMLUListElement>();
  const scrollToBottom = useCallback(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [feedRef]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <Flex flexDir="column" h="97%">
      <List
        flexGrow={1}
        ref={feedRef}
        overflowY="auto"
        maxHeight="calc(100vh - 100px)"
      >
        {!messages || messages.length === 0 ? (
          <Heading>
            No messages to display. Type your first message below!
          </Heading>
        ) : (
          messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} />)
        )}
      </List>
      <Box>
        <ChatInputBox convId={convId} />
        <BackFooter />
      </Box>
    </Flex>
  );
};

export default ChatConversationPage;
