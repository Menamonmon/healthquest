import { useToast } from "@chakra-ui/toast";
import React, { useEffect } from "react";
import { auth } from "../services/firebase";

const SignOutPage = () => {
  const signOut = async () => {
    const result = await auth.signOut();
    console.log(result);
  };

  const toast = useToast();

  useEffect(() => {
    signOut();
    toast({
      status: "success",
      title: "Signed Out",
      description: "You have been signed out successfully!",
      isClosable: true,
    });
  }, [toast]);

  return <></>;
};

export default SignOutPage;
