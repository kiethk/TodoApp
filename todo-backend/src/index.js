require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
//Using cors to add Header Access-Control-Allow-Origin
const cors = require("cors");
const app = express();
const Todo = require("./models/Todo");

//Database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

//Middleware
app.use(cors());
app.use(express.json());

//Define routes
app.post("/todos", async (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ message: "Title is required!" });
    }

    try {
        const newTodo = new Todo({
            title: req.body.title,
        });

        await newTodo.save();
        return res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find();

        return res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).send("Invalid id!");

        return res.status(200).json(todo);
    } catch (error) {
        return error.name === "CastError"
            ? res.status(400).json({ message: "Invalid id format", error: error.message })
            : res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

        if (!deletedTodo) return res.status(404).send("Invalid id!");

        return res.status(204).send();
    } catch (error) {
        return error.name === "CastError"
            ? res.status(400).json({ message: "Invalid id format", error: error.message })
            : res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.patch("/todos/:id", async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedTodo) return res.status(404).send("Invalid id!");

        return res.status(200).json(updatedTodo);
    } catch (error) {
        return error.name === "CastError"
            ? res.status(400).json({ message: "Invalid id format", error: error.message })
            : res.status(500).json({ message: "Server error", error: error.message });
    }
});

//Server start up

const PORT = 3000;

app.listen(PORT, () => console.log("Listen"));
