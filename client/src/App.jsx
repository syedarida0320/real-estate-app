import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import RoleProtected from "@/routes/RoleProtected";
import Loader from "@/components/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AgentRegister from "./pages/AgentRegister";

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

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HeroSection />} />
          <Route path="/properties/search" element={<SearchResults />} />
          <Route path="/property/:slug" element={<PropertyDetails />} />
          <Route path="/all-cities" element={<AllCities />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/email" element={<VerifyEmail />} />
          <Route path="/register-agent" element={<AgentRegister />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/home"
            element={
              <RoleProtected allowedRoles={["Admin"]}>
                <Dashboard />
              </RoleProtected>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/properties" element={<Property />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route
            path="/properties/add"
            element={
              <RoleProtected allowedRoles={["Admin", "Agent"]}>
                <AddEditProperty />
              </RoleProtected>
            }
          />
          <Route
            path="/properties/edit/:id"
            element={
              <RoleProtected allowedRoles={["Admin", "Agent"]}>
                <AddEditProperty />
              </RoleProtected>
            }
          />

          <Route
            path="/agent"
            element={
              <RoleProtected allowedRoles={["Admin"]}>
                <Agent />
              </RoleProtected>
            }
          />
          <Route
            path="/agent/:id"
            element={
              <RoleProtected allowedRoles={["Admin"]}>
                <AgentDetail />
              </RoleProtected>
            }
          />
          <Route path="/message" element={<Message />} />
          <Route
            path="/add-agent"
            element={
              <RoleProtected allowedRoles={["Admin"]}>
                <AddAgent />
              </RoleProtected>
            }
          />
          <Route
            path="/admin/agent-requests"
            element={
              <RoleProtected allowedRoles={["Admin"]}>
                <AgentRequests />
              </RoleProtected>
            }
          />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"
        toastStyle={{ backgroundColor: "#f8fafc", color: "#111827" }}
      />
    </Suspense>
  );
};

export default App;
