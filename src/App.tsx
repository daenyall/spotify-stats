import { useEffect, useState, useRef } from 'react';
import { redirectToAuthCodeFlow, getAccessToken } from './auth';
import {
  fetchProfile,
  fetchTopTracks,
  fetchTopArtists,
  fetchRecentlyPlayed,
  fetchTopGenres,
} from './spotifyApi';
import Profile from './Profile';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';
import RecentlyPlayed from './RecentlyPlayed';
import TopGenres from './TopGenres';
import AudioVibe from './AudioVibe';
import TimeMachine from './TimeMachine';
import Discover from './Discover';
import PlaylistAnalyzer from './PlaylistAnalyzer';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

/* ── Nav Icon SVGs ─────────────────────────────────────────── */
function DashboardIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function VibeIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TimeIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DiscoverIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function PlaylistIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15V6" />
      <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M12 12H3" />
      <path d="M16 6H3" />
      <path d="M12 18H3" />
    </svg>
  );
}

/* ── Navbar ───────────────────────────────────────────────── */
function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Dashboard', Icon: DashboardIcon },
    { to: '/vibe', label: 'Twój Vibe', Icon: VibeIcon },
    { to: '/time-machine', label: 'Wehikuł Czasu', Icon: TimeIcon },
    { to: '/discover', label: 'Odkrywaj', Icon: DiscoverIcon },
    { to: '/playlists', label: 'Playlisty', Icon: PlaylistIcon },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled
          ? 'rgba(10, 10, 15, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#1DB954',
          boxShadow: '0 0 12px rgba(29,185,84,0.5)',
        }} />
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: '#f0f0f5',
          letterSpacing: '-0.02em',
        }}>
          Spotify<span style={{ color: '#1DB954' }}>Stats</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          const iconColor = isActive ? '#1DB954' : '#8888a0';
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: isActive ? '#1DB954' : '#8888a0',
                background: isActive ? 'rgba(29,185,84,0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(29,185,84,0.15)' : '1px solid transparent',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#f0f0f5';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#8888a0';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <link.Icon color={iconColor} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Login Screen ─────────────────────────────────────────── */
