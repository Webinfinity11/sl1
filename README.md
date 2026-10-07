# SMARTLINE (sl1.ge)

Next.js 16 ონლაინ მაღაზია და ადმინ პანელი (`/admin`). ბაზა: Neon Postgres (Drizzle), სურათები: Vercel Blob.

```bash
npm install
vercel env pull .env.local          # DATABASE_URL, BLOB_READ_WRITE_TOKEN, AUTH_SECRET
npm run dev
```

- `npx drizzle-kit push` — სქემის განახლება ბაზაში
- `npx tsx scripts/create-admin.ts <email> <password>` — ადმინის შექმნა / პაროლის აღდგენა
- `npx tsx scripts/import-wp.ts` — ერთჯერადი იმპორტი WooCommerce-ის ექსპორტიდან (`wp-export/`, git-ში არ არის)
