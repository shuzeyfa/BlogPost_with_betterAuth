"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreatePostClientProps {
  session: any;
}

export default function CreatePostClient({ session }: CreatePostClientProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    imageType: "url", // 👈 user can choose URL or upload
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      // 🖼️ If user uploaded file, send it to backend first
      if (formData.imageType === "upload" && file) {
        const fileData = new FormData();
        fileData.append("image", file);

        const uploadRes = await fetch("https://blogpost-with-betterauth-1.onrender.com/upload/post", {
          method: "POST",
          body: fileData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message);
        imageUrl = uploadData.url; // backend returns image URL
      }

      const newPost = {
        image: imageUrl,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        author: {
          name: session?.user?.name,
          img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        },
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        like: { count: 0, isliked: false },
        readTime: "",
      };

      const res = await fetch("https://blogpost-with-betterauth-1.onrender.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create post");

      alert("✅ Post created successfully!");
      router.push("/");
    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert("❌ Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create a New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
              required
              placeholder="Enter post title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={400}
              required
              placeholder="Write your post content..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Design">Design</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Leadership">Leadership</option>
              <option value="Cloud">Cloud</option>
              <option value="UI/UX">UI/UX</option>
            </select>
          </div>

          {/* Image Upload Type */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageType"
                value="url"
                checked={formData.imageType === "url"}
                onChange={handleChange}
              />
              Use Image URL
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageType"
                value="upload"
                checked={formData.imageType === "upload"}
                onChange={handleChange}
              />
              Upload from device
            </label>
          </div>

          {/* Image Input */}
          {formData.imageType === "url" ? (
            <div>
              <label className="block font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="Paste image URL (e.g. from Unsplash)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="block font-medium text-gray-700 mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          )}

          {/* Author */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Author</label>
            <input
              type="text"
              value={session?.user?.name || ""}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </main>
  );
}
