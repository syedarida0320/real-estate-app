import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios
        .get(`/auth/verify/email?token=${token}`)
        .then((res) => {
          if (!res.data.success) {
            toast.error("Verification failed. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
          } else if (res.data.data.verified) {
            toast.info("Email already verified. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
          } else {
            setToken(res.data.data.token);
            toast.success("Email verified successfully!");
            setStatus("verified");
          }
        })
        .catch(() => {
          toast.error("Invalid or expired token.");
          setStatus("Invalid link.");
        });
    } else {
      toast.warn("Verification token not found in URL.");
      setStatus("Verification token not found.");
    }
  }, [navigate, searchParams]);

  if (status === "verified") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Set Your New Password
          </h2>
          <SetPassword token={token} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <p className="text-gray-700 text-lg">{status}</p>
    </div>
  );
};

const SetPassword = ({ token }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warn("Passwords do not match!");
      return;
    }

    try {
      await axios.post("/auth/set-password", { token , password });
      toast.success("Password set successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("Failed to set password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
      >
        Set Password
      </button>
    </form>
  );
};

export default VerifyEmail;
