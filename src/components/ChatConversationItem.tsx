import {
  Flex,
  Heading,
  HStack,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Avatar, Spinner } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { ChatConversation, ChatConversationParticipantInfo } from "../types";
import TimeAgo from "react-timeago";
import { useAuth } from "../contexts/AuthContext";
import { getUserInfoById } from "../services/firebase";
import { Link } from "react-router-dom";

interface Props {
  conversation: ChatConversation;
}
const ChatConversationItem: React.FC<Props> = ({ conversation }) => {
  const { participants, created_at } = conversation;
  const { user } = useAuth();
  const [otherUserInfo, setOtherUserInfo] =
    useState<ChatConversationParticipantInfo | null>();
  const otherUserId = participants.filter((uid) => uid !== user?.uid)[0];
  const fetchOtherUserInfo = useCallback(async () => {
    const info = await getUserInfoById(otherUserId);
    if (info) {
      setOtherUserInfo(info);
    }
  }, [otherUserId]);

  useEffect(() => {
    fetchOtherUserInfo();
  }, [fetchOtherUserInfo]);

  return (
    <ListItem
      as={HStack}
      my="8px"
      bgColor="gray.200"
      p="10px"
      rounded="md"
      boxShadow="md"
    >
      {!otherUserInfo ? (
        <Spinner />
      ) : (
        <Flex
          w="100%"
          justifyContent="space-between"
          as={Link}
          to={`/chat-conversation?conversation_id=${conversation.id}`}
        >
          <VStack alignItems="flex-start" textAlign="left">
            <Heading size="sm">{otherUserInfo?.displayName}</Heading>
            <Text color="crimson">
              <TimeAgo date={created_at.toDate()} />
            </Text>
          </VStack>
          <HStack>
            <Avatar
              name={otherUserInfo?.displayName}
              src={otherUserInfo?.photoURL}
            />
          </HStack>
        </Flex>
      )}
    </ListItem>
  );
};

export default ChatConversationItem;
