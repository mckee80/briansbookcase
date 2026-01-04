export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre: string;
  publicationYear: number;
  pageCount: number;
  downloadUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export const mockEbooks: Ebook[] = [
  {
    id: "1",
    title: "The Silent Echo",
    author: "Sarah Mitchell",
    description: "A powerful story about finding hope in the darkest moments. Follow Emma's journey as she discovers the strength within herself to overcome life's challenges.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    genre: "Contemporary Fiction",
    publicationYear: 2023,
    pageCount: 342,
    downloadUrl: "/downloads/silent-echo.epub"
  },
  {
    id: "2",
    title: "Whispers of Tomorrow",
    author: "David Chen",
    description: "An inspiring tale of resilience and human connection. A must-read for anyone seeking light in difficult times.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    genre: "Drama",
    publicationYear: 2022,
    pageCount: 298,
    downloadUrl: "/downloads/whispers-tomorrow.epub"
  },
  {
    id: "3",
    title: "Beyond the Horizon",
    author: "Maria Rodriguez",
    description: "A beautifully written narrative about healing, friendship, and the courage to start anew.",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    genre: "Literary Fiction",
    publicationYear: 2023,
    pageCount: 411,
    downloadUrl: "/downloads/beyond-horizon.epub"
  },
  {
    id: "4",
    title: "The Lighthouse Keeper's Song",
    author: "James Patterson",
    description: "A heartwarming story of redemption and the power of community support in times of crisis.",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    genre: "Fiction",
    publicationYear: 2021,
    pageCount: 367,
    downloadUrl: "/downloads/lighthouse-song.epub"
  }
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "BriansBookcase Tote Bag",
    description: "Eco-friendly canvas tote bag featuring our logo. Perfect for carrying books and supporting our cause.",
    price: 15.99,
    image: "/images/products/tote-bag.jpg",
    category: "Merchandise",
    inStock: true
  },
  {
    id: "2",
    name: "Hope & Healing Bookmark Set",
    description: "Set of 5 beautifully designed bookmarks with inspirational quotes about hope and resilience.",
    price: 8.99,
    image: "/images/products/bookmarks.jpg",
    category: "Merchandise",
    inStock: true
  },
  {
    id: "3",
    name: "Literary Supporter Pin",
    description: "Enamel pin showing your support for suicide prevention through literature.",
    price: 6.99,
    image: "/images/products/pin.jpg",
    category: "Merchandise",
    inStock: true
  },
  {
    id: "4",
    name: "Reading for Hope Mug",
    description: "Ceramic mug with uplifting message. Perfect for your morning coffee while reading.",
    price: 12.99,
    image: "/images/products/mug.jpg",
    category: "Merchandise",
    inStock: true
  },
  {
    id: "5",
    name: "Annual Membership - Silver",
    description: "One year of unlimited ebook downloads and exclusive member content.",
    price: 25.00,
    image: "/images/products/membership-silver.jpg",
    category: "Membership",
    inStock: true
  },
  {
    id: "6",
    name: "Annual Membership - Gold",
    description: "One year of unlimited downloads, exclusive content, and early access to new releases.",
    price: 50.00,
    image: "/images/products/membership-gold.jpg",
    category: "Membership",
    inStock: true
  }
];
