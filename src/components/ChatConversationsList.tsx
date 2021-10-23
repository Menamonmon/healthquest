import { useBoolean } from "@chakra-ui/hooks";
import { Heading, List } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getChatConversations } from "../services/firebase";
import { ChatConversation } from "../types";
import ChatConversationItem from "./ChatConversationItem";

const ChatConversationsList: React.FC<{
  setConversations: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
  conversations: ChatConversation[];
}> = ({ conversations, setConversations }) => {
  const { user } = useAuth();
  const [loading, { on, off }] = useBoolean();
  const fetchConversations = useCallback(async () => {
    on();
    if (user) {
      const fetchedConversations = await getChatConversations(user.uid);
      if (fetchedConversations) {
        setConversations(fetchedConversations);
      }
    }
    off();
  }, [on, off, user, setConversations]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <List>
      {loading ? (
        <Spinner />
      ) : conversations.length === 0 ? (
        <Heading>
          No conversations to display. Type an email in the box above to start
          one!
        </Heading>
      ) : (
        <List>
          {conversations.map((conv, idx) => (
            <ChatConversationItem conversation={conv} key={idx} />
          ))}
        </List>
      )}
    </List>
  );
};

export default ChatConversationsList;
