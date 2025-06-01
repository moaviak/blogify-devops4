import { Router } from "express";
import User from "../models/User.js";
import { createTokenForUser } from "../services/authentication.js";

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.matchPassword(email, password);
    const token = createTokenForUser(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.redirect("/blogs");
  } catch (error) {
    return res.render("signin", { error: "Invalid email or password" });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = await User.create({
      fullName,
      email,
      password,
    });

    const token = createTokenForUser(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.redirect("/blogs");
  } catch (error) {
    return res.render("signup", { error: "Error creating user" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

export default router;
