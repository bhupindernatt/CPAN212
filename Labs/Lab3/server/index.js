import express from "express"
import cors from "cors"
import save_router from "./routers/save_router.js"
import fetch_router from "./routers/fetch_router.js"

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads")) // Serve static files from the uploads folder

// Routes
app.use("/save", save_router)
app.use("/fetch", fetch_router)

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the server, Check /api-list for available routes")
})

// API List
app.get("/api-list", (req, res) => {
  const apiList = {
    save_routes: ["/save/single", "/save/multiple", "/save/dog"],
    fetch_routes: ["/fetch/single", "/fetch/multiple"],
  }

  res.json(apiList)
})

// Catch-all route for invalid requests
app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.url} exists` })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
