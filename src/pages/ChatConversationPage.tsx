import { Box } from "@chakra-ui/layout";
import React, { useCallback, useEffect, useState } from "react";
import { getChatConversationInfo } from "../services/firebase";
import { ChatConversationInfo } from "../types";
import { getParamFromUrl } from "../utils";

const ChatConversationPage: React.FC = () => {
  const [convId, setConvId] = useState("");
  const [convInfo, setConvInfo] = useState<ChatConversationInfo | null>(null);

  const fetchConvInfo = useCallback(async () => {
    if (convId.trim() !== "") {
      const info = await getChatConversationInfo(convId);
      setConvInfo(info);
    }
  }, [convId]);

  useEffect(() => {
    setConvId(getParamFromUrl("conversation_id"));
  }, []);

  useEffect(() => {
    fetchConvInfo();
  }, [fetchConvInfo]);

  return <Box>{JSON.stringify(convInfo)}</Box>;
};

export default ChatConversationPage;
