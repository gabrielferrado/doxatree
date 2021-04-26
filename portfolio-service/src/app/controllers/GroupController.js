import { Router } from "express";
import GroupService from "../services/GroupService";

const GroupController = Router();

GroupController.get("/", async (req, res) => {
  try {
    const response = await GroupService.find();
    return res.json(response);
  } catch (e) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "Asset not found" });
  }
});

GroupController.get("/:groupId", async (req, res) => {
  try {
    return res.json({});
  } catch (e) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "Asset not found" });
  }
});

GroupController.post("/", async (req, res) => {
  try {
    const response = await GroupService.store(req.body);
    return res.json(response);
  } catch (e) {
    return res.status(500).json({ statusCode: 500, message: e.message });
  }
});

GroupController.put("/:groupId", async (req, res) => {
  try {
    return res.json();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      statusCode: 500,
      message: e.message,
    });
  }
});

GroupController.delete("/:groupId", async (req, res) => {
  try {
    return res.send();
  } catch (e) {
    return res.status(500).json({
      statusCode: 500,
      message: e.message,
    });
  }
});

export default GroupController;
