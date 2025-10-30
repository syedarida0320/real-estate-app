const express = require("express");
const cors=require ("cors")
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors=require("colors");
const path=require("path");
const uploads =require("./routes/upload.routes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true })); // Needed to parse FormData


// ✅ Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/properties', require('./routes/property.routes'));
app.use('/api/agents', require('./routes/agent.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use("/api", require('./routes/email.routes'));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/maps", require("./routes/map.routes"));
app.use("/api/upload", uploads);
app.use("/uploads",express.static(path.join(__dirname, "uploads")))
// app.use("/uploads", express.static("uploads"));
// app.use("/uploads",express.static(path.join(__dirname, "./uploads")));
app.use('/images', express.static('public/images'));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(colors.bgCyan(`Server is running on port ${PORT}`)));
