# 🏠 StaySphere Frontend

Modern, responsive Airbnb-inspired single page application (SPA) built with **React 19**, **Vite**, **Tailwind CSS v4**, **Lucide Icons**, and **Leaflet Maps**.

---

> 🚀 **Live Demo:** [stayspherefrontend.vercel.app](https://stayspherefrontend.vercel.app/)  
> 🌐 **Backend API Repository:** [staySphere_backend](https://github.com/aadiityaasingh/staySphere_backend)

---

## 🛠 Tech Stack

- **Framework**: React 19 (SPA)
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Maps**: Leaflet + OpenStreetMap
- **State Management**: React Context (`AuthContext` with global auth & wishlist)
- **HTTP Client**: Axios with `withCredentials: true`
- **Feedback & Notifications**: React Hot Toast

---

## ✨ Features

- **Dynamic Homepage**: Airbnb 3-segment search pill, category filter scrollbar, and live pricing cards.
- **Leaflet Map Explorer**: Floating toggle between grid view and interactive world map with custom HTML price pills.
- **5-Photo Gallery**: Classic 1-large + 4-small photo layout with fullscreen lightbox viewer and image navigation.
- **Reservation Engine**: Real-time date selection, guest counter, transparent fee breakdown, and checkout flow.
- **Wishlist**: One-click heart toggle with live global sync.
- **Host Dashboard**: Analytics KPI cards (Revenue, Bookings, Active Listings) and property management tabs.
- **Review Breakdown**: 5 category sub-ratings (Cleanliness, Accuracy, Communication, Location, Value).

---

## ⚙️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (optional in dev - proxies to localhost:8080)
cp .env.example .env

# 3. Start development server
npm run dev
# Frontend runs at http://localhost:5173

# 4. Build for production
npm run build
```

---

## 🚀 Deployment (Vercel)

1. Connect your repository to Vercel.
2. Set Framework Preset: `Vite`.
3. Set Build Command: `npm run build` and Output Directory: `dist`.
4. Add Environment Variable:
   - `VITE_API_URL`: Your live backend API base URL (e.g. `https://staysphere-api.onrender.com/api/v1`).
