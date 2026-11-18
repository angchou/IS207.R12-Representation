import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Hàm cn() chuẩn công nghiệp (Shadcn UI pattern):
 * 1. clsx(): Xử lý điều kiện logic (boolean, object, array) để nối chuỗi class.
 * 2. twMerge(): Giải quyết triệt để xung đột utility class của Tailwind
 *    (ví dụ: twMerge("px-4 py-2 bg-blue-600", "px-8 bg-emerald-600") => "py-2 px-8 bg-emerald-600")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
