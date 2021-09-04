import React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <Box maxWidth="500px" maxHeight="900px"></Box>
    </ChakraProvider>
  );
}

export default App;
