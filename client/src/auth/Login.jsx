import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import loginImage from "@/assets/Sign-In.jpg";
import { useAuth } from "@/context/AuthContext";
import axios from "@/utils/axios";
//import { useNavigate } from "react-router-dom";

function Login() {
 // const navigate = useNavigate();
  const { loginUser, user } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (user) {
  //     navigate("/home"); // redirect after login
  //   }
  // }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors({});

      const res = await axios.post("/auth/login", formData);
      const payload = res.data.data || res.data;

      loginUser({ user: payload.user, token: payload.token });
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors); // field-specific errors
      } else {
        setErrors({ general: err.response?.data?.message || "Login failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
        <Card className="w-full mt-[85px] max-w-md shadow-lg rounded-2xl p-6">
          <CardContent>
            <h2 className="text-center text-2xl font-bold mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              Please enter your details to sign in.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Remember for 30 days</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot Password?
                </a>
              </div>

              {errors.general && (
                <p className="text-red-500 text-sm mt-2">{errors.general}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                <span>Sign in with Google</span>
              </Button>
            </form>

            <p className="text-center text-sm mt-6">
              Don’t have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-full md:w-1/2 h-screen">
        <img src={loginImage} alt="Login" className="object-cover w-full" />
      </div>
    </div>
  );
}

export default Login;
