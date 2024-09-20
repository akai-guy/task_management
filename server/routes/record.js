import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";
import User from "../db/User.js";




// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id   
//              ^^^  unused so far bc same path as above?, no distinguish
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});


// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      title: req.body.title,
      category: req.body.category,
      date: req.body.date,
      status: req.body.status,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        title: req.body.title,
        category: req.body.category,
        date: req.body.date,
        status: req.body.status,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});



// register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      // let user = await User.findOne({ username });
      let collection = await db.collection("users");
      let user = await collection.findOne({ username });
      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({ username, password });
      console.log(user);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //await user.save();
      let result = await collection.insertOne(user);
      res.send(result).status(204);
      
      const payload = {
          user: { id: user.id }
      };

      jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, 
      (err, token) => {
          if (err) throw err;
          res.json({ token });
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

// login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if the user exists
      //let user = await User.findOne({ username });
      let collection = await db.collection("users");
      let user = await collection.findOne({ username });
      if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Generate JWT token
      const payload = {
          user: {
              id: user.id
          }
      };

      jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, 
      (err, token) => {
          if (err) throw err;
          res.json({ token });
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

export default router;