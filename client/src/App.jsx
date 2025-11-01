import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import Loader from "@/components/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = lazy(() => import("@/auth/Login"));
const Register = lazy(() => import("@/auth/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Profile = lazy(() => import("@/pages/Profile"));
const Property = lazy(() => import("@/pages/property/Property"));
const PropertyDetail = lazy(() => import("@/pages/property/PropertyDetail"));
const Agent = lazy(() => import("@/pages/agent/Agent"));
const AgentDetail = lazy(() => import("@/pages/agent/AgentDetail"));
const Message = lazy(() => import("@/pages/Message"));
const Review = lazy(() => import("@/pages/Review"));
const AddAgent = lazy(() => import("@/pages/agent/AddAgent"));
const AddEditProperty = lazy(() => import("@/pages/property/AddEditProperty"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/email" element={<VerifyEmail />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/properties" element={<Property />} />
          <Route path="/properties/add" element={<AddEditProperty />} />
          <Route path="/properties/edit/:id" element={<AddEditProperty />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/add-agent" element={<AddAgent />} />
          <Route path="/agent/:id" element={<AgentDetail />} />
          <Route path="/message" element={<Message />} />
          <Route path="/review" element={<Review />} />
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
        toastStyle={{backgroundColor: "#f8fafc", color:"#111827"}}
      />
    </Suspense>
  );
};

export default App;
