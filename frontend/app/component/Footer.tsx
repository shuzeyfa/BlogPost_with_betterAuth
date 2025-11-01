"use client";


import { FaGithub, FaLinkedin } from "react-icons/fa";



export default function Footer() {
  return (
    <footer className="mt-16 border-t py-12 border-t-gray-400 bg-white text-gray-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 text-sm">
            <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
                BlogCraft
            </h3>
            <p className="text-gray-500">
                A Modern Platform for sharing knowledge, insights, and stories.
                Join our community of writers and readers.
            </p>
            <div className="mt-3 flex justify-center gap-4 text-2xl">
                <a
                href="https://github.com/shuzeyfa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition"
                >
                <FaGithub />
                </a>
                <a
                href="https://www.linkedin.com/in/huzeyfa-suleyman"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition"
                >
                <FaLinkedin />
                </a>
            </div>
            </div>

            <div>
            <h4 className="font-semibold text-gray-800 mb-3">Categories</h4>
            <ul className="space-y-1 text-gray-500">
                <li>Technology</li>
                <li>Design</li>
                <li>Leadership</li>
                <li>Cloud</li>
                <li>UI/UX</li>
            </ul>
            </div>

            <div>
            <h4 className="font-semibold text-gray-800 mb-3">Company</h4>
            <ul className="space-y-1 text-gray-500">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
            </ul>
            </div>
        </div>
        <div className="text-center text-gray-400 mt-8 text-sm">
            © {new Date().getFullYear()} BlogCraft. All rights reserved.
        </div>
    </footer>
  );
}