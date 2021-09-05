import { Link, VStack } from "@chakra-ui/layout";
import {
  Avatar,
  Heading,
  Button,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { signInWithGoogle } from "../services/firebase";

const SignInPage = () => {
  const [loading, { on, off }] = useBoolean();
  const toast = useToast();
  return (
    <VStack justifyContent="center" height="100%">
      <VStack height="50vh" justifyContent="space-between">
        <Avatar src="" name="CACAPP" size="xl" />
        <Heading>Sign In</Heading>
        <Button
          leftIcon={<FaGoogle />}
          colorScheme="blue"
          disabled={loading}
          onClick={async () => {
            on();
            const result = await signInWithGoogle();
            if (!result) {
              toast({
                status: "error",
                title:
                  "An error occurred while signing in. Please try again later",
              });
            }
            off();
          }}
        >
          Sign in with Google
        </Button>
        <Link as={RouterLink} to="/register">
          Don't have an account? Register from here!
        </Link>
      </VStack>
    </VStack>
  );
};

export default SignInPage;
