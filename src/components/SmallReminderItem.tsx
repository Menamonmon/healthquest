import { Heading, HStack, ListItem, Text, VStack } from "@chakra-ui/layout";
import TimeAgo from "react-timeago";
import React from "react";
import { Reminder } from "../types";

interface Props {
  reminder: Reminder;
}

const SmallReminderItem: React.FC<Props> = ({
  reminder: { nextAlarm, name },
}) => {
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
      <Heading size="sm" noOfLines={1}>
        {name}
      </Heading>
      <Text color="crimson" noOfLines={1}>
        {nextAlarm ? (
          <>
            <TimeAgo date={nextAlarm} />
          </>
        ) : (
          "Alarm Ended"
        )}
      </Text>
    </ListItem>
  );
};

export default SmallReminderItem;
