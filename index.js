const express = require("express");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

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
// Join queue
app.post("/queue", async (req, res) => {
  try {
    const { reason, name } = req.body;

    // Validate required fields
    if (!reason || !name) {
      return res
        .status(400)
        .json({
          error: "Both reason and name are required to join the queue.",
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

// Update customer info
app.put("/customer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, email, name } = req.body;
    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: { phone, email, name },
    });
    res.json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating customer info." });
  }
});

// Get next in queue
app.get("/next", async (req, res) => {
  try {
    const nextInQueue = await prisma.queue.findFirst({
      where: { status: "waiting" },
      orderBy: { position: "asc" },
    });
    if (nextInQueue) {
      await prisma.queue.update({
        where: { id: nextInQueue.id },
        data: { status: "serving" },
      });
    }
    res.json(nextInQueue);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while getting the next in queue." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
