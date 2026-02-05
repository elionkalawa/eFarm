create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('admin', 'user')) default 'user',
  avatar_url text,
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

create table login_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  login_at timestamp default now()
);

create index idx_login_history_user_id on login_history(user_id);
create index idx_login_history_login_at on login_history(login_at);
