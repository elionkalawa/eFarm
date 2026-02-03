# eFarm Inputs

A modern agricultural input management system built with Next.js, Supabase, and custom JWT authentication.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom JWT (using `jose` and `bcryptjs`)
- **Styling**: Tailwind CSS
- **State Management**: React Query + React Context
- **Language**: TypeScript

## Features

- 🌾 Product catalogue with search and filtering
- 🛒 Order management system
- 👤 User authentication (signup, login, logout)
- 🔐 Role-based access control (Admin/User)
- 📊 Admin dashboard for managing products, orders, and users

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- A Supabase project

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd efarm
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_random_secret_at_least_32_characters_long
```

> **Important**: Generate a secure `JWT_SECRET` using:
>
> ```powershell
> [Convert]::ToBase64String((1..32 | % { [byte](Get-Random -Min 0 -Max 256) }))
> ```

### 4. Set up the database

Run the following SQL in your **Supabase SQL Editor** to create the required tables:

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table (stores users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock_quantity INT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES profiles(id),
  quantity INT NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication System

This project uses a **custom JWT authentication system** instead of Supabase Auth. This approach bypasses email verification requirements and gives full control over the auth flow.

### How it works:

1. **Sign Up**: User credentials are validated, password is hashed with `bcryptjs`, and stored in the `profiles` table.
2. **Login**: Password is verified against the stored hash. A JWT session token is created using `jose` and stored in an HTTP-only cookie.
3. **Session Management**: The middleware reads the session cookie on every request to protect routes and handle role-based redirects.
4. **Logout**: The session cookie is cleared.

### Key files:

| File                         | Purpose                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `lib/auth.ts`                | Core auth utilities (hash, compare, encrypt, decrypt, login, logout, getSession, getUser) |
| `app/auth/actions.ts`        | Server Actions for login, register, logout                                                |
| `middleware.ts`              | Route protection and role-based redirects                                                 |
| `providers/AuthProvider.tsx` | Client-side auth state management                                                         |
| `app/api/auth/me/route.ts`   | API endpoint to fetch current user session                                                |

---

## Making a User an Admin

By default, all new users are created with the `user` role. To promote a user to admin:

1. Open your **Supabase Dashboard** → **SQL Editor**
2. Run:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'user@example.com';
```

3. **Log out and log back in** to refresh the session with the new role.

---

## Project Structure

```
efarm/
├── app/
│   ├── (main)/          # User-facing pages (home, products, orders)
│   ├── admin/           # Admin dashboard pages
│   ├── api/             # API routes
│   ├── auth/            # Auth server actions
│   ├── login/           # Login page
│   └── register/        # Registration page
├── components/          # Reusable UI components
├── lib/
│   ├── auth.ts          # JWT authentication utilities
│   └── supabase/        # Supabase client configuration
├── providers/           # React context providers
├── types/               # TypeScript type definitions
└── supabase/
    └── schema.sql       # Database schema
```

---

## Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build for production     |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |

---

## Troubleshooting

### "Role shows as 'user' even after updating database"

The role is stored in the JWT session cookie. You must **log out and log back in** to get a new token with the updated role.

### "Cookies not being set in development"

Ensure `secure: false` is set for cookies in development (already configured in `lib/auth.ts`).

### "404 on /auth/sign-in"

The project uses `/login` and `/register` routes. If you see 404s, check that middleware redirects point to the correct paths.

---

## License

MIT
