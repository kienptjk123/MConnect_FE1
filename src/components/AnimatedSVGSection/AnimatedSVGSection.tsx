"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext1,
  CarouselPrevious1,
} from "@/components/ui/carousel";

interface CarouselItem {
  id: number;
  image: string;
}

interface AnimatedSVGSectionProps {
  carouselItems: CarouselItem[];
}

export default function AnimatedSVGSection({
  carouselItems,
}: AnimatedSVGSectionProps) {
  const svgRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const { scrollYProgress } = useScroll({
    target: svgRef,
    offset: ["start center", "end start"],
  });

  const reversedProgress = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  } as const;

  const scaleIn = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  const stepContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  } as const;

  return (
    <>
      <div
        ref={svgRef}
        className="flex justify-center mt-8 relative w-full min-h-screen"
      >
        {/* SVG line chính giữa */}
        <motion.svg
          width="1329"
          height="3521"
          viewBox="0 0 1329 3521"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 max-w-full h-auto"
        >
          {/* Đường line nền màu xanh */}
          <path
            d="M669.5 3510L669.5 2922.84C669.5 2812.36 794.684 2722.79 905.666 2722.79L1112.2 2722.79C1223.19 2722.79 1313.16 2633.22 1313.16 2522.74L1313.16 2254.61C1313.16 2144.12 1223.19 2054.55 1112.2 2054.55L211.955 2054.55C100.973 2054.55 10.9999 1964.98 10.9999 1854.5L10.9999 1552.35C10.9999 1441.86 100.973 1352.29 211.955 1352.29L1117.04 1352.29C1228.03 1352.29 1318 1262.72 1318 1152.24L1318 1006.13L1318 860.015C1318 749.531 1228.03 659.962 1117.04 659.962L839.912 659.962C728.93 659.962 668.5 570.392 668.5 459.908L668.5 11.0007"
            stroke="#60A6EB"
            strokeWidth="21"
            strokeMiterlimit="10"
            strokeLinecap="round"
            fill="none"
          />

          {/* Đường line màu xám animate */}
          <motion.path
            ref={pathRef}
            d="M669.5 3510L669.5 2922.84C669.5 2812.36 794.684 2722.79 905.666 2722.79L1112.2 2722.79C1223.19 2722.79 1313.16 2633.22 1313.16 2522.74L1313.16 2254.61C1313.16 2144.12 1223.19 2054.55 1112.2 2054.55L211.955 2054.55C100.973 2054.55 10.9999 1964.98 10.9999 1854.5L10.9999 1552.35C10.9999 1441.86 100.973 1352.29 211.955 1352.29L1117.04 1352.29C1228.03 1352.29 1318 1262.72 1318 1152.24L1318 1006.13L1318 860.015C1318 749.531 1228.03 659.962 1117.04 659.962L839.912 659.962C728.93 659.962 668.5 570.392 668.5 459.908L668.5 11.0007"
            stroke="#E5E7EB"
            strokeWidth="21"
            strokeMiterlimit="10"
            fill="none"
            strokeDasharray={pathLength}
            strokeDashoffset={useTransform(
              reversedProgress,
              [0, 1],
              [pathLength, 0]
            )}
            initial={{ strokeDashoffset: pathLength }}
          />
        </motion.svg>

        <motion.div
          className="absolute top-10 left-10 w-[656px] h-[443px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInLeft}
        >
          <Image
            src="/images/sandbox1.png"
            alt="Hero image"
            className="object-contain"
            fill
            priority
          />
        </motion.div>

        {/* Hình ảnh bên phải 1 */}
        <motion.div
          className="absolute top-10 right-10 w-[656px] h-[443px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInRight}
        >
          <Image
            src="/images/sandboxlogo.png"
            alt="Hero image"
            className="object-contain"
            fill
            priority
          />
        </motion.div>

        {/* Hình ảnh bên trái 2 */}
        <motion.div
          className="absolute top-200 left-10 w-[656px] h-[443px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInLeft}
          transition={{ delay: 0.2 }}
        >
          <Image
            src="/images/sandbox2.png"
            alt="Hero image"
            className="object-contain"
            fill
            priority
          />
        </motion.div>

        {/* Content bên phải 2 - STEP 1 */}
        <motion.div
          className="absolute top-200 right-25 w-[656px] h-[443px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="flex justify-center mb-8 text-center"
            variants={scaleIn}
          >
            <div className="bg-[#527EDE] text-white px-8 py-3 rounded-full text-3xl font-bold shadow-lg">
              STEP 1
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold text-[#063FA8] mb-8 text-center leading-tight"
            variants={fadeInUp}
          >
            Match With The Right Mentor
          </motion.h1>

          <motion.p
            className="text-lg text-[#326EBD] text-center leading-relaxed max-w-xl mx-auto"
            variants={fadeInUp}
          >
            Start by exploring available mentors — from designers and developers
            to business strategists and content creators. Each mentor shares
            their profile, working style, project needs, and expectations. Find
            someone who aligns with your values, goals, and desired skills.
          </motion.p>
        </motion.div>

        {/* Content bên trái 3 - STEP 2 */}
        <motion.div
          className="absolute top-370 left-40 w-[500px] h-[443px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="flex justify-center mb-8 text-center"
            variants={scaleIn}
          >
            <div className="bg-[#527EDE] text-white px-8 py-3 rounded-full text-3xl font-bold shadow-lg">
              STEP 2
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold text-[#063FA8] mb-8 text-center leading-tight"
            variants={fadeInUp}
          >
            Sandbox & Trial Collaboration
          </motion.h1>

          <motion.p
            className="text-lg text-[#326EBD] text-center leading-relaxed max-w-xl mx-auto"
            variants={fadeInUp}
          >
            Once you apply, you'll enter a sandbox environment. Think of it as a
            "first impression" phase — short, skill-based tasks created by
            mentors to test how you think, solve problems, and communicate. It's
            not just about being the best — it's about being the right fit.
          </motion.p>
        </motion.div>

        {/* Hình ảnh bên phải 3 */}
        <motion.div
          className="absolute top-370 right-20 w-[656px] h-[443px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInRight}
          transition={{ delay: 0.5 }}
        >
          <Image
            src="/images/sandbox3.png"
            alt="Hero image"
            className="object-contain"
            fill
            priority
          />
        </motion.div>

        {/* Hình ảnh bên trái 4 */}
        <motion.div
          className="absolute top-550 left-10 w-[656px] h-[443px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInLeft}
          transition={{ delay: 0.6 }}
        >
          <Image
            src="/images/sandbox4.png"
            alt="Hero image"
            className="object-contain"
            fill
            priority
          />
        </motion.div>

        {/* Content bên phải 4 - STEP 3 */}
        <motion.div
          className="absolute top-550 right-25 w-[656px] h-[443px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="flex justify-center mb-8 text-center"
            variants={scaleIn}
          >
            <div className="bg-[#527EDE] text-white px-8 py-3 rounded-full text-3xl font-bold shadow-lg">
              STEP 3
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold text-[#063FA8] mb-8 text-center leading-tight"
            variants={fadeInUp}
          >
            Build as a Team
          </motion.h1>

          <motion.p
            className="text-lg text-[#326EBD] text-center leading-relaxed max-w-md mx-auto"
            variants={fadeInUp}
          >
            Mentees who pass the sandbox phase will be selected to join a 5–6
            person team. You'll be assigned roles, deadlines, and deliverables.
            Mentors will guide, review, and challenge you as if you're on an
            actual team. By the end, you don't just gain experience — you gain
            confidence, portfolio pieces, and real working habits.
          </motion.p>
        </motion.div>

        {/* Hình ảnh carousel bên trái 5 */}
        <motion.div
          className="absolute top-720 left-10 w-[609px] h-[500px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInLeft}
          transition={{ delay: 0.8 }}
        >
          <Carousel
            className="w-full max-w-6xl mx-auto"
            orientation="vertical"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="h-[500px]">
              {carouselItems.map((item, index) => (
                <CarouselItem key={item.id} className="basis-full">
                  <motion.div
                    className="flex items-center gap-12 h-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <div className="flex-1">
                      <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt="carousel image"
                          className="object-contain"
                          fill
                          priority
                        />
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious1 className="-top-70 left-1/2 transform -translate-x-1/2 bg-[#E5F8FF] hover:bg-blue-100 shadow-2xl text-[#89DEFF] hover:text-[#89DEFF] py-60 px-6" />
            <CarouselNext1 className="-bottom-70 left-1/2 transform -translate-x-1/2 bg-[#E5F8FF] hover:bg-blue-100 shadow-2xl text-[#89DEFF] hover:text-[#89DEFF] py-60 px-6" />
          </Carousel>
        </motion.div>

        {/* Content bên phải 5 - Step List */}
        <motion.div
          className="absolute top-720 right-15 w-[600px] h-[443px] z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInRight}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-lg"
            variants={scaleIn}
          >
            <motion.div className="space-y-6" variants={stepContainer}>
              {/* Step 1 */}
              <motion.div
                className="flex items-start gap-4"
                variants={fadeInUp}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-blue-600 font-semibold text-lg leading-relaxed">
                    <span className="font-bold">
                      Explore Mentors & Projects
                    </span>{" "}
                    <span className="text-blue-500 italic font-normal">
                      — Discover open opportunities in tech, design, marketing,
                      data science, and more.
                    </span>
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="flex items-start gap-4"
                variants={fadeInUp}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-blue-600 font-semibold text-lg leading-relaxed">
                    <span className="font-bold">Apply & Get Evaluated</span>{" "}
                    <span className="text-blue-500 italic font-normal">
                      — Submit your interest, show your portfolio or resume, and
                      express your goals.
                    </span>
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="flex items-start gap-4"
                variants={fadeInUp}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-blue-600 font-semibold text-lg leading-relaxed">
                    <span className="font-bold">Join Sandbox Tasks</span>{" "}
                    <span className="text-blue-500 italic font-normal">
                      — Complete a mini-challenge or prototype task — like a
                      real-world job test.
                    </span>
                  </p>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                className="flex items-start gap-4"
                variants={fadeInUp}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-blue-600 font-semibold text-lg leading-relaxed">
                    <span className="font-bold">Get Selected & Assigned</span>{" "}
                    <span className="text-blue-500 italic font-normal">
                      — Mentors handpick mentees based on team fit and growth
                      potential.
                    </span>
                  </p>
                </div>
              </motion.div>

              {/* Step 5 */}
              <motion.div
                className="flex items-start gap-4"
                variants={fadeInUp}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-blue-600 font-semibold text-lg leading-relaxed">
                    <span className="font-bold">
                      Collaborate, Learn, and Grow
                    </span>{" "}
                    <span className="text-blue-500 italic font-normal">
                      — Deliver real results, get coached, and watch your skills
                      — and confidence — soar.
                    </span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Final image  */}
      <div className="flex justify-center mt-4 mb-4">
        <motion.div
          className="relative w-[900px] h-[700px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
        >
          <Image
            src="/images/sandboxlast.png"
            alt="Final sandbox image"
            className="object-contain"
            fill
            priority
          />
        </motion.div>
      </div>
    </>
  );
}
