const express = require("express");
const cors=require ("cors")
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors=require("colors");
const emailRoutes=require("../src/routes/email.routes")

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/properties', require('./routes/property.routes'));
app.use('/api/agents', require('./routes/agent.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use("/api", emailRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(colors.bgCyan(`Server running on port ${PORT}`)));
