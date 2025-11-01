"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/authClient";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    image: "",
    imageType: "url",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await authClient.getSession();
      const data = session?.data?.user;
      setUser({
        name: data?.name || "",
        email: data?.email || "",
        bio: data?.bio || "",
        image: data?.image || "",
      });
    };
    fetchUser();
  }, []);

  // ✅ Fixed here
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...user,
      imageType: prev.imageType || "url",
    }));
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    let imageUrl = formData.image;

    // 🖼️ 1️⃣ Handle image upload if uploading
    if (formData.imageType === "upload" && file) {
      const fileData = new FormData();
      fileData.append("image", file);

      const uploadRes = await fetch("https://blogpost-with-betterauth-1.onrender.com/upload/user", {
        method: "POST",
        body: fileData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed");

      imageUrl = uploadData.url;
    }
    // 👤 2️⃣ Update user fields (name, image, maybe bio)
    const { data, error } = await authClient.updateUser({
      name: formData.name,
      image: imageUrl,
      bio: formData.bio,
    });

    // Fix: throw when there *is* an error
    if (error) {
      throw new Error(error.message || "Failed to update user");
    }
    console.log("✅ User updated:", data);  

    // 🔄 3️⃣ Refetch the updated session to refresh UI
    await authClient.getSession();

    const session = await authClient.getSession();
    console.log("🔄 Refetched session:", session);
    const updatedUser = session?.data?.user;
    if (updatedUser) {
      setUser({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        bio: updatedUser.bio || "",
        image: updatedUser.image || "",
      });

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        bio: updatedUser.bio || "",
        image: updatedUser.image || "",
        imageType: "url",
      });
    }

    alert("✅ Profile updated successfully!");
    setIsEditing(false);

  } catch (err: any) {
    console.error("❌ Error updating profile:", err);
    alert("❌ Failed to update profile: " + err.message);
  } finally {
    setLoading(false);
  }
};




  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100 p-8 transition-transform duration-300 hover:scale-[1.01]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <p className="mt-2 text-gray-700">{user.bio || "No bio added yet."}</p>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-700 transition"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {isEditing && (
          <>
            <hr className="my-8 border-gray-200" />
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Image type selection */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="imageType"
                    value="url"
                    checked={formData.imageType === "url"}
                    onChange={handleChange}
                  />
                  <span className="text-gray-700">Use Image URL</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="imageType"
                    value="upload"
                    checked={formData.imageType === "upload"}
                    onChange={handleChange}
                  />
                  <span className="text-gray-700">Upload Image</span>
                </label>
              </div>

              {formData.imageType === "url" ? (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Paste your image link"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-70"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
