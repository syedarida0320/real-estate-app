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
        .catch(() => setStatus("Invalid or expired token.  Please request a new verification link."));
    }
  }, []);

  if (status === "verified") {
    return (
      <div className="flex flex-col items-center p-6">
        <h2 className="text-xl font-bold mb-4">Set New Password</h2>
        <SetPassword email={email} />
      </div>
    );
  }

  return <div className="text-center mt-10 text-gray-700">{status}</div>;
};

const SetPassword = ({ email }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/auth/set-password", { email, password });
    alert("Password set successfully!");
    navigate("/login");
    
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button className="bg-blue-600 text-white p-2 rounded">Set Password</button>
    </form>
  );
};

export default VerifyEmail;
