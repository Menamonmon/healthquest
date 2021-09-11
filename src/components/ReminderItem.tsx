import { Button } from "@chakra-ui/button";
import { Heading, HStack, ListItem, VStack } from "@chakra-ui/layout";
import React from "react";
import { Reminder } from "../types";
import { createCron, getNextAlarmTime } from "../utils";
import TimeAgo from "react-timeago";

interface Props {
  reminder: Reminder;
}
const ReminderItem: React.FC<Props> = ({ reminder }) => {
  const { name, times, days, start_date, end_date } = reminder;
  const cron = createCron(days, times);
  const nextDate = getNextAlarmTime(
    cron,
    times,
    start_date.toDate(),
    end_date.toDate()
  );
  const isThereNextDate = nextDate.getTime() !== new Date(0).getTime();

  return (
    <ListItem
      as={HStack}
      justifyContent="space-between"
      my="3px"
      bgColor="gray.200"
      py="10px"
      px="5px"
    >
      <VStack>
        <Heading size="sm">{name}</Heading>
        {isThereNextDate ? (
          <>
            Next Alarm: <TimeAgo date={nextDate} />
          </>
        ) : (
          "Alarm Ended"
        )}
      </VStack>
      <HStack>
        <Button colorScheme="green">Details</Button>
        <Button colorScheme="blue">Edit</Button>
      </HStack>
    </ListItem>
  );
};

export default ReminderItem;
