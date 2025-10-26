import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios
        .get(`/auth/verify/email?token=${token}`)
        .then((res) => {
          if (!res.data.success) {
            setTimeout(() => navigate("/login"), 2000);
          }

          if (res.data.data.verified) {
            setStatus("Email already verified. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
          } else {
            setEmail(res.data.data.email);
            setStatus("verified");
          }
        })
        .catch(() =>
          setStatus(
            "Invalid or expired token.  Please request a new verification link."
          )
        );
    }
  }, []);

  if (status === "verified") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Set Your New Password
          </h2>
          <SetPassword email={email} />
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

const SetPassword = ({ email }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await axios.post("/auth/set-password", { email, password });
    alert("Password set successfully!");
    navigate("/login");
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
