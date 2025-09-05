import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export function formatISOToLongDate(
  iso: string | Date,
  opts?: { noSpaceAfterComma?: boolean; timeZone?: string }
) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const s = d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: opts?.timeZone ?? "Asia/Ho_Chi_Minh",
  });
  return opts?.noSpaceAfterComma ? s.replace(", ", ",") : s;
}
