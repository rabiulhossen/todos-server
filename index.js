const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.TASK_USER}:${process.env.TASK_PASS}@cluster0.r1g8k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const todoList = client.db("toDo").collection("tasks");

    app.get("/add", async (req, res) => {
      const query = {};
      const result = await todoList.find(query).toArray();
      res.send(result);
    });

    app.post("/add", async (req, res) => {
      const newDoc = req.body;

      const result = await todoList.insertOne(newDoc);
      res.send(result);
    });

    app.put("/add/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      console.log(filter);
      // options = { upsert: true };
      const updatedDoc = {
        $set: {
          completed: true,
        },
      };
      const result = await todoList.updateOne(filter, updatedDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" task app");
});

app.listen(port, () => {
  console.log(`task app running on port ${port}`);
});
