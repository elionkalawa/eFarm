create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('admin', 'user')) default 'user',
  created_at timestamp default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  price numeric not null,
  stock_quantity int not null,
  image_url text,
  is_active boolean default true,
  created_at timestamp default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  user_id uuid references profiles(id),
  quantity int not null,
  total_price numeric not null,
  status text default 'pending',
  created_at timestamp default now()
);
