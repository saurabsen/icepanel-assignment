const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./router/routes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 4000;

connectDB();

app.use("/api", routes);
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
