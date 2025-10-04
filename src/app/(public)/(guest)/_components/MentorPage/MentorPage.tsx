"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMentors } from "@/queries/useMentor";

gsap.registerPlugin(ScrollTrigger);

export default function MentorPage() {
  const { data, isLoading } = useMentors();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data?.payload?.result) return;

    const panels = gsap.utils.toArray<HTMLElement>(".panel");

    panels.forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,
        pinSpacing: false,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [data]);

  if (isLoading) return <div>Loading mentors...</div>;

  const mentors = data?.payload?.result;

  // Tạo danh sách màu nền khác nhau
  const colors = ["#ff6b6b", "#6c5ce7", "#00b894", "#fdcb6e", "#0984e3"];

  return (
    <div ref={containerRef}>
      {mentors?.map((mentor: any, i: number) => (
        <section
          key={mentor.id}
          className="panel flex flex-col justify-center items-center text-white h-f w-full"
          style={{
            backgroundColor: colors[i % colors.length],
          }}
        >
          <img
            src={mentor.avatar || "/default-avatar.png"}
            alt={mentor.name}
            className="w-32 h-32 rounded-full mb-6 shadow-lg border-4 border-white"
          />
          <h2 className="text-5xl font-bold mb-4">{mentor.name}</h2>
          <p className="text-lg max-w-2xl text-center">{mentor.bio}</p>
          <p className="mt-2 italic opacity-80">@{mentor.username}</p>
        </section>
      ))}
    </div>
  );
}
