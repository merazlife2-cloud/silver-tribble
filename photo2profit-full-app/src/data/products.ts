import type { Category, Condition } from "../lib/pricing";

export type Product = {
  id: string;
  title: string;
  price: number;
  category: Category;
  condition: Condition;
  image: string;
  description: string;
  status: "draft" | "active" | "sold";
};

export const sampleProducts: Product[] = [
  {
    id: "hoodie-001",
    title: "Vogue Graphic Cropped Knit Hoodie",
    price: 10,
    category: "women_sweater",
    condition: "good",
    image: "/images/hoodie.svg",
    status: "active",
    description: "Cream cropped knit hoodie with a fashion graphic front print, textured ribbed knit, long sleeves, and relaxed oversized fit. Good pre-owned condition.",
  },
  {
    id: "bag-001",
    title: "Neutral Everyday Shoulder Bag",
    price: 18,
    category: "bags",
    condition: "good",
    image: "/images/bag.svg",
    status: "active",
    description: "Simple neutral shoulder bag with everyday styling and clean resale appeal.",
  },
  {
    id: "jeans-001",
    title: "Classic Blue Straight Leg Jeans",
    price: 14,
    category: "jeans",
    condition: "great",
    image: "/images/jeans.svg",
    status: "draft",
    description: "Classic blue jeans with straight leg fit. Easy staple for online resale.",
  },
];
