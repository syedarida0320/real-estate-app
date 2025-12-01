import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import PublicRoute from "@/routes/PublicRoute";
import PrivateRoute from "@/routes/PrivateRoute";
import RoleProtected from "@/routes/RoleProtected";
import AgentRegister from "@/pages/AgentRegister";

// Lazy loaded components
const HeroSection = lazy(() => import("@/pages/HeroSection"));
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const PropertyDetails = lazy(() =>
  import("@/pages/Property/PropertyDetails.jsx")
);
const AllCities = lazy(() => import("@/pages/AllCities"));
const Login = lazy(() => import("@/auth/Login"));
const Register = lazy(() => import("@/auth/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Profile = lazy(() => import("@/pages/Profile"));
const Property = lazy(() => import("@/pages/property/Property"));
const PropertyDetail = lazy(() => import("@/pages/property/PropertyDetail"));
const Agent = lazy(() => import("@/pages/agent/Agent"));
const AgentDetail = lazy(() => import("@/pages/agent/AgentDetail"));
const Message = lazy(() => import("@/pages/Message"));
const AddAgent = lazy(() => import("@/pages/agent/AddAgent"));
const AddEditProperty = lazy(() => import("@/pages/property/AddEditProperty"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));
const AgentRequests = lazy(() => import("@/pages/admin/AgentRequests"));

export const routes = [
  {
    element: <PublicRoute />,
    children: [
      { path: "/", element: <HeroSection /> },
      { path: "/properties/search", element: <SearchResults /> },
      { path: "/property/:slug", element: <PropertyDetails /> },
      { path: "/all-cities", element: <AllCities /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/verify/email", element: <VerifyEmail /> },
      { path: "/register-agent", element: <AgentRegister /> },
    ],
  },
  { path: "*", element: <Navigate to="/login" /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/home",
        element: (
          <RoleProtected allowedRoles={["Admin"]}>
            <Dashboard />
          </RoleProtected>
        ),
      },
      { path: "/profile", element: <Profile /> },
      { path: "/properties", element: <Property /> },
      { path: "/properties/:id", element: <PropertyDetail /> },
      {
        path: "/properties/add",
        element: (
          <RoleProtected allowedRoles={["Admin", "Agent"]}>
            <AddEditProperty />
          </RoleProtected>
        ),
      },
      {
        path: "/properties/edit/:id",
        element: (
          <RoleProtected allowedRoles={["Admin", "Agent"]}>
            <AddEditProperty />
          </RoleProtected>
        ),
      },
      {
        path: "/agent",
        element: (
          <RoleProtected allowedRoles={["Admin"]}>
            <Agent />
          </RoleProtected>
        ),
      },
      {
        path: "/agent/:id",
        element: (
          <RoleProtected allowedRoles={["Admin"]}>
            <AgentDetail />
          </RoleProtected>
        ),
      },
      { path: "/message", element: <Message /> },
      {
        path: "/add-agent",
        element: (
          <RoleProtected allowedRoles={["Admin"]}>
            <AddAgent />
          </RoleProtected>
        ),
      },
      {
        path: "/admin/agent-requests",
        element: (
          <RoleProtected allowedRoles={["Admin"]}>
            <AgentRequests />
          </RoleProtected>
        ),
      },
    ],
  },
];
