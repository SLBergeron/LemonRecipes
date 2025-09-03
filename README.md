# 🍋 LemonRecipes - React SPA

Modern React implementation of LemonRecipes meal planning app with shadcn/ui components and mobile-first design.

## ✨ Features

- **🎨 Modern Design**: shadcn/ui components with Apple-inspired aesthetics
- **📱 Mobile-First**: Touch-friendly grocery shopping with real-time checking
- **⚡ Fast Performance**: Vite + React + TypeScript for optimal speed
- **📦 Zero Maintenance**: Static deployment to GitHub Pages
- **🛒 Smart Grocery Lists**: Local storage persistence, copy to clipboard
- **📋 Interactive Meal Plans**: Expandable recipe cards, batch sauce tracking
- **⏰ Timeline Management**: Task tracking for meal prep workflow
- **🍎 Apple Integration**: JSON API for Shortcuts integration

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile Features

- **Touch Targets**: All interactive elements 44px+ for easy tapping
- **Swipe Navigation**: Smooth transitions between sections
- **Real-time Syncing**: Grocery list state persisted locally
- **Responsive Design**: Optimized layouts from 320px to desktop
- **Progressive Enhancement**: Works offline with cached data

## 🏗️ Architecture

```
src/
├── components/
│   ├── ui/          # shadcn/ui base components
│   ├── meal-plan/   # Meal plan specific components
│   └── grocery/     # Grocery shopping components
├── data/            # Static JSON meal plan data
├── lib/             # Utilities and data helpers
└── types/           # TypeScript type definitions
```

## 🎯 Design Principles

- **Personal Tool**: Built specifically for Simon & Léa's workflow
- **Minimal Maintenance**: Static build, no servers to manage
- **Mobile-Optimized**: Primary use case is grocery shopping on mobile
- **Apple Ecosystem**: Native integration with Shortcuts app

## 🚢 Deployment

Automatically deployed to GitHub Pages via GitHub Actions on every push to `main`.

**Live URL**: `https://slbergeron.github.io/LemonRecipes/`

## 🍎 Apple Shortcuts Integration

Access current week data via: `/api/current-week.json`

```json
{
  "week_id": "2025-09-03-flavor-forward",
  "active_items": [...],
  "budget_target": 165,
  "estimated_cost": 162,
  "theme": "Week of Sept 3-10 — Flavor-Forward Meal Prep Week"
}
```

## 📊 Tech Stack

- **Framework**: React 19 + TypeScript
- **UI Components**: shadcn/ui + Radix UI primitives  
- **Styling**: Tailwind CSS with CSS custom properties
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Actions → GitHub Pages
- **State Management**: React useState + localStorage

## 🔧 Development

The app uses modern React patterns with TypeScript for type safety. All components are built with accessibility in mind using Radix UI primitives.

### Key Components

- `MealCard`: Expandable meal plan cards with day letters
- `BatchSauceCard`: Recipe cards with colored themes
- `GroceryList`: Interactive shopping list with progress tracking
- `GroceryItemRow`: Touch-optimized list items with checking

### Data Flow

1. Static JSON meal plan data imported at build time
2. React components render from typed interfaces
3. User interactions stored in localStorage
4. Apple Shortcuts fetch data from public API endpoint

---

Built with ❤️ for personal use. Migrated from Jekyll to modern React for better mobile experience and zero maintenance overhead.