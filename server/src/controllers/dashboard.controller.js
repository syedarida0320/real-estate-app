const { response } = require("../utils/response");

const dashboardData = {
  stats: [
    { title: "Properties for Sale", value: 684 },
    { title: "Properties for Rent", value: 546 },
    { title: "Total Customers", value: 5732 },
    { title: "Total Cities", value: 90 },
  ],
  referrals: [
    { source: "Social Media", value: 64, color: "#6366F1" },
    { source: "Marketplaces", value: 40, color: "#22C55E" },
    { source: "Websites", value: 50, color: "#FACC15" },
    { source: "Digital Ads", value: 80, color: "#EF4444" },
    { source: "Others", value: 15, color: "#A855F7" },
  ],
};

// Controller to get dashboard data
const getDashboardData = async (req, res) => {
  try {
    return response.ok(res, "Dashboard data fetched successfully", dashboardData);
  } catch (err) {
    return response.serverError(res, "Failed to fetch dashboard data", err.message);
  }
};

module.exports = { getDashboardData };
