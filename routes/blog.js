import { Router } from "express";
import Blog from "../models/blog.js";

const router = Router();

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("createdBy");
    res.render("blogs", { blogs });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create blog form
router.get("/create", (req, res) => {
  res.render("createBlog");
});

// Create blog
router.post("/", async (req, res) => {
  const { title, content, coverImageURL } = req.body;
  const userId = req.user._id;

  try {
    const blog = await Blog.create({
      title,
      content,
      coverImageURL,
      createdBy: userId,
    });

    res.redirect("/blogs");
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    res.render("blog", { blog });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
