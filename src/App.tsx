import React from "react";

import { ChakraProvider, Box } from "@chakra-ui/react";

import { BrowserRouter as Router, Switch } from "react-router-dom";

import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import RemindersPage from "./pages/RemindersPage";
import ProtectedRoute, { UnprotectedRoute } from "./components/ProtectedRoute";
import AddReminderPage from "./pages/AddReminderPage";
import EditReminderPage from "./pages/EditReminderPage";
import ReminderDetailsPage from "./pages/ReminderDetailsPage";
import RewardsPage from "./pages/RewardsPage";
import ChatPage from "./pages/ChatPage";
import PatientReportPage from "./pages/PatientReportPage";
import PatientHomePage from "./pages/PatientHomePage";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box
            maxWidth="500px"
            maxHeight="900px"
            mx="auto"
            bgColor="lightblue"
            h="100vh"
          >
            <Switch>
              <UnprotectedRoute
                exact
                strict
                path="/sign-in"
                redirect="/"
                component={SignInPage}
              />
              <UnprotectedRoute
                exact
                strict
                path="/register"
                redirect="/"
                component={RegisterPage}
              />
              <ProtectedRoute
                exact
                strict
                path="/reminders"
                redirect="/sign-in"
                component={RemindersPage}
              />
              <ProtectedRoute
                exact
                strict
                path="/add-reminder"
                redirect="/sign-in"
                component={AddReminderPage}
              />
              <ProtectedRoute
                exact
                strict
                path="/edit-reminder-page"
                redirect="/sign-in"
                component={EditReminderPage}
              />
              <ProtectedRoute
                exact
                strict
                path="/reminder-details"
                redirect="/sign-in"
                component={ReminderDetailsPage}
              />
              <ProtectedRoute
                exact
                strict
                path="/rewards"
                redirect="/sign-in"
                component={RewardsPage}
              />
              <ProtectedRoute
                exact
                strict
                path="/chat"
                redirect="/sign-in"
                component={ChatPage}
              />
              <ProtectedRoute
                exact
                strict
                path="/patient-report"
                redirect="/sign-in"
                component={PatientReportPage}
              />
              <ProtectedRoute
                exact
                strict
                path="/"
                redirect="/sign-in"
                component={PatientHomePage}
              />
            </Switch>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
