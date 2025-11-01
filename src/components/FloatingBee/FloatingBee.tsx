"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingBee() {
  return (
    <motion.div
      drag
      dragConstraints={{ top: -600, bottom: 600, left: -600, right: 600 }}
      whileHover={{ scale: 1.05 }}
      animate={{
        y: [0, -20, 0, 20, 0],
        x: [0, 10, 0, -10, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="fixed -bottom-10 w-64 h-44 right-0 flex items-center gap-4 cursor-grab active:cursor-grabbing z-[100]"
    >
      <div className="relative w-64 h-44">
        <Image
          src="/images/AIBee.png"
          alt="AI Bee"
          className="object-contain select-none pointer-events-none"
          fill
          priority
          fetchPriority="high"
        />
      </div>
    </motion.div>
  );
}
