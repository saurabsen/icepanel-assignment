// index.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./router/routes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", routes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
