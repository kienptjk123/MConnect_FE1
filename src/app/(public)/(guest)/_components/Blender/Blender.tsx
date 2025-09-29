"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Blender() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!containerRef.current || !overlayTextRef.current || !iframeRef.current)
      return;

    const container = containerRef.current;
    const overlayText = overlayTextRef.current;
    const iframe = iframeRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      iframe,
      {
        scale: 0.8,
        opacity: 0,
        rotationY: -15,
      },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 1.5,
        ease: "power3.out",
      }
    ).fromTo(
      overlayText.children,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      },
      "-=1"
    );

    gsap.to(overlayText, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (!overlayTextRef.current) return;

    const textElements =
      overlayTextRef.current.querySelectorAll(".animate-text");

    textElements.forEach((el) => {
      const chars = el.textContent?.split("") || [];
      el.innerHTML = chars
        .map((c) => `<span class="char">${c}</span>`)
        .join("");

      gsap.from(el.querySelectorAll(".char"), {
        yPercent: () => gsap.utils.random(-100, 100),
        rotation: () => gsap.utils.random(-30, 30),
        autoAlpha: 0,
        ease: "back.out",
        stagger: {
          amount: 0.8,
          from: "random",
        },
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
      });
    });
  }, []);

  return (
    <div className="flex justify-between items-center h-[700px] w-full">
      <div
        ref={overlayTextRef}
        className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 z-10"
      >
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold drop-shadow-2xl block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Connect
            <span className="animate-text block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Mentors & Mentees
            </span>
          </h2>

          <p className="animate-text text-xl text-black drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
            A modern learning platform where you are guided by experienced
            mentors, while exploring an interactive 3D sandbox to practice
            real-world skills in a dynamic and engaging way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              className="bg-blue-500 hover:bg-blue-400 dark:text-white rounded-3xl"
              size="lg"
            >
              {" "}
              Join Now
            </Button>

            <Link
              href="http://sandbox-mconnect.s3-website-ap-southeast-1.amazonaws.com"
              target="_blank"
              className="bg-gray-300 hover:bg-gray-400 dark:text-white rounded-3xl px-4 py-2"
            >
              View Sandbox Demo
            </Link>
          </div>
        </div>
      </div>

      <div className="w-1/2 h-[700px]">
        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden rounded-3xl"
        >
          <iframe
            ref={iframeRef}
            title="Noodle Bar - Interactive 3D Learning Experience"
            src="https://sketchfab.com/models/92bcda53d5eb4eef8cd842a1b65ff205/embed?autospin=0.5&autostart=1&preload=1&transparent=1&ui_hint=0&scrollwheel=0"
            className="w-full h-full border-0 rounded-3xl"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            style={{
              filter: "brightness(1) contrast(1.05)",
              transform: "perspective(1000px)",
            }}
          />

          <div className="absolute top-0 left-0 w-full h-14 bg-white z-20"></div>

          <div className="absolute bottom-0 left-0 w-full h-20 bg-white z-20"></div>
        </div>{" "}
      </div>
    </div>
  );
}
