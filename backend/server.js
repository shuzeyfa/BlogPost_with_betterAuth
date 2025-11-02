// server.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

// --- Connect to MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// --- Allowed Origins (Frontend URLs) ---
const allowedOrigins = [
  "http://localhost:3000",
  "https://blog-post-with-better-auth-r4uu.vercel.app",
  "https://blog-post-with-better-auth-wwwc.vercel.app",
];

// --- Express App Setup ---
const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));

// --- Setup File Upload Folders ---
const uploadDir = path.join(process.cwd(), "uploads");
const userUploadDir = path.join(uploadDir, "user");
const postUploadDir = path.join(uploadDir, "post");

// Ensure directories exist
[uploadDir, userUploadDir, postUploadDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// --- Configure Multer ---
const createStorage = (folderPath) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, folderPath),
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });

const uploadUser = multer({ storage: createStorage(userUploadDir) });
const uploadPost = multer({ storage: createStorage(postUploadDir) });

// Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

// --- Define Post Schema ---
const postSchema = new mongoose.Schema({
  image: String,
  category: String,
  title: String,
  description: String,
  author: { name: String, img: String },
  date: String,
  like: { count: Number, isliked: Boolean },
  readTime: String,
});
const Post = mongoose.model("Post", postSchema);

// --- Helper Function ---
const calculateReadTime = (text) => {
  const words = text?.split(/\s+/).length || 0;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

// ✅ Dynamic Base URL (for Render or local)
const baseURL = process.env.BASE_URL || "http://localhost:5000";

// --- Upload User Image ---
app.post("/upload/user", uploadUser.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No image file uploaded" });

  const url = `${baseURL}/uploads/user/${req.file.filename}`;
  res.status(200).json({ success: true, message: "✅ User image uploaded", url });
});

// --- Upload Post Image ---
app.post("/upload/post", uploadPost.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No image file uploaded" });

  const url = `${baseURL}/uploads/post/${req.file.filename}`;
  res.status(200).json({ success: true, message: "✅ Post image uploaded", url });
});

// --- Create One or Many Posts ---
app.post("/posts", async (req, res) => {
  try {
    let body = req.body;
    if (!Array.isArray(body)) body = [body];

    const dynamicPosts = body.map((post) => ({
      image:
        post.image ||
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      category: post.category,
      title: post.title,
      description: post.description,
      author: post.author,
      date: post.date || new Date().toISOString(),
      like: post.like || { count: 0, isliked: false },
      readTime: post.readTime || calculateReadTime(post.description || "temp"),
    }));

    const posts = await Post.insertMany(dynamicPosts);
    res.status(201).json({ success: true, message: "✅ Posts created", posts });
  } catch (error) {
    console.error("❌ Error creating posts:", error);
    res.status(500).json({ success: false, message: "Error creating post(s)", error });
  }
});

// --- Get All Posts ---
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching posts", error });
  }
});

// --- Get Single Post ---
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching post", error });
  }
});

// --- Update Post ---
app.put("/posts/:id", async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ success: true, message: "✅ Post updated", post: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating post", error });
  }
});

// --- Patch Like Count ---
app.patch("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { inc } = req.body;

    if (typeof inc !== "number" || ![1, -1].includes(inc))
      return res.status(400).json({ error: "Invalid like change value" });

    const updated = await Post.findByIdAndUpdate(
      id,
      { $inc: { "like.count": inc } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Post not found" });

    res.json({ success: true, post: updated });
  } catch (err) {
    console.error("❌ PATCH /posts error:", err);
    res.status(500).json({ error: "Failed to update like" });
  }
});

// --- Delete Single Post ---
app.delete("/posts/:id", async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ success: true, message: "✅ Post deleted", post: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting post", error });
  }
});

// --- Delete All Posts ---
app.delete("/posts", async (req, res) => {
  try {
    const result = await Post.deleteMany({});
    res.status(200).json({
      success: true,
      message: `✅ All posts deleted (${result.deletedCount} removed)`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting all posts", error });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
