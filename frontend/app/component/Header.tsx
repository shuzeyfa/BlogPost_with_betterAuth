"use client";

import { useEffect, useState } from "react";
import { signOutAction } from "../actions/actions";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
type headerProps = {
  value: string;
};

export default function Header({ value }: headerProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [session, setSession] = useState({
    name: "",
    email: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
      const fetchUser = async () => {
        const session = await authClient.getSession();
        const data = session?.data?.user;
        setSession({
          name: data?.name || "",
          email: data?.email || "",
          bio: data?.bio || "",
          image: data?.image || "",
        });
      };
      fetchUser();
    }, []);

  return (
    <header className="bg-white shadow w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Hamburger for mobile view */}
        <div className="lg:hidden">
          {menuOpen ? (
            <XMarkIcon
              className="h-6 w-6 text-gray-700 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <Bars3Icon
              className="h-6 w-6 text-gray-700 cursor-pointer"
              onClick={() => setMenuOpen(true)}
            />
          )}
        </div>

        {menuOpen && (
          <div className="absolute top-12 left-8 bg-white border rounded-md shadow-md flex flex-col items-start p-4 space-y-3 lg:hidden">
            <a
              href="/"
              className={`hover:text-blue-500 border-b-2 ${
                value === "allpost"
                  ? "border-blue-500"
                  : "border-transparent"
              } cursor-pointer`}
            >
              All Posts
            </a>
            <a
              href="/about"
              className={`hover:text-blue-500 border-b-2 ${
                value === "about"
                  ? "border-blue-500"
                  : "border-transparent"
              } cursor-pointer`}
            >
              About
            </a>
            <a
              href="/profile"
              className={`hover:text-blue-500 border-b-2 ${
                value === "profile"
                  ? "border-blue-500"
                  : "border-transparent"
              } cursor-pointer`}
            >
              Profile
            </a>
            <a
              href="/createPost"
              className={`hover:text-blue-500 border-b-2 ${
                value === "newpost"
                  ? "border-blue-500"
                  : "border-transparent"
              } cursor-pointer`}
            >
              New Post
            </a>
          </div>
        )}

        {/* Left section - Logo + Nav */}
        <div className="flex items-center gap-10">
          <div className="text-3xl font-extrabold text-blue-600">
            BlogCraft
          </div>
        </div>

        <nav className="hidden lg:flex gap-6 text-gray-700 font-medium">
          <a
            href="/"
            className={`hover:text-blue-500 border-b-2 ${
              value === "allpost"
                ? "border-blue-500"
                : "border-transparent"
            } cursor-pointer`}
          >
            All Posts
          </a>
          <a
            href="/about"
            className={`hover:text-blue-500 border-b-2 ${
              value === "about"
                ? "border-blue-500"
                : "border-transparent"
            } cursor-pointer`}
          >
            About
          </a>
          <a
            href="/profile"
            className={`hover:text-blue-500 border-b-2 ${
              value === "profile"
                ? "border-blue-500"
                : "border-transparent"
            } cursor-pointer`}
          >
            Profile
          </a>
        </nav>

        {/* Right section - Buttons + Profile */}
        <div className="flex items-center gap-4">
          {/* New Post Button */}
          <div className="max-w-7xl hidden mx-auto px-4 my-1 md:flex justify-end">
            <button
              onClick={() => router.push("/createPost")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition"
            >
              <span className="text-lg">＋</span> New Post
            </button>
          </div>

          {/* Profile Image */}
          <img
            className="w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer hover:opacity-90 transition"
            src={session.image || "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800"}
            alt="Profile"
            onClick={() => router.push("/profile")}
          />

          {/* Logout Button */}
          <button
            onClick={signOutAction}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
