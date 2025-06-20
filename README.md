# Intelligent

Intelligent is a hyper-growth platform that provides deep analytics and creator tools to help you understand, grow, and monetise your community on **[Farcaster](https://www.farcaster.xyz/)** and other on-chain ecosystems.

The application is built with **Next.js 13 App Router**, **TypeScript**, **Tailwind CSS**, and integrates services such as **Privy**, **Firebase**, **Neynar**, and **Degen**.  
It ships with a rich dashboard, cast-analysis utilities, public partner dashboards, and first-class wallet/passkey authentication.

---

## ✨ Features

1. **Landing Page & Authentication**  
   • Magic-link, wallet, and **passkey** authentication powered by [Privy](https://privy.io).  
   • Animated marketing page built with **Framer-Motion**.

2. **Creator Dashboard** (`/dashboard`)  
   • Overview of followers gained, total casts, engagements, and platform mentions.  
   • Mini-charts for casts, reactions, followers (line / bar).  
   • Deep dives: **Top Casts**, **Top Mentions**, **Impact Followers/Unfollowers**.

3. **AlfaFrens Analytics** (`/dashboard/alfafrens`)  
   Provides community metrics for the **@AlfaFrens** channel.

4. **Apps Insights** (`/dashboard/apps`)  
   Ranking of Farcaster clients and applications.

5. **Cast Analyse** (`/dashboard/cast-analyse`)  
   Paste a Warpcast URL & get: cast details, likes, recasts, replies, and engagement breakdown (powered by **Neynar SDK**).

6. **Public Partner Dashboards**  
   Eg. **Based Games** available at `/public/based-games` for everyone – no login required.

7. **Utility API End-points**  
   • `GET /api/analyze?castUrl=` – Fetch cast & reactions.  
   • `GET /api/degen?fid=` – Retrieve last _degen.tips_ airdrop stats.  
   • `GET /warpcast/[fid]` – Redirect an **FID** to its Warpcast profile.

---

## 🗄️ Tech Stack

• **Next.js 13** (App Router) – React 18, SSR & ISR  
• **TypeScript**  
• **Tailwind CSS** & **PostCSS**  
• **Firebase / Firestore** – persistence & logging  
• **Privy** – auth, embedded wallets & passkeys  
• **Neynar API** – Farcaster data  
• **Degen API** – tip analytics  
• **Framer Motion**, **Recharts**, **ViEM**, **Axios**, **React-Hot-Toast** and more.

---

## 🚀 Quick Start

### 1. Clone & install

```bash
# clone
$ git clone https://github.com/your-org/intelligent.git
$ cd intelligent

# install deps
$ npm install          # or yarn / pnpm / bun
```

### 2. Configure environment variables

Create a `.env.local` file in the project root and add the following keys:

```bash
# runtime environment
aexport NEXT_PUBLIC_ENV=dev   # dev | prod

# Firebase
export NEXT_PUBLIC_FIREBASE_API_KEY=""
export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
export NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
export NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
export NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
export NEXT_PUBLIC_FIREBASE_APP_ID=""

# Privy
export NEXT_PUBLIC_DEV_PRIVY_APP_ID=""   # used when NEXT_PUBLIC_ENV=dev
export NEXT_PUBLIC_PRIVY_APP_ID=""        # used in production

# Neynar
export NEYNAR_API_KEY=""
```

> 💡 `NEXT_PUBLIC_` keys are exposed to the browser, so **never** put secrets there. Only use publicly safe tokens.

### 3. Run the dev server

```bash
$ npm run dev
```

App will be available at http://localhost:3000. The API routes are served from the same origin.

### 4. Production build

```bash
$ npm run build
$ npm start  # defaults to PORT=3000
```

---

## 🏗️ Project Structure (simplified)

```
app/              # Next.js route tree (pages, API, dashboards, etc.)
  ├─ api/         #   ├─ analyze/route.ts, degen/route.ts ...
  ├─ dashboard/   #   dashboards & views
  └─ warpcast/    #   fid redirect route
components/       # Re-usable UI & dashboard widgets
lib/              # Backend helpers, firebase & api endpoints map
public/           # Static assets (icons, images, avatars…)
utils/            # Shared utility functions & providers
```

A more exhaustive tree is available at the top of this README.

---

## 🌐 API Usage

### Analyse a cast

```bash
GET /api/analyze?castUrl=https://warpcast.com/~/cast/0x012345...
```

Response:

```json
{
  "cast": { "hash": "…", "author": { … }, "list_recasts": [ … ], "list_likes": [ … ] },
  "success": true,
  "error": false
}
```

### Fetch degen tip stats

```bash
GET /api/degen?fid=12345
```

### Warpcast profile redirect

```bash
GET /warpcast/12345 -> 302 https://warpcast.com/<username>
```

---

## 🧑‍💻 Development Scripts

| Command          | Description                   |
| ---------------- | ----------------------------- |
| `npm run dev`    | Runs next dev server with HMR |
| `npm run build`  | Builds a production bundle    |
| `npm run start`  | Starts the built app          |
| `npm run lint`   | ESLint codebase               |
| `npm run format` | (optional) Prettier format    |

---

## ☁️ Deployment

The repository is optimised for **Vercel**.  
Simply set the environment variables in your Vercel dashboard and click _Deploy_.

> The `NEXT_PUBLIC_ENV` variable should be set to `prod` on Vercel to ensure the correct API root (`https://api.intelligent.wtf`).

---

## 🤝 Contributing

1. Fork the repo & create your feature branch `git checkout -b feature/awesome`
2. Commit your changes `git commit -m "Add awesome feature"`
3. Push & open a PR `git push origin feature/awesome`

Please follow the existing coding style & make sure `npm run lint` passes before opening the pull-request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
