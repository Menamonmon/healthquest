import { IconButton } from "@chakra-ui/button";
import { Heading, HStack, ListItem, Text, VStack } from "@chakra-ui/layout";
import React from "react";
import { Reminder } from "../types";
import TimeAgo from "react-timeago";
import { FaPen, FaTrash } from "react-icons/fa";

interface Props {
  reminder: Reminder;
  setReminderToBeDeleted: React.Dispatch<React.SetStateAction<Reminder | null>>;
}
const ReminderItem: React.FC<Props> = ({
  reminder,
  setReminderToBeDeleted,
}) => {
  const { name, nextAlarm } = reminder;

  return (
    <ListItem
      as={HStack}
      justifyContent="space-between"
      my="8px"
      bgColor="gray.200"
      p="10px"
      rounded="md"
      boxShadow="md"
    >
      <VStack alignItems="flex-start" textAlign="left">
        <Heading size="sm">{name}</Heading>
        <Text color="crimson">
          {nextAlarm ? (
            <>
              <TimeAgo date={nextAlarm} />
            </>
          ) : (
            "Alarm Ended"
          )}
        </Text>
      </VStack>
      <HStack>
        <IconButton
          colorScheme="red"
          rounded="full"
          aria-label="delete"
          onClick={() => setReminderToBeDeleted(reminder)}
        >
          <FaTrash />
        </IconButton>
        <IconButton colorScheme="blue" rounded="full" aria-label="edit">
          <FaPen />
        </IconButton>
      </HStack>
    </ListItem>
  );
};

export default ReminderItem;
