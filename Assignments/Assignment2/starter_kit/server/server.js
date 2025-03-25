import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import recipeRoutes from "./routes/recipes_router.js"; // Only keeping recipe routes

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // To handle CORS issues

// Connect to MongoDB
connectDB();

// Routes - only recipe routes remain
app.use("/recipe", recipeRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});