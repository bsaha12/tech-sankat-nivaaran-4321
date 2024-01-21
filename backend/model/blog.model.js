const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        blogname: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        image: {
            type: String
        },
        // Add createdAt field
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const BlogModel = mongoose.model("Blog", blogSchema);

module.exports = {
    BlogModel,
};
