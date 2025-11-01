"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import PostCard from "@/app/component/PostCard";
import { Heart, MessageCircleCode } from "lucide-react";

type Post = {
  _id?: string;
  image: string;
  category: string;
  title: string;
  description: string;
  author: { name: string; img: string };
  date: string;
  like: { count: number; isliked: boolean };
  readTime: string;
};

export default function HomeClient() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const selectedPostRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://blogpost-with-betterauth-1.onrender.com/posts");
        const data = await res.json();

        if (data.length === 0) {
          // if no posts exist, add initial posts
          await fetch("https://blogpost-with-betterauth-1.onrender.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(INITIAL_POSTS),
          });

          // fetch again after inserting
          const newRes = await fetch("https://blogpost-with-betterauth-1.onrender.com/posts");
          const newData = await newRes.json();
          setAllPosts(newData);
        } else {
          setAllPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setTimeout(() => {
      selectedPostRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleLike = async (id: string) => {
    if (!id) return;

    const post = allPosts.find((p) => p._id === id);
    if (!post) return;

    const inc = post.like.isliked ? -1 : 1;

    // Optimistic UI update
    setAllPosts((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              like: {
                count: p.like.count + inc,
                isliked: !p.like.isliked,
              },
            }
          : p
      )
    );

    try {
      await fetch(`https://blogpost-with-betterauth-1.onrender.com/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inc }),
      });
    } catch (err) {
      console.error("❌ Error updating like:", err);
    }
  };

  if (allPosts.length === 0) {
    return <p className="text-center text-gray-600 mt-10">Loading posts...</p>;
  }

  const filteredPosts =
    activeFilter === "All"
      ? allPosts
      : allPosts.filter((p) => p.category === activeFilter);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header value={"allpost"} />

      {/* Hero Section */}
      <section className="text-black py-7 mb-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">All Posts</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Dive into our collection of insightful articles on technology,
            design, leadership, and more.
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 mb-6">
        <div className="flex justify-center space-x-4">
          {["All", "Technology", "Design", "JavaScript", "Leadership", "Cloud", "UI/UX"].map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveFilter(category);
                setVisibleCount(6);
                setSelectedPost(null);
              }}
              className={`px-4 py-2 rounded-full font-medium ${
                activeFilter === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Filter */}
      <div className="flex justify-end md:hidden max-w-7xl mx-auto px-4 mb-6 relative">
        <select
          onChange={(e) => {
            setActiveFilter(e.target.value);
            setVisibleCount(6);
            setSelectedPost(null);
          }}
          value={activeFilter}
          className="border border-gray-300 rounded-md px-3 py-1.5 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          name="filter"
        >
          {["All", "Technology", "Design", "JavaScript", "Leadership", "Cloud", "UI/UX"].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Selected Post */}
      {selectedPost && (
        <section
          ref={selectedPostRef}
          className="max-w-7xl mx-auto mb-12 px-4 flex flex-col md:flex-row items-center gap-8 bg-white shadow-md rounded-2xl overflow-hidden p-6"
        >
          <div className="md:w-1/2 w-full">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-80 object-cover rounded-xl"
            />
          </div>

          <div className="md:w-1/2 w-full flex flex-col justify-between">
            <div>
              <span className="text-sm border bg-gray-100 border-gray-400 rounded-2xl p-2 font-semibold text-blue-600 uppercase tracking-wide">
                {selectedPost.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-6 leading-tight">
                {selectedPost.title}
              </h2>
              <p className="text-gray-600 mt-4 text-base leading-relaxed">
                {selectedPost.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-7 border-t border-gray-100">
              <div className="flex items-center justify-between w-full">
                <div className="gap-2 flex items-center">
                  <img
                    src={selectedPost.author.img}
                    alt={selectedPost.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium text-gray-800">
                      {selectedPost.author.name}
                    </span>
                    <span className="text-xs text-gray-500">{selectedPost.date}</span>
                  </div>
                </div>
                <div className="flex gap-2 text-gray-400">
                  <span
                    onClick={() => selectedPost._id && handleLike(selectedPost._id)}
                    className="flex gap-1 cursor-pointer"
                  >
                    <Heart fill={selectedPost.like.isliked ? "red" : "none"} size={18} />{" "}
                    {selectedPost.like.count}
                  </span>
                  <span className="flex gap-1">
                    <MessageCircleCode size={18} /> 59
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post, index) => (
            <div onClick={() => handleSelectPost(post)} key={index} className="cursor-pointer">
              <PostCard post={post} onLike={() => post._id && handleLike(post._id)} />
            </div>
          ))}
        </div>

        {visibleCount < filteredPosts.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount(visibleCount + 3)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

// ✅ Default post data
const INITIAL_POSTS: Post[] = [
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    category: "Technology",
    title: "The Rise of AI: How Artificial Intelligence is Changing the World",
    description: "Artificial Intelligence (AI) is transforming industries, from healthcare to finance. Learn how AI is reshaping human work and creativity.",
    author: { name: "John Doe", img: "https://randomuser.me/api/portraits/men/10.jpg" },
    date: "August 15, 2023",
    like: { count: 0, isliked: false },
    readTime: ""
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    category: "Design",
    title: "Design Thinking: The Art of Solving Real Problems",
    description: "Discover how design thinking drives innovation and helps businesses build user-centered products.",
    author: { name: "Sarah Lee", img: "https://randomuser.me/api/portraits/women/20.jpg" },
    date: "September 2, 2023",
    like: { count: 0, isliked: false },
    readTime: ""
  }
];
