const { response } = require("../utils/response");
const Property = require("../models/Property");
const User = require("../models/User");

const getDashboardData = async (req, res) => {
  try {
    const [saleCount, rentCount, customersCount] = await Promise.all([
      Property.countDocuments({ availabilityType: "for_sale" }),
      Property.countDocuments({ availabilityType: "for_rent" }),
      User.countDocuments({ role: { $nin: ["Agent", "Admin"] } }),
    ]);

    // 4) Total distinct cities where properties exist.
    // Use distinct to get unique non-empty city values.
    let cityValues = [];
    try {
      /* The line `cityValues = await Property.distinct("location.city");` is querying the database to
      retrieve unique values of the "city" field within the "location" subdocument of each Property
      document. It uses the `distinct` method provided by Mongoose to return an array of unique city
      values found in the database. */
      cityValues = await Property.distinct("location.city");
    } catch (e) {
      // fallback: try top-level "city" if you used that earlier
      cityValues = await Property.distinct("city");
    }
    // Filter out falsy/empty values and normalize trimming
    const uniqueCities = (cityValues || [])
      .map((c) => (typeof c === "string" ? c.trim() : c))
      .filter((c) => c !== null && c !== undefined && c !== "");

    const totalCities = uniqueCities.length;

    const dashboardData = {
      stats: [
        { title: "Properties for Sale", value: saleCount },
        { title: "Properties for Rent", value: rentCount },
        { title: "Total Customers", value: customersCount },
        { title: "Total Cities", value: totalCities },
      ],
      // keep referrals static for now (you can compute this dynamically later)
      referrals: [
        { source: "Social Media", value: 64, color: "#6366F1" },
        { source: "Marketplaces", value: 40, color: "#22C55E" },
        { source: "Websites", value: 50, color: "#FACC15" },
        { source: "Digital Ads", value: 80, color: "#EF4444" },
        { source: "Others", value: 15, color: "#A855F7" },
      ],
    };

    return response.ok(
      res,
      "Dashboard data fetched successfully",
      dashboardData
    );
  } catch (err) {
    console.error("getDashboardData error:", err);
    return response.serverError(
      res,
      "Failed to fetch dashboard data",
      err.message
    );
  }
};

module.exports = { getDashboardData };
