import React, { useState } from "react";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
=======
>>>>>>> 1f76e056cbffbb0c3871c1e718313fd9d67f66b0

export default function AgentRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    state: "",
    country: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/agent-request/create", formData);
      // Success Toast
      toast.success("Your request has been submitted!", {
        autoClose: 2000,
      });

      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        city: "",
        state: "",
        country: "",
        email: "",
        phone: "",
      });

      // Navigate to Home after 1 sec so toast is visible
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      // If backend sends message like "This email already belongs to an agent"
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          autoClose: 2500,
        });
      } else {
        toast.error("Something went wrong!", {
          autoClose: 2500,
        });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-7">
      <h2 className="text-3xl font-bold mb-5">Register as an Agent</h2>

      <div className="border-2 p-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* FIRST NAME */}
          <div>
            <label className="block font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              className="border p-3 rounded w-full"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.firstName}
              required
            />
          </div>

          {/* LAST NAME */}
          <div>
            <label className="block font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="border p-3 rounded w-full"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.lastName}
              required
            />
          </div>

          {/* AGE */}
          <div>
            <label className="block font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              min="0"
              className="border p-3 rounded w-full"
              placeholder="Age"
              onChange={handleChange}
              value={formData.age}
              required
            />
          </div>

          {/* CITY */}
          <div>
            <label className="block font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              className="border p-3 rounded w-full"
              placeholder="City"
              onChange={handleChange}
              value={formData.city}
              required
            />
          </div>

          {/* STATE */}
          <div>
            <label className="block font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              className="border p-3 rounded w-full"
              placeholder="State"
              onChange={handleChange}
              value={formData.state}
              required
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="block font-medium mb-1">Country</label>
            <input
              type="text"
              name="country"
              className="border p-3 rounded w-full"
              placeholder="Country"
              onChange={handleChange}
              value={formData.country}
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="border p-3 rounded w-full"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="border p-3 rounded w-full"
              placeholder="Phone Number"
              onChange={handleChange}
              value={formData.phone}
              required
            />
          </div>

<<<<<<< HEAD
          <Button
            type="submit"
            className="bg-blue-900 text-white px-6 py-5 rounded mt-4 col-span-2"
          >
            Submit
          </Button>
=======
          <button
            type="submit"
            className="bg-blue-900 text-white px-6 py-3 rounded mt-4 col-span-2"
          >
            Submit
          </button>
>>>>>>> 1f76e056cbffbb0c3871c1e718313fd9d67f66b0
        </form>
      </div>
    </div>
  );
}
