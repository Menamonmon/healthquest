import { IconButton } from "@chakra-ui/button";
import { Box, List } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ReminderItem from "../components/ReminderItem";
import { getMyReminders } from "../services/firebase";
import { Reminder } from "../types";
import { Link as RouterLink } from "react-router-dom";

const RemindersPage = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const fetchReminders = async () => {
    const myReminders = await getMyReminders();
    setReminders(myReminders);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <Box>
      <List>
        {reminders.map((reminder, idx) => (
          <ReminderItem reminder={reminder} key={idx} />
        ))}
      </List>
      <IconButton
        size="lg"
        colorScheme="green"
        rounded="full"
        position="absolute"
        bottom="5%"
        right="5%"
        aria-label="add-reminder"
        as={RouterLink}
        to="/add-reminder"
      >
        <FaPlus></FaPlus>
      </IconButton>
    </Box>
  );
};

export default RemindersPage;
