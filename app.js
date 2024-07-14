const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://mongo:27017/docker-workshop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const Item = mongoose.model("Item", itemSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Docker with MongoDB!");
});

// Create an item
app.get("/create-item", async (req, res) => {
  const { name, quantity } = req.query;
  if (!name || !quantity) {
    return res.status(400).json({ error: "Name and quantity are required" });
  }

  const item = new Item({ name, quantity: Number(quantity) });
  try {
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/secret", (req, res) => {
  res.send(
    "Hello, Docker! Here are your super secret credentials " +
      process.env.SECRET_KEY
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
