const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./router/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
