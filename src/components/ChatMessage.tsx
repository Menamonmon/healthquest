import { Avatar } from "@chakra-ui/avatar";
import { HStack, ListItem, Text, VStack } from "@chakra-ui/layout";
import React from "react";
import { auth } from "../services/firebase";
import { ChatMessageType } from "../types";
import TimeAgo from "react-timeago";

const ChatMessage: React.FC<{ msg: ChatMessageType }> = ({
  msg: { sender, created_at, content },
}) => {
  const isSelf = sender.uid === auth?.currentUser?.uid;
  return (
    <ListItem
      w="100%"
      my="5px"
      as={HStack}
      justifyContent={isSelf ? "left" : "right"}
    >
      {isSelf && (
        <VStack alignSelf="flex-start" paddingTop={1}>
          <Avatar size="sm" name={sender.displayName} src={sender.photoURL} />
        </VStack>
      )}
      <VStack
        maxW="80%"
        p={0}
        textAlign={isSelf ? "left" : "right"}
        alignItems={isSelf ? "flex-start" : "flex-end"}
      >
        <Text p={0} fontSize="sm">
          {isSelf ? sender.displayName : <TimeAgo date={created_at.toDate()} />}{" "}
          &bull;{" "}
          {!isSelf ? (
            sender.displayName
          ) : (
            <TimeAgo date={created_at.toDate()} />
          )}
        </Text>
        <Text
          m={0}
          p="5px"
          rounded="15px"
          bgColor="lightblue"
          display="inline"
          w="fit-content"
          maxW="100%"
          overflowX="auto"
        >
          {content}
        </Text>
      </VStack>
      {!isSelf && (
        <VStack alignSelf="flex-start" paddingTop={1}>
          <Avatar size="sm" name={sender.displayName} src={sender.photoURL} />
        </VStack>
      )}
    </ListItem>
  );
};

export default ChatMessage;
