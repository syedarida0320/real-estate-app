// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import MainLayout from "@/layouts/MainLayout";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/dashboard");
        if (res?.data?.success) {
          setData(res.data.data);
        } else {
          setError("Failed to load dashboard data.");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      {loading && !data ? (
        <p className="p-6">Loading dashboard...</p>
      ) : error ? (
        <p className="p-6 text-red-500">{error}</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {(data?.stats || []).map((stat, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">
                    {stat.title || "Loading..."}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value ?? "--"}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue + Referrals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Chart */}
            <Card className="col-span-2 shadow-sm">
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartAreaInteractive />
              </CardContent>
            </Card>

            {/* Referrals */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Property Referrals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(data?.referrals || []).map((ref, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{ref.source || "Loading..."}</span>
                      <span>{ref.value ? `${ref.value}%` : "--"}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${ref.value || 0}%`,
                          backgroundColor: ref.color || "gray",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <SectionCards />
        </>
      )}
    </MainLayout>
  );
}
