import React from "react";
import {Route, Routes } from "react-router-dom";
import Login from "@/auth/Login";
import Register from "@/auth/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Dashboard/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </>
  );
};

export default App;
