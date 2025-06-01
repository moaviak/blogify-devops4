import path from "path";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import blogRoutes from "./routes/blog.js";
import checkAuth from "./middlewares/auth.js";
import Blog from "./models/blog.js";
import { validateToken } from "./services/authentication.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8001;
const uri =
  "mongodb+srv://moaviak31:7IbB4ZGlvN46skwF@cluster0.xbff1v1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri).then((e) => console.log("Mongodb is connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());

// Add user to res.locals middleware
app.use(async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const user = validateToken(token);
    res.locals.user = user;
  }
  next();
});

// Routes
app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("createdBy");
    res.render("home", { blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.render("home", { blogs: [] });
  }
});

app.use("/user", userRoutes);
app.use("/blogs", checkAuth, blogRoutes);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
