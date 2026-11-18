/**
 * Dữ liệu sản phẩm cố định (sinh tất định từ seed) — dùng cho demo render & memoization.
 */

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  score: number;
  stock: number;
}

const CATEGORIES = ["Laptop", "Điện thoại", "Máy tính bảng", "Phụ kiện", "Màn hình"];
const BRANDS = ["Asus", "Dell", "Lenovo", "HP", "Apple", "Samsung", "Xiaomi", "Acer", "LG", "Sony"];
const WORDS = ["Pro", "Air", "Ultra", "Lite", "Max", "Plus", "Mini", "Neo", "Edge", "Go"];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(2024);

export const PRODUCTS: Product[] = Array.from({ length: 5000 }, (_, i) => {
  const brand = BRANDS[Math.floor(rand() * BRANDS.length)];
  const word = WORDS[Math.floor(rand() * WORDS.length)];
  const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
  return {
    id: i + 1,
    sku: "SP-" + String(i + 1).padStart(4, "0"),
    name: `${brand} ${word} ${100 + Math.floor(rand() * 900)}`,
    category,
    price: Math.round((2 + rand() * 60) * 500) * 1000,
    score: Math.floor(rand() * 100),
    stock: Math.floor(rand() * 500),
  };
});
