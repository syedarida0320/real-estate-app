import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "@/utils/axios";
import registerImage from "@/assets/Sign-In.jpg";

function Register() {
  const navigate = useNavigate();
  const { loginUser, user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword, phone } =
      formData;

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    // prepare payload exactly as backend expects
    const dataToSend = {
      firstName,
      lastName,
      email,
      password,
      ...(phone && { phone }), // optional
    };

    try {
      setLoading(true);
      setErrors({});
      setLocalError(null);

      const res = await axios.post("/auth/register", dataToSend);
      const payload = res.data.data || res.data;

      loginUser({ user: payload.user, token: payload.token });
      navigate("/home");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setLocalError(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
        <Card className="w-full mt-[60px] max-w-md shadow-lg rounded-2xl p-6">
          <CardContent>
            <h2 className="text-2xl font-bold text-center mb-2">
              Create Account
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              Fill in the details to get started.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {localError && (
                  <p className="text-red-500 text-xs mt-1">{localError}</p>
                )}
              </div>

              <div>
                <Input
                  type="text"
                  name="phone"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 cursor-pointer"
              >
                Login
              </span>
            </p>

            {errors.general && (
              <p className="text-red-500 text-center mt-2">{errors.general}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-full md:w-1/2 h-screen">
        <img
          src={registerImage}
          alt="Register"
          className="object-cover w-full"
        />
      </div>
    </div>
  );
}

export default Register;
