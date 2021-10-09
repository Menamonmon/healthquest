import { Button } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useHistory } from "react-router";

export const BackFooter: React.FC = ({ children }) => {
  const history = useHistory();

  return (
    <HStack justifyContent="flex-end">
      <Button
        leftIcon={<FaArrowLeft />}
        colorScheme="blackAlpha"
        onClick={() => history.goBack()}
      >
        Go Back
      </Button>
      {children}
    </HStack>
  );
};
