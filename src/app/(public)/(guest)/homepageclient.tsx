"use client";

import dynamic from "next/dynamic";

const AnimatedSVGSection = dynamic(
  () => import("@/components/AnimatedSVGSection/AnimatedSVGSection"),
  { ssr: false }
);

const MentorSection = dynamic(
  () =>
    import(
      "@/app/manage/mentee/explore-mentor/_components/MentorSection/MentorSection"
    ),
  { ssr: false }
);

export default function HomepageClient({
  carouselItems,
}: {
  carouselItems: { id: number; image: string }[];
}) {
  return (
    <>
      <AnimatedSVGSection carouselItems={carouselItems} />
      <MentorSection />
    </>
  );
}
