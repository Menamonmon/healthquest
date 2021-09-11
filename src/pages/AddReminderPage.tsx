import { Button, ButtonGroup } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import { useBoolean } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Textarea } from "@chakra-ui/textarea";
import { useToast } from "@chakra-ui/toast";
import React, { FormEventHandler, useState } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useHistory } from "react-router";
import DaysSelector from "../components/DaysSelector";
import TimesSelector from "../components/TimesSelector";
import useField from "../hooks/useField";
import { addReminder } from "../services/firebase";
import { Day, ReminderType } from "../types";
import { dateStringToDate, toTimestamp } from "../utils";

const AddReminderPage = () => {
  const history = useHistory();

  const toast = useToast();
  const [loading, { on, off }] = useBoolean();

  const handleSubmit: FormEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    on();
    const added = await addReminder({
      name,
      description,
      type: reminderType,
      days: selectedDays,
      times: selectedTimes,
      start_date: toTimestamp(dateStringToDate(startDate)),
      end_date: toTimestamp(dateStringToDate(endDate)),
      point_value: 10,
    });
    if (added) {
      toast({
        status: "success",
        title: "Added",
        description: "Reminder added successfully!",
        isClosable: true,
      });
    } else {
      toast({
        status: "error",
        title: "Error",
        description:
          "An error ocurred while adding your reminder please try again later!",
        isClosable: true,
      });
    }
    off();
    return false;
  };

  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [startDate, handleStartDateChange] = useField("2021-09-01");
  const [endDate, handleEndDateChange] = useField("2021-10-01");
  const [name, handleNameChange] = useField("NAME");
  const [description, handleDescriptionChange] = useField("DESCRIPTIOn");
  const [reminderType, handleReminderTypeChange] =
    useField<ReminderType>("OTHER");

  return (
    <VStack textAlign="left" alignItems="left" spacing={0}>
      <Heading>Add A New Reminder:</Heading>
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

export default AddReminderPage;
