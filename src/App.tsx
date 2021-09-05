import React from "react";

import { ChakraProvider } from "@chakra-ui/react";

import { BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import Nav from "./components/Nav";
import pagesList from "./pages/pagesList";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Nav routes={pagesList}></Nav>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
