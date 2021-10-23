import { useBoolean } from "@chakra-ui/hooks";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";
import { FaComment } from "react-icons/fa";
import useField from "../hooks/useField";
import { startConversation } from "../services/firebase";
import { useToast } from "@chakra-ui/toast";
import { ChatConversation } from "../types";
import { Timestamp } from "@firebase/firestore";

const ChatSearchBox: React.FC<{
  setConversations: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
}> = ({ setConversations }) => {
  const [email, handleEmailChange, setEmail] = useField("");
  const [loading, { on, off }] = useBoolean();
  const toast = useToast();
  const handleSubmit: React.FormEventHandler<HTMLDivElement> = async (
    event
  ) => {
    event.preventDefault();
    on();
    const isSuccess = await startConversation(email);
    setEmail("");
    off();
    if (!isSuccess) {
      toast({
        status: "error",
        title: "Invalid Email",
        description:
          "This email is either yours, or you already have a conversation with this person.",
      });
    } else {
      setConversations((prev) => {
        const newConversation: any = isSuccess;
        newConversation.created_at = new Timestamp(
          newConversation.created_at._seconds,
          newConversation.created_at._nanoseconds
        );
        return prev.concat(newConversation as ChatConversation);
      });
      toast({
        status: "success",
        title: "Conversation Started",
        description:
          "Click on the new conversation that popped up to start chatting.",
      });
    }
    return false;
  };

  return (
    <HStack as="form" onSubmit={handleSubmit}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<FaComment color="gray.300" />}
        />
        <Input
          disabled={loading}
          type="email"
          isRequired
          placeholder="Chat with a doctor or a patient..."
          value={email}
          onChange={handleEmailChange}
          colorScheme="black"
        />
      </InputGroup>
      <Button disabled={loading} type="submit" colorScheme="green">
        Chat
      </Button>
    </HStack>
  );
};

export default ChatSearchBox;
