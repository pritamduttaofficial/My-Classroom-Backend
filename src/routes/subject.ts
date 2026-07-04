import { and, ilike, or } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema/app.js";

const router = express.Router();

// get all subjects with optional search, filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    // if search query exists, filter by subject name or subject code
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    // if department query exists, filter by department name
    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    // combine all filter conditions using AND
    const combinedFilter =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;
  } catch (error) {
    console.error("GET /subjects error:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});
