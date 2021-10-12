import React from "react";
import { Badge, Box, Heading } from "@chakra-ui/layout";
import { useAuth } from "../contexts/AuthContext";
import HomepageSection from "../components/HomepageSection";
import SmallRemindersList from "../components/SmallRemindersList";
import { Button } from "@chakra-ui/button";
import { Link } from "react-router-dom";
import { ImBubble } from "react-icons/im";

const PatientHomePage = () => {
  const { user } = useAuth();
  return (
    <Box>
      <Heading size="md" color="blue.900">
        Welcome {user?.displayName}!
      </Heading>
      <HomepageSection
        title="Upcoming Reminders:"
        bgColor="orange.200"
        minH="240px"
        headingColor="blue.900"
      >
        <SmallRemindersList />
      </HomepageSection>
      <HomepageSection
        title="Rewards:"
        bgColor="blue.300"
        headingColor="yellow.300"
      >
        <Button as={Link} to="/rewards" colorScheme="orange" w="100%">
          Review Your Rewards
        </Button>
      </HomepageSection>
      <HomepageSection
        title="Latest Messages:"
        headingColor="black"
        bgColor="gray.300"
      >
        <Button
          leftIcon={<ImBubble />}
          w="100%"
          position="relative"
          colorScheme="green"
          as={Link}
          to="/chat"
        >
          Chat With a Doctor
          <Badge
            top={-3}
            right={-2}
            position="absolute"
            colorScheme="red"
            variant="solid"
            rounded="full"
            fontSize="xl"
            w="30px"
            h="30px"
          >
            5
          </Badge>
        </Button>
      </HomepageSection>
      <HomepageSection
        title="Reports and Cards:"
        headingColor="blue.900"
        bgColor="red.100"
      >
        <Button as={Link} to="/patient-report" colorScheme="whatsapp" w="100%">
          View Your Patient Report
        </Button>
        <Box h="10px" />
        <Button as={Link} to="/insurance-card" colorScheme="yellow" w="100%">
          Capture / View Your Insurance Card
        </Button>
      </HomepageSection>
    </Box>
  );
};

export default PatientHomePage;
