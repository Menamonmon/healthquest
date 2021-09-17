import { Button } from "@chakra-ui/button";
import { useBoolean } from "@chakra-ui/hooks";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Box, Heading, Link, VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import React from "react";
import { FaGoogle, FaPhoneAlt } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import PictureLogo from "../components/logos/PictureLogo";

const RegisterPage = () => {
  const [loading, { on, off }] = useBoolean();
  const toast = useToast();

  const handleSubmit: React.FormEventHandler<HTMLDivElement> = async (e) => {
    if (false) {
      on();
      const result = false;
      if (!result) {
        toast({
          status: "error",
          title: "An error occurred while signing in. Please try again later",
        });
      } else {
        toast({
          status: "success",
          title: "Signed In",
          description: "Signed in successfully!",
        });
      }
      off();
    }
    e.preventDefault();
    return false;
  };

  return (
    <VStack justifyContent="center" height="100%">
      <VStack height="50vh" justifyContent="space-between">
        <Box
          w="100px"
          h="100px"
          p="12px"
          pt="20px"
          bgColor="blue.900"
          rounded="full"
        >
          <PictureLogo />
        </Box>
        <Heading>Register</Heading>
        <VStack
          as="form"
          display="flex"
          justifyContent="center"
          flexDir="column"
          h="100px"
          alignItems="space-between"
          onSubmit={handleSubmit}
        >
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FaPhoneAlt color="gray.300" />}
            />
            <Input
              type="tel"
              colorScheme="blue"
              variant="filled"
              placeholder="(000) 000-0000"
            />
          </InputGroup>
          <Button
            leftIcon={<FaGoogle />}
            colorScheme="blue"
            disabled={loading}
            type="submit"
          >
            Register with Google
          </Button>
        </VStack>
        <Link as={RouterLink} to="/sign-in">
          Already have an account? Sign in from here!
        </Link>
      </VStack>
    </VStack>
  );
};

export default RegisterPage;
