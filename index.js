const express = require("express");
const { PrismaClient } = require("@prisma/client");
const morgan = require("morgan");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
// Get queue status by position
app.get("/queue/:position", async (req, res) => {
  try {
    const { position } = req.params;
    const queue = await prisma.queue.findFirst({
      where: { position: parseInt(position), status: "waiting" },
    });
    res.json(queue);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching queue status." });
  }
});

// Join queue
app.post("/queue", async (req, res) => {
  try {
    const { reason, name, phone } = req.body;

    // Validate required fields
    if (!reason || !name || !phone) {
      return res.status(400).json({
        error: "Reason, name, and phone number are required to join the queue.",
      });
    }

    // Count current number of waiting queues
    const queueCount = await prisma.queue.count({
      where: { status: "waiting" },
    });

    // Create a new queue entry
    const newQueue = await prisma.queue.create({
      data: {
        reason,
        name,
        phone,
        position: queueCount + 1,
      },
    });

    // Respond with the new queue entry
    res.json(newQueue);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while joining the queue." });
  }
});

// Get all queues
app.get("/queues", async (req, res) => {
  try {
    const queues = await prisma.queue.findMany({
      where: { status: "waiting" },
      orderBy: { position: "asc" },
    });
    res.json(queues);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the queue." });
  }
});

// Get queue details by ID
app.get("/queue/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const queue = await prisma.queue.findUnique({
      where: { id: parseInt(id) },
    });

    if (queue) {
      res.json(queue);
    } else {
      res.status(404).json({ error: "Queue not found." });
    }
  } catch (error) {
    next(error);
  }
});

// Existing code...

// Get next in queue
// Update queue status
app.patch("/queue/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, attendedBy } = req.body;

    const updatedQueue = await prisma.queue.update({
      where: { id: parseInt(id) },
      data: {
        status,
        attendedBy, // Optional: Add this field to your model if needed
      },
    });

    res.json(updatedQueue);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the queue status." });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
