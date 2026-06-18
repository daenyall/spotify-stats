import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchTopArtists, fetchRecommendations } from './spotifyApi';

interface DiscoverProps {
  token: string;
}

/* ── Keyframe injection (runs once) ─────────────────────────── */
const STYLE_ID = 'discover-keyframes';
function injectKeyframes() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes eq-bar-1 {
      0%, 100% { height: 4px; }
      50% { height: 16px; }
    }
    @keyframes eq-bar-2 {
      0%, 100% { height: 8px; }
      50% { height: 20px; }
    }
    @keyframes eq-bar-3 {
      0%, 100% { height: 6px; }
      50% { height: 14px; }
    }
    @keyframes progress-pulse {
      0% { opacity: 0.8; }
      50% { opacity: 1; }
      100% { opacity: 0.8; }
    }
    @keyframes spin-refresh {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

/* ── Mini Equalizer ─────────────────────────────────────────── */
function Equalizer() {
  const barBase: React.CSSProperties = {
    width: '3px',
    borderRadius: '2px',
    background: '#1DB954',
    transformOrigin: 'bottom',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px' }}>
      <div style={{ ...barBase, animation: 'eq-bar-1 0.6s ease-in-out infinite' }} />
      <div style={{ ...barBase, animation: 'eq-bar-2 0.5s ease-in-out infinite 0.15s' }} />
      <div style={{ ...barBase, animation: 'eq-bar-3 0.7s ease-in-out infinite 0.3s' }} />
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function Discover({ token }: DiscoverProps) {
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0-100
  const [noPreviewTooltip, setNoPreviewTooltip] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Inject keyframes on mount */
  useEffect(() => {
    injectKeyframes();
  }, []);

  /* ── Fetch helpers ──────────────────────────────────────── */
  const loadRecommendations = useCallback(
    async (artists: any[], shuffle = false) => {
      let seeds = artists;
      if (shuffle && artists.length > 3) {
        const shuffled = [...artists].sort(() => Math.random() - 0.5);
        const count = 3 + Math.floor(Math.random() * Math.min(3, shuffled.length - 2));
        seeds = shuffled.slice(0, Math.min(count, 5));
      }
      const ids = seeds.map((a: any) => a.id).slice(0, 5);
      let recs = await fetchRecommendations(token, ids, [], 20);
      
      if (!recs || recs.length === 0) {
        // MOCK DATA: Pool of tracks with valid images
        const mockPool = [
          { id: 'mock-1', name: 'Neon Nights (Mock)', artists: [{ name: 'Synthwave Dreams' }], album: { images: [{ url: 'https://picsum.photos/seed/neon/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { id: 'mock-2', name: 'Midnight Drive (Mock)', artists: [{ name: 'Lofi Chill' }], album: { images: [{ url: 'https://picsum.photos/seed/midnight/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
          { id: 'mock-3', name: 'Cyberpunk City (Mock)', artists: [{ name: 'Futurists' }], album: { images: [{ url: 'https://picsum.photos/seed/cyber/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
          { id: 'mock-4', name: 'Brak podglądu (Mock)', artists: [{ name: 'Test Tooltipa' }], album: { images: [{ url: 'https://picsum.photos/seed/nopreview/150' }] }, preview_url: null },
          { id: 'mock-5', name: 'Ocean Waves (Mock)', artists: [{ name: 'Ambient Sounds' }], album: { images: [{ url: 'https://picsum.photos/seed/ocean/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
          { id: 'mock-6', name: 'Summer Breeze (Mock)', artists: [{ name: 'Indie Vibes' }], album: { images: [{ url: 'https://picsum.photos/seed/summer/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
          { id: 'mock-7', name: 'Retro Groove (Mock)', artists: [{ name: 'Funk Masters' }], album: { images: [{ url: 'https://picsum.photos/seed/retro/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
          { id: 'mock-8', name: 'Mountain Peak (Mock)', artists: [{ name: 'Acoustic Folk' }], album: { images: [{ url: 'https://picsum.photos/seed/mountain/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
          { id: 'mock-9', name: 'Deep Space (Mock)', artists: [{ name: 'Electronic' }], album: { images: [{ url: 'https://picsum.photos/seed/space/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
          { id: 'mock-10', name: 'City Lights (Mock)', artists: [{ name: 'Jazz Hop' }], album: { images: [{ url: 'https://picsum.photos/seed/city/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
          { id: 'mock-11', name: 'Desert Wind (Mock)', artists: [{ name: 'Desert Blues' }], album: { images: [{ url: 'https://picsum.photos/seed/desert/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
          { id: 'mock-12', name: 'Rainy Day (Mock)', artists: [{ name: 'Sad Boyz' }], album: { images: [{ url: 'https://picsum.photos/seed/rainy/150' }] }, preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
        ];
        
        // Shuffle the pool and pick a random subset to simulate "Refresh"
        const shuffledPool = [...mockPool].sort(() => Math.random() - 0.5);
        recs = shuffledPool.slice(0, 8); // Display 8 cards
      }
      
      return recs;
    },
    [token],
  );

  /* Initial load */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const artists = await fetchTopArtists(token, 'medium_term', 5);
      if (cancelled) return;
      setTopArtists(artists);
      const recs = await loadRecommendations(artists);
      if (cancelled) return;
      setTracks(recs);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, loadRecommendations]);

  /* ── Audio cleanup ──────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, []);

  /* ── Play / Pause handler ───────────────────────────────── */
  const handlePlayPause = useCallback(
    (track: any) => {
      // If no preview, show tooltip
      if (!track.preview_url) {
        setNoPreviewTooltip(track.id);
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = setTimeout(() => setNoPreviewTooltip(null), 2200);
        return;
      }

      // If clicking the same track, toggle
      if (currentlyPlayingId === track.id) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setCurrentlyPlayingId(null);
        setProgress(0);
        return;
      }

      // Play a new track
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(track.preview_url);
      audioRef.current = audio;

      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      });

      audio.addEventListener('ended', () => {
        setCurrentlyPlayingId(null);
        setProgress(0);
      });

      audio.addEventListener('error', () => {
        setCurrentlyPlayingId(null);
        setProgress(0);
        setNoPreviewTooltip(track.id);
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = setTimeout(() => setNoPreviewTooltip(null), 2200);
      });

      audio.play().then(() => {
        setCurrentlyPlayingId(track.id);
        setProgress(0);
      }).catch(() => {
        setCurrentlyPlayingId(null);
        setProgress(0);
      });
    },
    [currentlyPlayingId],
  );

  /* ── Refresh handler ────────────────────────────────────── */
  const handleRefresh = useCallback(async () => {
    if (refreshing || topArtists.length === 0) return;
    setRefreshing(true);
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentlyPlayingId(null);
    setProgress(0);

    const recs = await loadRecommendations(topArtists, true);
    setTracks(recs);
    setRefreshing(false);
  }, [refreshing, topArtists, loadRecommendations]);

  /* ── Loading spinner ────────────────────────────────────── */
  if (loading) {
    return (
      <div className="animate-fade-in" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(255,255,255,0.06)',
            borderTopColor: '#1DB954',
            borderRadius: '50%',
            animation: 'spin-refresh 0.8s linear infinite',
            margin: '0 auto 1.5rem',
          }}
        />
        <p style={{ color: '#8888a0', fontSize: '0.95rem' }}>Szukam nowej muzyki dla Ciebie…</p>
      </div>
    );
  }

  /* ── Fallback — no recommendations (403 / empty) ────────── */
  if (tracks.length === 0) {
    return (
      <div className="animate-fade-in-up" style={{ padding: '2rem 0' }}>
        <h3 className="section-title">
          <span className="accent">Odkrywaj</span> nową muzykę
        </h3>
        <div
          className="glass-card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(29,185,84,0.06) 0%, rgba(26,26,37,0.8) 100%)',
            border: '1px solid rgba(29,185,84,0.15)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1 }}>🔮</div>
          <h4
            style={{
              color: '#f0f0f5',
              fontWeight: 700,
              fontSize: '1.15rem',
              marginBottom: '0.75rem',
            }}
          >
            Rekomendacje wymagają rozszerzonego dostępu do API Spotify.
          </h4>
          <p
            style={{
              color: '#8888a0',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '1.25rem',
            }}
          >
            Sprawdź swój status na{' '}
            <a
              href="https://developer.spotify.com"
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#1DB954',
                textDecoration: 'none',
                fontWeight: 600,
                borderBottom: '1px solid rgba(29,185,84,0.3)',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = '#1ed760')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderBottomColor = 'rgba(29,185,84,0.3)')
              }
            >
              developer.spotify.com
            </a>
          </p>
          <div
            style={{
              display: 'inline-block',
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              background: 'rgba(29,185,84,0.1)',
              color: '#1DB954',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            Extended Quota Mode wymagany
          </div>
        </div>
      </div>
    );
  }

  /* ── Main grid ──────────────────────────────────────────── */
  return (
    <div className="animate-fade-in-up" style={{ padding: '2rem 0' }}>
      {/* Header */}
      <h3 className="section-title">
        <span className="accent">Odkrywaj</span> nową muzykę
      </h3>
      <p
        style={{
          color: '#8888a0',
          fontSize: '0.9rem',
          marginTop: '-0.75rem',
          marginBottom: '2rem',
        }}
      >
        Rekomendacje oparte na Twoich ulubionych artystach
      </p>

      {/* Track grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {tracks.map((track, index) => {
          const isPlaying = currentlyPlayingId === track.id;
          const showTooltip = noPreviewTooltip === track.id;
          const isHovered = hoveredCard === track.id;
          const albumImg = track.album?.images?.[1]?.url || track.album?.images?.[0]?.url;

          return (
            <div
              key={track.id}
              className="glass-card animate-fade-in-up"
              style={{
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                opacity: 0,
                animationDelay: `${Math.min(index * 0.04, 0.8)}s`,
                animationFillMode: 'forwards',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                borderColor: isPlaying
                  ? 'rgba(29,185,84,0.35)'
                  : isHovered
                    ? 'rgba(29,185,84,0.15)'
                    : 'rgba(255,255,255,0.06)',
                boxShadow: isPlaying
                  ? '0 0 20px rgba(29,185,84,0.08), inset 0 0 30px rgba(29,185,84,0.03)'
                  : 'none',
              }}
              onMouseEnter={() => setHoveredCard(track.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Album cover */}
              {albumImg ? (
                <img
                  src={albumImg}
                  alt="Okładka"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    flexShrink: 0,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1a1a25, #222230)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    flexShrink: 0,
                  }}
                >
                  🎵
                </div>
              )}

              {/* Track info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: isPlaying ? '#1ed760' : '#f0f0f5',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'color 0.25s ease',
                    margin: 0,
                  }}
                  title={track.name}
                >
                  {track.name}
                </p>
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: '#8888a0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '3px',
                    margin: 0,
                    marginBlockStart: '3px',
                  }}
                  title={track.artists?.map((a: any) => a.name).join(', ')}
                >
                  {track.artists?.map((a: any) => a.name).join(', ')}
                </p>
              </div>

              {/* Play / Pause button */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => handlePlayPause(track)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: isPlaying
                      ? 'linear-gradient(135deg, #1DB954, #1ed760)'
                      : 'rgba(29,185,84,0.15)',
                    color: isPlaying ? '#000' : '#1DB954',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    transition: 'all 0.25s ease',
                    boxShadow: isPlaying ? '0 2px 16px rgba(29,185,84,0.35)' : 'none',
                    transform: isHovered && !isPlaying ? 'scale(1.08)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isPlaying) {
                      e.currentTarget.style.background = 'rgba(29,185,84,0.25)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPlaying) {
                      e.currentTarget.style.background = 'rgba(29,185,84,0.15)';
                    }
                  }}
                  aria-label={isPlaying ? 'Pauza' : 'Odtwórz'}
                >
                  {isPlaying ? <Equalizer /> : '▶'}
                </button>

                {/* No-preview tooltip */}
                {showTooltip && (
                  <div
                    className="animate-fade-in"
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 8px)',
                      right: 0,
                      background: 'rgba(26,26,37,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.75rem',
                      color: '#8888a0',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      zIndex: 10,
                    }}
                  >
                    Podgląd niedostępny
                  </div>
                )}
              </div>

              {/* Progress bar (bottom of card) */}
              {isPlaying && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'rgba(29,185,84,0.12)',
                    overflow: 'hidden',
                    borderRadius: '0 0 14px 14px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #1DB954, #1ed760)',
                      borderRadius: '0 0 14px 14px',
                      transition: 'width 0.25s linear',
                      boxShadow: '0 0 8px rgba(29,185,84,0.4)',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Refresh button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.75rem',
            borderRadius: '999px',
            border: '1.5px solid rgba(29,185,84,0.5)',
            background: hoveredBtn && !refreshing
              ? 'linear-gradient(135deg, rgba(29,185,84,0.2), rgba(29,185,84,0.1))'
              : 'transparent',
            color: refreshing ? '#55556a' : '#1DB954',
            fontSize: '0.9rem',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.01em',
            opacity: refreshing ? 0.6 : 1,
          }}
          onMouseEnter={() => setHoveredBtn(true)}
          onMouseLeave={() => setHoveredBtn(false)}
        >
          <span
            style={{
              display: 'inline-block',
              animation: refreshing ? 'spin-refresh 0.8s linear infinite' : 'none',
              fontSize: '1rem',
            }}
          >
            🔄
          </span>
          {refreshing ? 'Ładowanie…' : 'Odśwież rekomendacje'}
        </button>
      </div>
    </div>
  );
}
