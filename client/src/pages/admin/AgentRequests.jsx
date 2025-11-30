import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

export default function AgentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch agent requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get("/agent-request/all");
      setRequests(res.data.data); // backend returns { message, data }
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch agent requests.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReject = async (id) => {
    try {
      await axios.put(`/agent-request/update-status/${id}`, {
        status: "rejected",
      });

      toast.success("Request rejected!");

      fetchRequests();
    } catch (err) {
      toast.error("Failed to reject request");
    }
  };

  // Approve or Reject
  const handleApprove = async (req) => {
    try {
      // 1) Update status
      await axios.put(`/agent-request/update-status/${req._id}`, {
        status: "approved",
      });

      toast.success("Request approved!");

      // 2) Redirect to Add-Agent with prefilling data
      navigate("/add-agent", {
        state: {
          prefill: {
            firstName: req.firstName,
            lastName: req.lastName,
            age: req.age,
            email: req.email,
            phone: req.phone,
            city: req.city,
            state: req.state,
            country: req.country,
          },
        },
      });
    } catch (err) {
      toast.error("Failed to approve request");
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <MainLayout>
      <Card className="mr-3 my-6 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Agent Registration Requests
          </CardTitle>
        </CardHeader>

        <CardContent>
          {requests.length === 0 ? (
            <p className="p-4 text-gray-600">No pending agent requests.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>
                      {req.firstName} {req.lastName}
                    </TableCell>

                    <TableCell>{req.age}</TableCell>

                    <TableCell>{req.email}</TableCell>

                    <TableCell>{req.phone}</TableCell>

                    <TableCell>
                      {req.city}, {req.state}, {req.country}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-white text-sm ${
                          req.status === "pending"
                            ? "bg-yellow-500"
                            : req.status === "approved"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {req.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-center space-x-2">
                      <Button
                        disabled={req.status !== "pending"}
                        className="bg-green-600 text-white"
                        onClick={() => handleApprove(req)}
                      >
                        Approve
                      </Button>

                      <Button
                        disabled={req.status !== "pending"}
                        className="bg-red-600 text-white"
                        onClick={() => handleReject(req._id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
