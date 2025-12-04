const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const path = require("path");
const uploads = require("./routes/upload.routes");
const http = require("http");
const initSocket = require("./utils/socket");

dotenv.config();
connectDB();

const agenda = require("./config/agenda");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true })); // Needed to parse FormData

// ✅ Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/properties", require("./routes/property.routes"));
app.use("/api/agents", require("./routes/agent.routes"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api", require("./routes/email.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/maps", require("./routes/map.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api", require("./routes/subscribe.routes"));
app.use("/api/agent-request", require("./routes/agent.request.routes"));
app.use("/api/upload", uploads);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(colors.bgCyan(`Server running on port http://localhost:${PORT}`));
});
