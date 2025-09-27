const Review = require("../models/Review");
const {response}=require("../utils/response")

const getReviews = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const query = status ? { status } : {};
  
  try {
    const reviews = await Review.find(query)
      .populate("user")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Review.countDocuments(query);

     response.ok(res, "Reviews fetched successfully", {
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    response.serverError(res, error.message);
  }
};

module.exports = { getReviews };
