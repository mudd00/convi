# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

편의점 종합 솔루션 v2.0 - Commercial-grade convenience store management platform with three-role architecture (Customer, Store Owner, Headquarters).

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, Tailwind CSS 3.4, Supabase (PostgreSQL 15), Zustand, TanStack Query, Toss Payments, Naver Geocoding API

## Commands

```bash
# Development
npm run dev              # Start dev server (port 5173)
npm run dev:full         # Run server + dev concurrently

# Build & Production
npm run build            # Production build
npm run preview          # Preview production build
npm run production       # Build and serve production

# Code Quality
npm run lint             # Run ESLint
```

## Architecture

### Three-Role System
- **Customer (고객):** Browse stores by GPS, order products, pay via Toss Payments, track orders, manage points
- **Store Owner (점주):** Manage orders/inventory, request stock from HQ, view sales analytics, handle refunds
- **Headquarters (본사):** Monitor all stores, manage product master data, approve supply requests, company-wide analytics

### Source Structure
- `src/components/{role}/` - UI components organized by role (customer, store, hq, common)
- `src/pages/{role}/` - Page components as route targets
- `src/stores/` - Zustand state management (authStore, cartStore, orderStore, pointStore)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Library configs (supabase client, payment, geocoding)
- `src/types/common.ts` - Shared TypeScript types
- `src/utils/` - Utility functions

### State Management Pattern
- Global state: Zustand stores in `src/stores/`
- Server state: TanStack Query for API caching
- Local state: React useState for component-specific
- Auth: Supabase Auth with JWT, managed via `authStore.ts`, `ProtectedRoute` guards pages by role

### Database
17 PostgreSQL tables with RLS (Row Level Security). Key tables: `profiles`, `stores`, `products`, `store_products`, `orders`, `order_items`, `supply_requests`, `inventory_transactions`

## Key Patterns

- All components are functional with TypeScript typing
- Tailwind CSS utility classes exclusively (custom colors: primary/secondary/accent)
- Custom hooks extract reusable logic (useConfirm, useToast, useInventoryAnalytics)
- Real-time features use Supabase Realtime subscriptions (need cleanup in useEffect)
- Environment variables prefixed with `VITE_` for frontend access

## Environment Variables

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_TOSS_CLIENT_KEY=test_ck_xxx
VITE_NAVER_CLIENT_ID=xxx
VITE_NAVER_CLIENT_SECRET=xxx
```

## Production Server

Express server (`server.js`) serves static files, provides geocoding API proxy, and handles SPA fallback routing. Runs on port 3001 locally or 10000 in production (Render.com).
