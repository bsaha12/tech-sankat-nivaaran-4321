const mongoose = require("mongoose");

const blogSchema= mongoose.Schema(
  {
    image:{type: String},
    blogname:{type: String, required: true},
    body: { type: String},
  },
  {
    versionKey: false,
  }
);

const BlogModel= mongoose.model("blog", blogSchema);

module.exports = {
  BlogModel,
};
