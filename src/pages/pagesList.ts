import { NavRoute } from "../types";
import AddReminderPage from "./AddReminderPage";
import ChatPage from "./ChatPage";
import ChatConversationPage from "./ChatConversationPage";
import EditReminderPage from "./EditReminderPage";
import PatientHomePage from "./PatientHomePage";
import PatientReportPage from "./PatientReportPage";
import RegisterPage from "./RegisterPage";
import ReminderDetailsPage from "./ReminderDetailsPage";
import RemindersPage from "./RemindersPage";
import RewardsPage from "./RewardsPage";
import SignInPage from "./SignInPage";
import SignOutPage from "./SignOutPage";
import InsuranceCardPage from "./InsuranceCardPage";

const pagesList: NavRoute[] = [
  {
    component: SignInPage,
    pageTitle: "Sign In",
    path: "/sign-in",
    redirect: "/",
    unprotected: true,
    onDrawer: true,
  },
  {
    component: RegisterPage,
    pageTitle: "Register",
    path: "/register",
    redirect: "/",
    unprotected: true,
    onDrawer: true,
  },
  {
    component: RemindersPage,
    pageTitle: "My Reminders",
    path: "/reminders",
    redirect: "/sign-in",
    _protected: true,
    onDrawer: true,
  },
  {
    component: InsuranceCardPage,
    pageTitle: "Insurance Card",
    path: "/insurance-card",
    redirect: "/",
    _protected: true,
    onDrawer: true,
  },
  {
    component: AddReminderPage,
    pageTitle: "New Reminder",
    path: "/add-reminder",
    redirect: "/sign-in",
    _protected: true,
  },
  {
    component: EditReminderPage,
    pageTitle: "Edit Reminder",
    path: "/edit-reminder",
    redirect: "/sign-in",
    _protected: true,
  },
  {
    component: ChatConversationPage,
    pageTitle: "Chat Conversation",
    path: "/chat-conversation",
    redirect: "/sign-in",
    _protected: true,
  },
  {
    component: ReminderDetailsPage,
    pageTitle: "Reminder Details",
    path: "/reminder-details",
    redirect: "/sign-in",
    _protected: true,
  },
  {
    component: RewardsPage,
    pageTitle: "Rewards",
    path: "/rewards",
    redirect: "/sign-in",
    _protected: true,
    onDrawer: true,
  },
  {
    component: ChatPage,
    pageTitle: "Chat",
    path: "/chat",
    redirect: "/sign-in",
    _protected: true,
    onDrawer: true,
  },
  {
    component: PatientReportPage,
    pageTitle: "Patient Report",
    path: "/patient-report",
    redirect: "/sign-in",
    _protected: true,
    onDrawer: true,
  },
  {
    component: PatientHomePage,
    pageTitle: "Patient Home",
    path: "/",
    redirect: "/sign-in",
    _protected: true,
    onDrawer: true,
  },
  {
    component: SignOutPage,
    pageTitle: "Sign Out",
    path: "/sign-out",
    redirect: "/sign-in",
    _protected: true,
    onDrawer: true,
  },
];

export default pagesList;
