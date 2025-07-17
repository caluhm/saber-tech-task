import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseRegex(
  val: string
): { pattern: string; flags: string } | null {
  const match = val.match(/^\/(.*)\/([a-z]*)$/i);
  if (!match) return null;
  return { pattern: match[1], flags: match[2] };
}
