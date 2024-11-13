const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./router/routes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
const port = process.env.PORT || 3000;

app.use("/api", routes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
