import React, { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { Flex, Heading, Text, VStack } from "@chakra-ui/layout";
import { BackFooter } from "../components/BackFooter";
import { auth, getUserProfile } from "../services/firebase";
import { Spinner } from "@chakra-ui/react";

const RewardsPage = () => {
  const [points, setPoints] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const fetchPoints = async () => {
    if (auth.currentUser) {
      const userProfile = await getUserProfile(auth.currentUser.uid);
      if (userProfile) {
        setLoaded(true);
        setPoints(userProfile.points);
      }
    }
  };

  useEffect(() => {
    fetchPoints();
  });

  return (
    <Flex flexDir="column" justifyContent="space-between" height="100%">
      <Box flexGrow={1}>
        <VStack>
          <Heading color="blue">You Have:</Heading>
          <Heading fontSize="100px" color="green.400">
            {loaded ? points : <Spinner />}
          </Heading>
          <Text>pts</Text>
        </VStack>
        <VStack alignItems="left">
          <Heading>Redeem as:</Heading>
          <Button colorScheme="orange">Coupons</Button>
          <Button colorScheme="cyan">Gift Card</Button>
        </VStack>
      </Box>
      <BackFooter />
    </Flex>
  );
};

export default RewardsPage;
