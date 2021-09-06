import { Button } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";
import React from "react";
import { Day } from "../types";

interface Props {
  selectedDays: Day[];
  setSelectedDays: React.Dispatch<React.SetStateAction<Day[]>>;
}

const DaysSelector: React.FC<Props> = ({ selectedDays, setSelectedDays }) => {
  const days: Day[] = ["SU", "M", "TU", "W", "TH", "F", "SA"];
  return (
    <HStack>
      {days.map((d) => (
        <Button
          rounded="full"
          colorScheme={selectedDays.includes(d) ? "blue" : "gray"}
          onClick={() =>
            setSelectedDays((prevDays) =>
              selectedDays.includes(d)
                ? prevDays.filter((day) => day !== d)
                : prevDays.concat(d)
            )
          }
        >
          {d}
        </Button>
      ))}
    </HStack>
  );
};

export default DaysSelector;
