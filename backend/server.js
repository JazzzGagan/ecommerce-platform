const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

//routes
const authRoutes = require("./routes/authRoutes");

connectDB();

const app = express();
app.use(express.json());
app.use("/userImage", express.static("userImage"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
