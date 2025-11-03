export interface Category {
  name: string;
  image: string;
  products: string[];
}

export interface AspectRatio {
  label: string;
  value: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
}
