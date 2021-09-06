import { Button, ButtonGroup } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Textarea } from "@chakra-ui/textarea";
import React, { FormEventHandler, useState } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import DaysSelector from "../components/DaysSelector";
import TimesSelector from "../components/TimesSelector";
import useField from "../hooks/useField";
import { Day } from "../types";

const AddReminderPage = () => {
  const handleSubmit: FormEventHandler<HTMLDivElement> = (e) => {
    console.log("SUBMITTED");
    e.preventDefault();
    return false;
  };

  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
  const [name, handleNameChange] = useField("");
  const [description, handleDescriptionChange] = useField("");
  const [reminderType, handleReminderTypeChange] = useField("Other");

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
        <ButtonGroup alignSelf="flex-end" justifySelf="flex-end">
          <Button colorScheme="blackAlpha" leftIcon={<FaArrowLeft />}>
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
