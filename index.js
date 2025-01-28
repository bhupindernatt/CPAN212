import dotenv from "dotenv";
dotenv.config();
import express from "express";
import routes from "./route.js"; // Import the routes filev

const app = express();

app.use("/", routes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
