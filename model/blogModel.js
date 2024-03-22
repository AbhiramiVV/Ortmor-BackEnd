import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog Title is required"],
  },
  shortDescription: {
    type: String,
    required: [true, "Short Description is required"],
  },
  metaTitle: {
    type: String,
    required: [true, "Meta Title is required"],
  },
  metaDescription: {
    type: String,
    required: [true, "Meta Description is required"],
  },
  metaTag: {
    type: String,
    required: [true, "Meta Tag is required"],
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
  },
  image: {
    type: Object,
    required: true,
  },
  video: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const blogModel = mongoose.model("Blog", blogSchema);

export default blogModel;
