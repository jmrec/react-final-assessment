import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function orderStatusBadgeClass(status?: string) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
    case "READY":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
    case "PENDING":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400"
  }
}
