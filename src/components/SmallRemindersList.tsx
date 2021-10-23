import { Button } from "@chakra-ui/button";
import { useBoolean } from "@chakra-ui/hooks";
import { List, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLatestReminders } from "../services/firebase";
import { Reminder } from "../types";
import SmallReminderItem from "./SmallReminderItem";

const SmallRemindersList = () => {
  const [latestReminders, setLatestReminders] = useState<Reminder[]>([]);
  const [loading, { on, off }] = useBoolean();

  const fetchLatestReminders = useCallback(async () => {
    on();
    const reminders = await getLatestReminders(5);
    off();
    setLatestReminders(reminders);
  }, [off, on]);

  useEffect(() => {
    fetchLatestReminders();
  }, [fetchLatestReminders]);

  return (
    <List>
      {loading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      ) : latestReminders.length > 0 ? (
        latestReminders.map((reminder, idx) => (
          <SmallReminderItem reminder={reminder} key={idx} />
        ))
      ) : (
        <Text>No Upcoming Reminders</Text>
      )}
      <Button as={Link} to="/reminders" w="100%" colorScheme="blue">
        See All Reminders....
      </Button>
    </List>
  );
};

export default SmallRemindersList;
