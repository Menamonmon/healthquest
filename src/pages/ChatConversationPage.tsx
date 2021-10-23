import { Box, Flex, List, Heading } from "@chakra-ui/layout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { firestore, getChatConversationInfo } from "../services/firebase";
import { ChatConversationInfo } from "../types";
import { getParamFromUrl } from "../utils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "../components/ChatMessage";
import ChatInputBox from "../components/ChatInputBox";
import { BackFooter } from "../components/BackFooter";

const ChatConversationPage: React.FC = () => {
  const convId = getParamFromUrl("conversation_id");
  const [convInfo, setConvInfo] = useState<ChatConversationInfo | null>(null);
  const messagesRef = firestore.collection("messages");
  const query = messagesRef
    .where("conv_id", "==", convId)
    .orderBy("created_at");
  const [messages] = useCollectionData(query, { idField: "id" });

  const fetchConvInfo = useCallback(async () => {
    if (convId.trim() !== "") {
      const info = await getChatConversationInfo(convId);
      setConvInfo(info);
    }
  }, [convId]);
  const feedRef: any = useRef<HTMLUListElement>();
  const scrollToBottom = useCallback(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [feedRef]);

  useEffect(() => {
    fetchConvInfo();
  }, [fetchConvInfo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
