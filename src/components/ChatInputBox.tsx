import { IconButton } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import React from "react";
import { IoMdSend } from "react-icons/io";
import useField from "../hooks/useField";
import { sendMessage } from "../services/firebase";

const ChatInputBox: React.FC<{ convId: string }> = ({ convId }) => {
  const [content, handleContentChange, setContent] = useField("");
  const toast = useToast();
  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    const newMsg = await sendMessage(convId, content);
    setContent("");
    if (!newMsg) {
      toast({
        status: "error",
        title: "Error",
        description:
          "An error occurred while sending your message. Please try again later.",
      });
    }
    return false;
  };
  return (
    <HStack py="10px" as="form" onSubmit={handleSubmit}>
      <Input
        isRequired
        value={content}
        onChange={handleContentChange}
        placeholder="Type your message here..."
      />
      <IconButton
        colorScheme="blue"
        aria-label="send-btn"
        rounded="full"
        type="submit"
      >
        <IoMdSend />
      </IconButton>
    </HStack>
  );
};

export default ChatInputBox;
