import { Button } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";
import React from "react";
import { Day } from "../types";
import { getEnumValues } from "../utils";

interface Props {
  selectedDays: Day[];
  setSelectedDays: React.Dispatch<React.SetStateAction<Day[]>>;
}

const DaysSelector: React.FC<Props> = ({ selectedDays, setSelectedDays }) => {
  const days = getEnumValues(Day) as unknown[] as Day[];
  return (
    <HStack>
      {days.map((d, idx) => (
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
          key={idx}
        >
          {d}
        </Button>
      ))}
    </HStack>
  );
};

export default DaysSelector;
