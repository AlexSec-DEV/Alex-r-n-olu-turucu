import { Category, AspectRatio } from './types';

export const CATEGORIES: Category[] = [
  {
    name: "İlaç ve Sağlık",
    image: "https://picsum.photos/seed/pharma/300/200",
    products: [
      "Modern İlaç Kutusu",
      "MK-677 İlaç Kutusu",
      "Vitamin Şişesi",
      "Protein Tozu Kutusu",
      "Şurup Şişesi",
      "Krem Tüpü",
      "Sprey Şişesi",
    ],
  },
  {
    name: "Kozmetik ve Bakım",
    image: "https://picsum.photos/seed/cosmetics/300/200",
    products: [
      "Lüks Parfüm Şişesi",
      "Cilt Serumu Şişesi",
      "Makyaj Paleti",
      "Ruj Ambalajı",
      "Şampuan Şişesi",
      "Yüz Kremi Kavanozu",
    ],
  },
  {
    name: "Yiyecek ve İçecek",
    image: "https://picsum.photos/seed/food/300/200",
    products: [
      "Kahve Bardağı",
      "Enerji İçeceği Kutusu",
      "Çikolata Ambalajı",
      "Cips Paketi",
      "Cam Su Şişesi",
      "Zeytinyağı Şişesi",
    ],
  },
  {
    name: "Teknoloji",
    image: "https://picsum.photos/seed/tech/300/200",
    products: [
      "Akıllı Telefon Kutusu",
      "Kulaklık Ambalajı",
      "Akıllı Saat Kutusu",
      "Laptop Sticker",
      "Powerbank",
    ],
  },
  {
    name: "Giyim ve Aksesuar",
    image: "https://picsum.photos/seed/clothing/300/200",
    products: [
      "T-shirt",
      "Hoodie",
      "Şapka",
      "Bez Çanta",
      "Sweatshirt",
      "Atkı",
    ],
  },
  {
    name: "Ayakkabı",
    image: "https://picsum.photos/seed/shoes/300/200",
    products: ["Spor Ayakkabı", "Klasik Ayakkabı", "Bot", "Sandalet", "Terlik"],
  },
];

export const ASPECT_RATIOS: AspectRatio[] = [
    { label: "Kare (1:1)", value: "1:1" },
    { label: "Geniş Ekran (16:9)", value: "16:9" },
    { label: "Dikey (9:16)", value: "9:16" },
    { label: "Manzara (4:3)", value: "4:3" },
    { label: "Portre (3:4)", value: "3:4" },
];
