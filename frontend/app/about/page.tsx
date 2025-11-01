"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/app/component/Header"
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { authClient } from "@/lib/authClient";

export default function About() {
  const [counters, setCounters] = useState({
    projects: 0,
    problems: 0,
    hours: 0,
  });

  const counterRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);

  

  // Animate numbers when section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !started) {
          setStarted(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) observer.observe(counterRef.current);
    return () => {
      if (counterRef.current) observer.unobserve(counterRef.current);
    };
  }, [started]);

  const animateCounters = () => {
    const duration = 1500; // total animation time in ms
    const steps = 60; // number of frames
    const incrementProjects = 10 / steps; // target: 10 projects
    const incrementProblems = 1000 / steps; // target: 1000 problems
    const incrementHours = 1000 / steps; // target: 1000+ hours
    let current = 0;

    const timer = setInterval(() => {
      current++;
      setCounters({
        projects: Math.min(Math.round(current * incrementProjects), 10),
        problems: Math.min(Math.round(current * incrementProblems), 1000),
        hours: Math.min(Math.round(current * incrementHours), 1000),
      });

      if (current >= steps) clearInterval(timer);
    }, duration / steps);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header value={"about"} />

      {/* Hero Section */}
      <section className="py-16 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-center">
        <h1 className="text-5xl font-extrabold mb-4">About Me</h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-100">
          Hi, I'm <span className="font-semibold">Huzeyfa Suleyman</span> — a 
          <span className="font-semibold"> Full-Stack Developer</span> passionate about building 
          performant and scalable web applications.  
          I have solved <span className="font-semibold">1000+ problems</span> on Codeforces and LeetCode.  
          My goal is to create meaningful digital experiences that connect users with technology seamlessly.
        </p>
      </section>

      {/* Bio Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/image/owner.jpg"
          alt="Huzeyfa Suleyman"
          className="rounded-2xl shadow-md object-cover w-[90%] h-[400px]"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Who I Am</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            I'm a self-driven Full-Stack Developer with expertise in <span className="font-semibold">Next.js, Node.js, React, and MongoDB</span>.  
            I focus on building intuitive, scalable, and dynamic web applications.  
            Beyond development, I love solving algorithmic challenges — having completed over 1000 problems on platforms like Codeforces and LeetCode.
          </p>
          <p className="text-gray-600 leading-relaxed">
            My approach combines clean code, user-friendly interfaces, and optimal performance to deliver real-world solutions.  
            When I'm not coding, I explore UI animations, open-source projects, and performance optimization techniques.
          </p>
        </div>
      </section>

      {/* Animated Counters */}
      <section
        ref={counterRef}
        className="bg-white py-16 flex flex-wrap justify-center items-center text-center gap-10"
      >
        <div className="w-52">
          <h3 className="text-5xl font-bold text-blue-600">
            {counters.projects}+
          </h3>
          <p className="text-gray-600 mt-2 text-lg">Projects Completed</p>
        </div>
        <div className="w-52">
          <h3 className="text-5xl font-bold text-blue-600">
            {counters.problems.toLocaleString()}+
          </h3>
          <p className="text-gray-600 mt-2 text-lg">Problems Solved</p>
        </div>
        <div className="w-52">
          <h3 className="text-5xl font-bold text-blue-600">
            {counters.hours}+
          </h3>
          <p className="text-gray-600 mt-2 text-lg">Hours of Practice</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Let's Connect
        </h2>
        <p className="text-gray-600 mb-6">
          I’m open to freelance work, collaborations, or simply having a chat about web development.
        </p>
        <div className="flex justify-center gap-6 text-2xl">
          <a
            href="https://github.com/shuzeyfa"
            target="_blank"
            className="hover:text-blue-600 transition-colors"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/huzeyfa-suleyman"
            target="_blank"
            className="hover:text-blue-600 transition-colors"
          >
            <FaLinkedin />
          </a>
          <a
            href="shuzeyfa4@gmail.com"
            className="hover:text-blue-600 transition-colors"
          >
            <FaEnvelope />
          </a>
        </div>
      </section>
    </main>
  );
}
