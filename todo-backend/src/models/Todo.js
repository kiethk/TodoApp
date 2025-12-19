const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        dueDate: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Todo", todoSchema);
