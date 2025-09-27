const mongoose = require("mongoose");
const colors=require("colors");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(colors.bgGreen(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(colors.bgRed(`Error: ${error.message}`));
    process.exit(1);
  }
};

module.exports = connectDB;
