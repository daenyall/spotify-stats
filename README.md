# Spotify Stats

A web application that lets users explore their personal Spotify listening statistics through a simple, interactive interface.

Built with **React, TypeScript, and Vite**, the application integrates with the Spotify Web API to retrieve and visualize listening data.

## Features

- **Spotify OAuth** — Sign in securely with a Spotify account.
- **User Profile** — View Spotify account information.
- **Top Artists & Tracks** — Discover your most-listened-to artists and songs.
- **Top Genres** — Explore your music preferences through genre statistics.
- **Recently Played** — View your recent listening history.
- **Data Visualization** — Explore listening statistics using Recharts.

## Tech Stack

- **React 19** — User interface
- **TypeScript** — Type-safe development
- **Vite** — Development and build tooling
- **Spotify Web API** — Listening data and authentication
- **React Router** — Client-side navigation
- **Recharts** — Data visualization
- **Tailwind CSS / Bootstrap** — Styling

## Getting Started

### Prerequisites

Before running the application, make sure you have:

- Node.js and npm installed.
- A Spotify account.
- An application registered in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/daenyall/spotify-stats.git
cd spotify-stats
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file using the provided example:

```bash
cp .env.example .env
```

Set your Spotify application's Client ID:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

In your Spotify Developer Dashboard, configure the redirect URI used by the application:

```text
http://localhost:5173/
```

Your Spotify application may need to be configured to allow your account to access it during development.

**4. Start the development server**

```bash
npm run dev
```

Open the local URL displayed in the terminal (typically `http://localhost:5173/`).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project Purpose

Spotify Stats was created to practice building applications with React and TypeScript, integrating external APIs, implementing OAuth authentication, and presenting data through interactive visualizations.

The project demonstrates practical frontend development and API integration skills.
