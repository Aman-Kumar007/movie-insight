# 🎬 CineInsight — AI Movie Intelligence Platform

Enter any IMDb movie ID and unlock deep AI analysis, audience sentiment, cinematic intelligence, and now a section for user reviews.

---

## ✨ Features

- **Movie Details** — Poster, title, year, runtime, genre, cast, director, box office
- **IMDb Ratings** — Live rating display with visual score indicators
- **AI Sentiment Analysis** — Powered by Claude AI (Anthropic), analyzes audience reception
- **Sentiment Classification** — Positive / Mixed / Negative with animated score ring
- **Key Themes** — AI-extracted audience discussion topics
- **Animated UI** — Particle field, glassmorphism, animated score ring, smooth transitions
- **Responsive** — Fully mobile-friendly layout
- **Error Handling** — Graceful validation and API error messages
- **Smart Fallback** — Works without API keys using demo data + algorithmic sentiment

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/movie-insight-builder.git
cd movie-insight-builder
npm install
```

### 2. Configure API Keys

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Free OMDB key at: https://www.omdbapi.com/apikey.aspx
OMDB_API_KEY=your_omdb_key_here

# Anthropic key at: https://console.anthropic.com
ANTHROPIC_API_KEY=your_anthropic_key_here
```

> **Note:** The app works WITHOUT API keys using built-in mock data for `tt0133093` (The Matrix) and algorithmic sentiment analysis. Perfect for demo purposes.

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Deployment to Vercel (Recommended)

1. Push code to GitHub
2. Go to vercel.com and Import Project
3. Add environment variables in Vercel dashboard: `OMDB_API_KEY` and `ANTHROPIC_API_KEY`
4. Deploy — Vercel handles everything automatically

---

## 🧪 Testing

```bash
npm test
npm test -- --watch
npm test -- --coverage
```

Tests cover IMDb ID validation, sentiment score boundary logic, and input sanitization.

---

## 🏗️ Tech Stack and Rationale

**Next.js 14** — App Router gives us frontend + backend in one project. API routes handle OMDB and Claude API calls server-side (keys stay secure). Vercel deployment is one-click.

**TypeScript 5** — Type safety reduces runtime errors and improves developer experience with autocomplete.

**Tailwind CSS 3** — Utility-first approach means no separate CSS files. Rapid iteration without naming things.

**Claude AI (Anthropic)** — Best-in-class language understanding for nuanced sentiment analysis. Given movie metadata, it generates human-quality insights.

**OMDB API** — Free, reliable IMDb data source. IMDb itself doesn't have a public API.

**Jest 29** — Industry-standard testing for JavaScript/TypeScript projects.

**Native Canvas API** — Particle field animation with zero external dependencies.

---

## 📁 Project Structure

```
movie-insight-builder/
├── app/
│   ├── api/movie/route.ts        # Main API endpoint
│   ├── globals.css               # Global styles + animations
│   ├── layout.tsx                # Root layout + metadata
│   └── page.tsx                  # Home page with search UI
├── components/
│   ├── MovieResult.tsx           # Movie display with tabs
│   ├── SentimentPanel.tsx        # AI sentiment visualization
│   ├── LoadingOrb.tsx            # Animated loading state
│   └── ParticleField.tsx         # Canvas particle animation
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── validators.ts             # Input validation
│   ├── fetchMovie.ts             # OMDB API integration
│   └── sentiment.ts              # Claude AI sentiment module
├── __tests__/
│   ├── validators.test.ts        # Validation unit tests
│   └── sentiment.test.ts         # Sentiment logic tests
└── .env.example                  # Environment variable template
```

---

## 💡 Assumptions

1. **OMDB as data source** — IMDb doesn't have a public API; OMDB is the standard alternative.
2. **AI sentiment from metadata** — Rather than scraping reviews (fragile due to bot protection), Claude AI generates sentiment from quantitative data (rating, votes, awards, genre, plot). More reliable and higher quality.
3. **Server-side API calls** — All external calls happen in Next.js API routes to keep keys secure.
4. **1-hour caching** — Movie data cached via Next.js `revalidate` to avoid rate limits.
5. **Graceful degradation** — App fully works without API keys using mock data.

---

## 🎨 Design Philosophy

**Glassmorphism + Dark** — Semi-transparent cards with blur effects create cinematic depth.

**Living background** — Soft blob gradients + CSS grid overlay + particle field create atmosphere.

**Progressive disclosure** — Search, Loading, Results flow reveals information incrementally.

**Color semantics** — Green for positive, amber for mixed, red for negative sentiment.

---

## 🔒 Security

- API keys stored in environment variables only (never client-side)
- Input validation before any API call
- Error messages don't expose internal implementation details

---

Built for Brew Hiring Assignment — Full-Stack Developer Internship Round 1.
