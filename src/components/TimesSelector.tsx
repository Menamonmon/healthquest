import { Button, ButtonGroup, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { HStack, VStack } from "@chakra-ui/layout";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/popover";
import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

interface Props {
  selectedTimes: Date[];
  setSelectedTimes: React.Dispatch<React.SetStateAction<Date[]>>;
}

const TimesSelector: React.FC<Props> = ({
  selectedTimes,
  setSelectedTimes,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const [newTime, setNewTime] = useState<Date>(new Date(0));

  return (
    <HStack flexWrap="wrap">
      {selectedTimes.map((time) => (
        <Popover>
          <PopoverTrigger>
            <Button size="xs">{`${time.getHours()}:${time.getMinutes()}`}</Button>
          </PopoverTrigger>
          <PopoverContent w="fit-conetent" colorScheme="red">
            <PopoverArrow />
            <IconButton
              colorScheme="red"
              size="xs"
              onClick={() =>
                setSelectedTimes((prev) => prev.filter((ct) => ct !== time))
              }
              aria-label="delete-time"
            >
              <FaTrash />
            </IconButton>
          </PopoverContent>
        </Popover>
      ))}
      <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
        <PopoverTrigger>
          <IconButton
            size="xs"
            rounded="full"
            aria-label="add-time"
            colorScheme="green"
          >
            <FaPlus />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Add Time</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <VStack>
              <Input
                display="inline-block"
                type="time"
                value={`${newTime.getHours()}:${newTime.getMinutes()}`}
                onChange={(e) => {
                  const timeString = e.target.value;
                  const [hours, minutes] = timeString.split(":");
                  const updatedDate = new Date(0);
                  updatedDate.setHours(parseInt(hours));
                  updatedDate.setMinutes(parseInt(minutes));
                  setNewTime(updatedDate);
                }}
              />
              <ButtonGroup>
                <Button onClick={onClose} size="sm" colorScheme="red">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (newTime.getTime() === new Date(0).getTime()) {
                      return;
                    }
                    setSelectedTimes((old) => {
                      const newTimes = old.concat(newTime);
                      setNewTime(new Date(0));
                      return newTimes;
                    });
                  }}
                  colorScheme="green"
                >
                  Add
                </Button>
              </ButtonGroup>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};

export default TimesSelector;
