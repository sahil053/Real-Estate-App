import express from "express";
import {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

const router = express.Router();

// Define the routes in the correct order
router.get("/", getAllProperties); // Route for getting all properties
router.get("/:id", getPropertyDetail); // Route for getting a specific property by ID
router.post("/", createProperty); // Route for creating a new property
router.patch("/:id", updateProperty); // Route for updating a property by ID
router.delete("/:id", deleteProperty); // Route for deleting a property by ID

export default router;
