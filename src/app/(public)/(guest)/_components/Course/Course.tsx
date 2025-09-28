"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useCourses } from "@/queries/useCourse";

export default function ScrollyCourses() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError } = useCourses();

  // Lấy 8 ảnh để match layout mẫu
  const images = useMemo(() => {
    const list = data?.payload?.result?.courses ?? [];
    return list
      .filter((c: any) => !!c?.thumbnail)
      .slice(0, 8)
      .map((c: any, i: number) => ({
        id: c.id,
        src: c.thumbnail,
        alt: c.title || `Course ${c.id}`,
        speed: [0.8, 0.9, 1.0, 1.1, 0.9, 1.2, 0.8, 1.0][i % 8] ?? 1.0,
      }));
  }, [data]);

  useEffect(() => {
    if (!rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const skewSetter = gsap.quickTo(
        ".scrolly-images img[data-speed]",
        "skewY",
        { duration: 0.2 }
      );
      const clamp = gsap.utils.clamp(-20, 20);

      ScrollTrigger.create({
        trigger: rootRef.current, // chỉ hoạt động trong section này
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          skewSetter(clamp(self.getVelocity() / -50));
        },
        onRefresh() {
          skewSetter(0);
        },
      });

      // Trả về 0 khi dừng cuộn
      let t: number | null = null;
      const onScroll = () => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(() => skewSetter(0), 120);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Các grid-area tương đương mẫu (8 item)
  const gridAreas = [
    "1/1/6/8",
    "3/12/8/20",
    "9/5/13/15",
    "14/1/18/8",
    "16/12/20/19",
    "20/2/25/9",
    "22/11/24/20",
    "26/5/30/15",
  ];

  return (
    <section
      ref={rootRef}
      className="scrolly-root w-full overflow-x-clip bg-[#eaf1fb] text-[#111] isolation-isolate z-0 py-24"
    >
      {/* 3 layer heading – đều trong flow, không absolute */}
      <div className="text-center">
        <h1 className="font-black text-white [--stroke:1.5px] [-webkit-text-stroke-width:var(--stroke)] [-webkit-text-stroke-color:white] text-[clamp(28px,8vw,96px)] leading-[1.05]">
          Scrolly Images
        </h1>
        <h1
          aria-hidden
          className="font-black text-transparent [-webkit-text-stroke-width:1.5px] [-webkit-text-stroke-color:white] text-[clamp(28px,8vw,96px)] leading-[1.05] -mt-2"
        >
          Scrolly Images
        </h1>
        <h1
          aria-hidden
          className="font-black text-[clamp(28px,8vw,96px)] leading-[1.05] mix-blend-screen text-[#804691] -mt-2"
        >
          Scrolly Images
        </h1>
      </div>

      <div className="scrolly-wrapper w-full">
        <div className="scrolly-content w-full">
          <div
            className="
              scrolly-images mx-auto
              grid w-full max-w-[1200px] min-h-[120vh]
              [grid-template-columns:repeat(20,2%)]
              [grid-template-rows:repeat(30,3%)]
              place-items-center
              gap-0
              px-2
            "
          >
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className={`relative w-full h-full rounded-xl bg-neutral-700
                    [grid-area:${gridAreas[i]}]`}
                />
              ))}

            {isError && (
              <div className="col-span-full text-center font-semibold text-red-600 p-4">
                Không tải được dữ liệu khóa học.
              </div>
            )}

            {!isLoading &&
              !isError &&
              images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative w-full h-full rounded-xl overflow-hidden [grid-area:${gridAreas[i]}]`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    data-speed={img.speed as any}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
