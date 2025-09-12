"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
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
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  } as const;

  const buttonContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.6 },
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

  return (
    <div className="py-4">
      <div className="relative w-[1500px] h-[700px]">
        <Image
          src="/images/herosection1.png"
          alt="Hero image"
          className="object-contain"
          fill
          priority
        />

        {/* Main content */}
        <motion.div
          className="absolute top-50 left-30"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className=" flex flex-col justify-center items-center text-center">
            <motion.h1
              className="text-5xl dark:text-white text-white  font-semibold leading-tight mb-6"
              variants={fadeInUp}
            >
              Achieving Your Dreams
              <br />
              <span className="ml-6 dark:text-white text-white">
                Through Mconnect
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-200 mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              Join our mentorship platform to accelerate your career development
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={buttonContainer}
            >
              <motion.div variants={fadeInUp}>
                <Button className="bg-[#527EDE] hover:bg-blue-700 dark:text-white px-12 py-6 rounded-full text-lg font-semibold">
                  Find A Mentor
                </Button>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Button
                  variant="outline"
                  className="dark:border-2 dark:border-[#60A6EB] dark:text-black  dark:bg-white dark:hover:bg-gray-300 px-8 py-6 rounded-full text-lg font-semibold"
                >
                  Become A Mentor
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Why Mentorship Matters section */}
        <motion.div
          className="absolute bottom-26 right-26 max-w-[14rem]"
          initial="hidden"
          animate="visible"
          variants={fadeInRight}
          transition={{ delay: 0.8 }}
        >
          <div className="text-white text-2xl font-semibold mb-2 flex items-center text-center">
            <p>Why Mentorship Matters</p>
            <ChevronRight className="h-8 w-8" />
          </div>
        </motion.div>

        {/* Bottom section with avatars */}
        <motion.div
          className="absolute bottom-10 right-23 max-w-[23rem]"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-start gap-2">
            <motion.div className="flex -space-x-6" variants={fadeInLeft}>
              <motion.div
                className="w-14 h-14 bg-blue-500 rounded-full border-2 border-white"
                variants={scaleIn}
                transition={{ delay: 1.2 }}
              />
              <motion.div
                className="w-14 h-14 bg-green-500 rounded-full border-2 border-white"
                variants={scaleIn}
                transition={{ delay: 1.4 }}
              />
              <motion.div
                className="w-14 h-14 bg-purple-500 rounded-full border-2 border-white"
                variants={scaleIn}
                transition={{ delay: 1.6 }}
              />
            </motion.div>
            <motion.p
              className="text-white text-lg font-extralight text-center"
              variants={fadeInRight}
              transition={{ delay: 1.3 }}
            >
              Real Guidance. Real Feedback. Real Growth
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
