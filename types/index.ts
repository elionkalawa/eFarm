export interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "user";
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "user";
}
