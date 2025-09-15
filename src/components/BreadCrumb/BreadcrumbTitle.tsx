"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

type Props = {
  className?: string;
  override?: string;
};

export default function BreadcrumbTitle({ className, override }: Props) {
  const pathname = usePathname();

  if (override) {
    const [first, second] = override.split("//").map((s) => s.trim());
    return (
      <div className={clsx("flex items-center gap-3 text-white", className)}>
        <Link
          href="/"
          className="hover:underline underline-offset-4 decoration-2"
        >
          {first}
        </Link>
        <span className="text-orange-400 font-bold text-xl">//</span>
        <span className="capitalize">{second}</span>
      </div>
    );
  }

  let seg = "";
  if (pathname && pathname !== "/") {
    seg = pathname.split("/").filter(Boolean)[0] ?? "";
  }
  const pretty =
    seg.length > 0 ? seg?.charAt(0).toUpperCase() + seg.slice(1) : "";

  return (
    <div
      className={clsx(
        "flex items-center gap-3 text-[#0E2A46] text-xl font-semibold",
        className
      )}
    >
      <Link href="/">Home</Link>
      {pretty && (
        <>
          <span className="text-orange-400 font-bold text-xl"> // </span>
          <span className="capitalize">{pretty}</span>
        </>
      )}
    </div>
  );
}
