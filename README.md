# MBA Daily News Digest

A modern, responsive frontend web application built as a daily news digest specifically tailored for MBA aspirants.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Language:** TypeScript

## Features
- **Clean & Minimal UI:** A dynamic and aesthetic design using standard modern UI patterns (glassmorphism, subtle shadows).
- **Category Filtering:** Easily filter news articles by categories (All, National, International, Commerce, Regional).
- **Timeline Filtering:** A scrollable date selector to view past news editions.
- **Mobile Responsive:** Looks and behaves like a sleek native app on mobile devices.

## How to Run

1. **Install Dependencies:**
   Make sure you are in the project root directory (`cat-news-digest`).
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   Run the following command to start the app locally:
   ```bash
   npm run dev
   ```

3. **View the Application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Project Structure
- `src/app/page.tsx`: The main dashboard page handling state and layout.
- `src/components/`: Reusable UI components (`Sidebar.tsx`, `DateSelector.tsx`, `NewsCard.tsx`).
- `src/data/mockData.ts`: The mock data layer providing sample news articles.
