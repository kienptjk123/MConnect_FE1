"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-3xl"
    >
      <iframe
        ref={iframeRef}
        title="Noodle Bar - Interactive 3D Learning Experience"
        src="https://sketchfab.com/models/92bcda53d5eb4eef8cd842a1b65ff205/embed?autospin=0.7&autostart=1&preload=1&transparent=1&ui_hint=0&camera=0&scrollwheel=0"
        className="w-full h-full border-0 rounded-3xl"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        style={{
          filter: "brightness(1) contrast(1.05)",
          transform: "perspective(1000px)",
        }}
      />

      {/* Overlay che header */}
      <div className="absolute top-0 left-0 w-full h-14 bg-[#E3EFFB] z-20"></div>

      {/* Overlay che footer */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-[#E3EFFB] z-20"></div>
    </div>
  );
}
