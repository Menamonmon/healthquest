import { Box } from "@chakra-ui/layout";
import { BackFooter } from "../components/BackFooter";
import React, { useState } from "react";
import ChatSearchBox from "../components/ChatSearchBox";
import ChatConversationsList from "../components/ChatConversationsList";
import { ChatConversation } from "../types";

const ChatPage = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  return (
    <Box display="flex" justifyContent="space-between" flexDir="column">
      <Box flexGrow={1}>
        <ChatSearchBox setConversations={setConversations} />
        <ChatConversationsList
          conversations={conversations}
          setConversations={setConversations}
        />
      </Box>
      <BackFooter />
    </Box>
  );
};

export default ChatPage;
