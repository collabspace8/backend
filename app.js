require("dotenv").config();

const express = require("express");
const userRoutes = require("./routes/userRoutes");
const { client, run } = require("./connect");
const { ObjectId } = require("mongodb");

const Property = require('./models/propertyModel');


const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(express.json());
app.use("/api", userRoutes); // Mount the userRoutes on the /api path

// API ENDPOINT TO HANDLE REGISTRATION
app.post("/register", async (req, res) => {
  const formData = req.body;
  try {
    const db = client.db("CollabSpacedb"); 
    const collection = db.collection("Register"); 
    const result = await collection.insertOne(formData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error });
  }
});

// API ENDPOINT TO ADD A NEW PROPERTY
app.post("/add-property", async (req, res) => {
  // const propertyData = req.body; // Get property data from request body
  const propertyData = { ...req.body, createdAt: new Date() };
  try {
    const db = client.db("CollabSpacedb"); 
    const collection = db.collection("Properties"); 
    const result = await collection.insertOne(propertyData);
    res.status(201).json({ message: "Property added successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to add property", error });
  }
});

// API ENDPOINT TO LOAD ALL PROPERTIES IN THE PROPERTY TABLE
app.get("/properties", async (req, res) => {
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");
    const properties = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
});

// API ENDPOINT THAT FETCHES A SINGLE PROPERTY BY _ID
app.get("/properties/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");
    const property = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch property", error });
  }
});

// API ENDPOINT TO UPDATE THE PROPERTY TABLE
app.put("/properties/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property updated successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update property", error });
  }
});

// API ENDPOINT TO DELETE A PROPERTY
app.delete("/properties/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const _id = new ObjectId(id);
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Properties");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete property", error });
  }
});

// API ENDPOINT TO ADD A NEW WORKSPACE
app.post("/add-workspace", async (req, res) => {
  const workspaceData = req.body; // Get workspace data from request body
  try {
    // Ensure that 'client' is initialized and connected to your MongoDB database
    const db = client.db("CollabSpacedb");

    // Ensure that 'Workspaces' collection exists in your database
    const collection = db.collection("Workspaces"); // Create or specify the collection for workspaces

    // Insert the workspace data into the 'Workspaces' collection
    const result = await collection.insertOne(workspaceData);

    // Send a success response with the result of the insert operation
    res.status(201).json(result.ops[0]); // Send the inserted workspace data back to the client
  } catch (error) {
    // If an error occurs, log it and send an error response
    console.error(error);
    res.status(500).json({ message: "Failed to add workspace", error });
  }
});

// API ENDPOINT THAT FETCHES A SINGLE WORKSPACE BY _ID
app.get("/workspaces/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const workspace = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch workspace", error });
  }
});


// API ENDPOINT TO UPDATE A WORKSPACE
app.put("/workspaces/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ message: "Workspace updated successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update workspace", error });
  }
});

// API ENDPOINT TO DELETE A WORKSPACE
app.delete("/workspaces/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const _id = new ObjectId(id);
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const result = await collection.deleteOne({ _id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete workspace", error });
  }
});

// API ENDPOINT TO LOAD ALL WORKSPACES
app.get("/workspaces", async (req, res) => {
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const workspaces = await collection.find({}).toArray(); // Removed the empty object
    res.status(200).json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch workspaces", error });
  }
});


// API ENDPOINT TO FETCH ALL WORKSPACES FOR A PROPERTY
app.get("/properties/:propertyId/workspaces", async (req, res) => {
  const { propertyId } = req.params;
  try {
    const db = client.db("CollabSpacedb");
    const collection = db.collection("Workspaces");
    const workspaces = await collection.find({ propertyId }).toArray();
    res.status(200).json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch workspaces", error });
  }
});

const PORT = process.env.PORT || 3000;

run()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(console.dir);