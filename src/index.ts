import "dotenv/config";
import express from "express";
import { db } from "./db/index.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello, World!");
});

app.get("/api/health", async (_req, res) => {
  try {
    const result = await db.execute("SELECT 1");
    res.json({ status: "ok", db: "connected", result });
  } catch (error) {
    res.status(500).json({ status: "error", db: "disconnected", error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
