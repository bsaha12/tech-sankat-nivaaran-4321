const express = require("express");
const { BlogModel } = require("../model/blog.model");

const blogroute = express.Router();

blogroute.post("/add", async (req, res) => {
    try {
        const newBlog = new BlogModel(req.body);
        await newBlog.save();
        res.status(201).json({ message: "Blog added successfully" });
    } catch (err) {
        res.status(400).json({ message: "Failed to add blog", error: err.message });
    }
});

blogroute.get("/", async (req, res) => {
    try {
        const allBlogs = await BlogModel.find().sort({ createdAt: -1 });
        res.status(200).json(allBlogs);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

blogroute.patch("/update/:updateid", async (req, res) => {
    const updateId = req.params.updateid;
    const updatePayload = req.body;
    try {
        const updatedBlog = await BlogModel.findByIdAndUpdate(updateId, updatePayload, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog updated successfully", updatedBlog });
    } catch (err) {
        res.status(400).json({ message: "Failed to update blog", error: err.message });
    }
});

blogroute.delete("/delete/:deleteid", async (req, res) => {
    const deleteId = req.params.deleteid;
    try {
        const deletedBlog = await BlogModel.findByIdAndDelete(deleteId);

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: "Failed to delete blog", error: err.message });
    }
});

module.exports = {
    blogroute
};
