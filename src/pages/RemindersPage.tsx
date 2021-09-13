import { Button, IconButton } from "@chakra-ui/button";
import { Box, List } from "@chakra-ui/layout";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ReminderItem from "../components/ReminderItem";
import { deleteReminder, getMyReminders } from "../services/firebase";
import { Reminder } from "../types";
import { Link as RouterLink } from "react-router-dom";
import { createCron, getNextAlarmTime } from "../utils";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/hooks";
import { useToast, Heading } from "@chakra-ui/react";

const RemindersPage = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderToBeDeleted, setReminderToBeDeleted] =
    useState<Reminder | null>(null);
  const { isOpen, onOpen, onClose: onDisclosureClose } = useDisclosure();
  const onClose = useCallback(() => {
    setReminderToBeDeleted(null);
  }, [setReminderToBeDeleted]);

  const toast = useToast();

  const fetchReminders = async () => {
    const myReminders = await getMyReminders();
    setReminders(
      myReminders.map((reminder) => {
        const { times, days, start_date, end_date } = reminder;
        const cron = createCron(days, times);
        const nextAlarm = getNextAlarmTime(
          cron,
          times,
          start_date.toDate(),
          end_date.toDate()
        );
        reminder.nextAlarm = nextAlarm;
        return reminder;
      })
    );
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  useEffect(() => {
    if (reminderToBeDeleted === null) {
      onDisclosureClose();
    } else {
      onOpen();
    }
  }, [reminderToBeDeleted, onOpen, onDisclosureClose]);

  return (
    <Box>
      {reminders.length === 0 ? (
        <>
          <Heading>No Reminders To Display</Heading>
          <Heading size="sm">
            You can add reminders by clicking the plus button at the bottom of
            the screen.
          </Heading>
        </>
      ) : (
        <>
          <List>
            {reminders.map((reminder, idx) => (
              <ReminderItem
                reminder={reminder}
                setReminderToBeDeleted={setReminderToBeDeleted}
                key={idx}
              />
            ))}
          </List>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Deleting A Reminder:</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Do you really want to delete "{reminderToBeDeleted?.name}"?
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blackAlpha" mr={3} onClick={onClose}>
                  No
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    const deleted =
                      reminderToBeDeleted?.id !== undefined
                        ? await deleteReminder(reminderToBeDeleted?.id)
                        : false;
                    if (deleted) {
                      toast({
                        status: "success",
                        title: "Deleted",
                        description: "Reminder deleted successfully!",
                        isClosable: true,
                      });
                    } else {
                      toast({
                        status: "error",
                        title: "Error",
                        description:
                          "An error ocurred while deleting your reminder please try again later!",
                        isClosable: true,
                      });
                    }
                    await fetchReminders();
                    onClose();
                  }}
                >
                  Yes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
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
