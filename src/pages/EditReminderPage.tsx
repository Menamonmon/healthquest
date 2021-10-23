import { Button, ButtonGroup } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import { useBoolean } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Textarea } from "@chakra-ui/textarea";
import { useToast } from "@chakra-ui/toast";
import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useHistory } from "react-router";
import DaysSelector from "../components/DaysSelector";
import TimesSelector from "../components/TimesSelector";
import useField from "../hooks/useField";
import { getReminder, updateReminder } from "../services/firebase";
import { Day, ReminderType } from "../types";
import {
  dateStringToDate,
  getParamFromUrl,
  isDateStringValid,
  toTimestamp,
} from "../utils";

const EditReminderPage = () => {
  const history = useHistory();

  const toast = useToast();
  const [loading, { on, off }] = useBoolean();
  const [reminderId, setReminderId] = useState("");

  const clearFields = () => {
    setSelectedTimes([]);
    setSelectedDays([]);
    setName("");
    setDescription("");
    setReminderType("OTHER");
    setEndDate("");
    setStartDate("");
  };

  useEffect(() => {
    setReminderId(getParamFromUrl("reminder_id"));
  }, []);

  const handleSubmit: FormEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    on();

    // validating the input
    if (
      selectedTimes.length === 0 ||
      selectedDays.length === 0 ||
      !isDateStringValid(startDate) ||
      !isDateStringValid(endDate) ||
      dateStringToDate(startDate).getTime() >
        dateStringToDate(endDate).getTime()
    ) {
      toast({
        status: "error",
        title: "Invalid Input",
        description:
          "Make sure the end, and start dates are valid, and you have selected times and days for your reminder.",
        isClosable: true,
      });
      return false;
    }
    const updated = await updateReminder(reminderId, {
      name,
      description,
      type: reminderType,
      days: selectedDays,
      times: selectedTimes,
      start_date: toTimestamp(dateStringToDate(startDate)),
      end_date: toTimestamp(dateStringToDate(endDate)),
      point_value: 10,
    });
    if (updated) {
      toast({
        status: "success",
        title: "Updated",
        description: "Reminder editied successfully!",
        isClosable: true,
      });
      clearFields();
    } else {
      toast({
        status: "error",
        title: "Error",
        description:
          "An error ocurred while updating your reminder please try again later!",
        isClosable: true,
      });
    }
    off();
    return false;
  };

  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [startDate, handleStartDateChange, setStartDate] = useField("");
  const [endDate, handleEndDateChange, setEndDate] = useField("");
  const [name, handleNameChange, setName] = useField("");
  const [description, handleDescriptionChange, setDescription] = useField("");
  const [reminderType, handleReminderTypeChange, setReminderType] =
    useField<ReminderType>("OTHER");

  const fetchReminderData = useCallback(
    async (reminderId: string) => {
      const reminder = await getReminder(reminderId);
      if (reminder) {
        setSelectedDays(reminder.days);
        setSelectedTimes(reminder.times);
        setStartDate(reminder.start_date.toDate().toLocaleDateString("swe"));
        setEndDate(reminder.end_date.toDate().toLocaleDateString("swe"));
        setName(reminder.name);
        setDescription(reminder.description);
        setReminderType(reminder.type);
      } else {
        toast();
      }
    },
    [setDescription, setStartDate, setEndDate, setName, setReminderType, toast]
  );

  useEffect(() => {
    if (reminderId !== "") {
      on();
      fetchReminderData(reminderId);
      off();
    }
  }, [reminderId, fetchReminderData, on, off]);

  return (
    <VStack textAlign="left" alignItems="left" spacing={0}>
      <Heading>Editing Reminder:</Heading>
      <FormControl
        as="form"
        display="flex"
        flexDir="column"
        h="calc(100vh - 110px)"
        onSubmit={handleSubmit}
        py="10px"
        px="10px"
        alignItems="left"
        justifyContent="space-between"
      >
        <HStack>
          <Text>Name:</Text>
          <Input
            size="sm"
            rounded="lg"
            variant="filled"
            isRequired
            placeholder="Blood Sugar Medication...."
            value={name}
            onChange={handleNameChange}
          />
        </HStack>
        <HStack>
          <Text minW="80px">Start Date:</Text>
          <Input
            size="sm"
            rounded="lg"
            variant="filled"
            isRequired
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </HStack>
        <HStack>
          <Text minW="80px">End Date:</Text>
          <Input
            size="sm"
            rounded="lg"
            variant="filled"
            isRequired
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </HStack>
        <VStack alignItems="left">
          <Text>Days:</Text>
          <DaysSelector
            setSelectedDays={setSelectedDays}
            selectedDays={selectedDays}
          />
        </VStack>
        <HStack>
          <Text>Times:</Text>
          <TimesSelector
            selectedTimes={selectedTimes}
            setSelectedTimes={setSelectedTimes}
          />
        </HStack>
        <VStack alignItems="left">
          <Text>Description:</Text>
          <Textarea
            placeholder="Type specific details about your reminder here. Like your medicine dose, or reps and sets for your exercise..."
            rounded="lg"
            variant="filled"
            isRequired
            size="sm"
            resize="none"
            value={description}
            onChange={handleDescriptionChange}
          />
        </VStack>
        <VStack alignItems="left">
          <Text>Reminder Type:</Text>
          <Select
            variant="filled"
            isRequired
            placeholder="Select reminder type..."
            onChange={handleReminderTypeChange}
            value={reminderType}
          >
            <option value="MEDICINE">Medicine</option>
            <option value="EXERCISE">Exercise</option>
            <option value="METRICS">Measuring Metrics</option>
            <option value="OTHER">Other</option>
          </Select>
        </VStack>
        <ButtonGroup
          alignSelf="flex-end"
          disabled={loading}
          justifySelf="flex-end"
        >
          <Button
            colorScheme="blackAlpha"
            leftIcon={<FaArrowLeft />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Button colorScheme="green" leftIcon={<FaCheck />} type="submit">
            Save
          </Button>
        </ButtonGroup>
      </FormControl>
    </VStack>
  );
};

export default EditReminderPage;