function LoginScreen() {
  // Equalizer bar heights for animation
  const bars = [60, 85, 45, 100, 70, 90, 55, 75, 95, 40, 80, 65];

  return (
    <div className="noise-bg" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(29,185,84,0.06) 0%, var(--bg-primary) 60%)',
    }}>
      {/* Animated grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
        mask: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        WebkitMask: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
      }} />

      {/* Central ambient glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,185,84,0.08) 0%, transparent 60%)',
        filter: 'blur(100px)',
        animation: 'pulse-glow 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Floating orbs */}
      {[
        { top: '15%', left: '10%', size: 6, delay: '0s', dur: '7s' },
        { top: '70%', left: '15%', size: 4, delay: '1s', dur: '9s' },
        { top: '25%', left: '80%', size: 5, delay: '2s', dur: '8s' },
        { top: '80%', left: '75%', size: 3, delay: '0.5s', dur: '6s' },
        { top: '45%', left: '5%', size: 3, delay: '3s', dur: '10s' },
        { top: '55%', left: '90%', size: 4, delay: '1.5s', dur: '7s' },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: orb.top,
          left: orb.left,
          width: `${orb.size}px`,
          height: `${orb.size}px`,
          borderRadius: '50%',
          background: '#1DB954',
          opacity: 0.3,
          animation: `float ${orb.dur} ease-in-out ${orb.delay} infinite`,
          pointerEvents: 'none',
          boxShadow: '0 0 10px rgba(29,185,84,0.5)',
        }} />
      ))}

      <div className="animate-fade-in-up" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2.5rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Equalizer visualization */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '4px',
          height: '60px',
        }}>
          {bars.map((maxH, i) => (
            <div key={i} style={{
              width: '4px',
              borderRadius: '2px',
              background: `linear-gradient(to top, #1DB954, rgba(29,185,84,0.3))`,
              animation: `equalizer-bar 1.${2 + i}s ease-in-out ${i * 0.08}s infinite alternate`,
              height: `${maxH * 0.6}%`,
              opacity: 0.6 + (i % 3) * 0.15,
            }} />
          ))}
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            Spotify<span className="gradient-text">Stats</span>
          </h1>
          <p style={{
            color: '#8888a0',
            fontSize: '1.05rem',
            fontWeight: 400,
            maxWidth: '400px',
            lineHeight: 1.6,
          }}>
            Twoje muzyczne statystyki w jednym miejscu.
          </p>
        </div>

        {/* Login button */}
        <button
          onClick={() => redirectToAuthCodeFlow(clientId)}
          style={{
            padding: '16px 52px',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#000',
            background: 'linear-gradient(135deg, #1DB954, #1ed760)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 40px rgba(29,185,84,0.25), 0 10px 40px rgba(0,0,0,0.2)',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 0 60px rgba(29,185,84,0.4), 0 20px 50px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(29,185,84,0.25), 0 10px 40px rgba(0,0,0,0.2)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Połącz ze Spotify
        </button>

        {/* Feature pills */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginTop: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {['Vibe', 'Wehikuł Czasu', 'Odkrywaj', 'Playlisty'].map((label, i) => (
            <span key={label} className="animate-fade-in" style={{
              color: '#55556a',
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '0.35rem 0.9rem',
              borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)',
              opacity: 0,
              animationDelay: `${0.4 + i * 0.1}s`,
              animationFillMode: 'forwards',
            }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main App ─────────────────────────────────────────────── */
function App() {
  const [token, setToken] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  const hasFetchedToken = useRef(false);

  const loadDashboardData = async (accessToken: string) => {
    try {
      const profileData = await fetchProfile(accessToken);
      setProfile(profileData);
      const tracksData = await fetchTopTracks(accessToken);
      setTracks(tracksData);
      const recentlyPlayedData = await fetchRecentlyPlayed(accessToken);
      setRecentlyPlayed(recentlyPlayedData);
      const artistsData = await fetchTopArtists(accessToken);
      setArtists(artistsData);
      const genresData = await fetchTopGenres(accessToken);
      setGenres(genresData);
      
      setToken(accessToken);
      localStorage.setItem('spotify_access_token', accessToken);
    } catch (err) {
      console.error("Błąd podczas ładowania danych z tokena:", err);
      // Jeśli token wygasł lub jest zły, usuwamy go i wymuszamy logowanie
      localStorage.removeItem('spotify_access_token');
      setToken(null);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !hasFetchedToken.current) {
      hasFetchedToken.current = true;
      getAccessToken(clientId, code)
        .then(async (accessToken) => {
          if (accessToken) {
            window.history.replaceState({}, document.title, "/");
            await loadDashboardData(accessToken);
          } else {
            console.error("Nie udało się pobrać tokenu.");
          }
        })
        .catch(err => console.error("Wystąpił błąd podczas autoryzacji:", err));
    } else if (!code && !token) {
      // Sprawdzamy czy mamy token w localStorage
      const savedToken = localStorage.getItem('spotify_access_token');
      if (savedToken) {
        loadDashboardData(savedToken);
      }
    }
  }, [token]);

  if (!token) {
    return <LoginScreen />;
  }

  return (
    <BrowserRouter>
      <div className="noise-bg" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />

        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
        }}>
          <Routes>
            <Route path="/" element={
              <Dashboard
                profile={profile}
                tracks={tracks}
                artists={artists}
                recentlyPlayed={recentlyPlayed}
                genres={genres}
              />
            } />
            <Route path="/vibe" element={<AudioVibe token={token} />} />
            <Route path="/time-machine" element={<TimeMachine token={token} />} />
            <Route path="/discover" element={<Discover token={token} />} />
            <Route path="/playlists" element={<PlaylistAnalyzer token={token} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#55556a',
          fontSize: '0.8rem',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          Zbudowane z 💚 przy pomocy Spotify API
        </footer>
      </div>
    </BrowserRouter>
  );
}

/* ── Dashboard (all sections) ─────────────────────────────── */
function Dashboard({ profile, tracks, artists, recentlyPlayed, genres }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <Profile profile={profile} />
      <TopTracks tracks={tracks} />
      <TopArtists artists={artists} />
      <RecentlyPlayed recentlyPlayed={recentlyPlayed} />
      <TopGenres genres={genres} />
    </div>
  );
}

export default App;