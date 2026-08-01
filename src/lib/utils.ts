import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names, resolving conflicting Tailwind utilities so
 * the last one wins. Required by every shadcn component; not used elsewhere in
 * the codebase.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
