import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import apiRoutes from "./server/routes";
import { seedDatabase } from "./server/seedDatabase";
import { getDb } from "./server/db";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Initialize database and Seeding
try {
  console.log("Local JSON Persistence Engine initialized successfully");
  seedDatabase()
    .then(() => console.log("Database verification and seeding completed."))
    .catch(err => console.error("Self-seeding sequence failed:", err));
} catch (error) {
  console.error("Failed to initialize database on startup:", error);
}

// --- API ROUTES ---
app.get("/api/db-health", async (req, res) => {
  try {
    const db = getDb();
    res.json({ 
      status: "connected",
      connected: true,
      service: "Local JSON Persistence Engine"
    });
  } catch (error) {
    res.json({ 
      status: "disconnected",
      connected: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

app.use("/api", apiRoutes);

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
