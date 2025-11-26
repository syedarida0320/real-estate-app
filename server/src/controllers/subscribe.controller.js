const Subscribe = require("../models/Subscribe");
const { response } = require("../utils/response");

const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return response.badRequest(res, "Email is required");
    }

    // Check duplicate
    const already = await Subscribe.findOne({ email });
    if (already) {
      return response.conflict(res, "Already subscribed");
    }

    const newSub = await Subscribe.create({ email });

    return response.created(res, "Subscription successful", newSub);
  } catch (error) {
    return response.serverError(res, "Server error", { error: error.message });
  }
};

module.exports = { addSubscriber };
