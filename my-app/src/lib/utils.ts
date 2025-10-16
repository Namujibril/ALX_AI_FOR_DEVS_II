import { clsx, type ClassValue } from "clsx"
/** Merge conditional class names with Tailwind-aware deduplication. */
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
