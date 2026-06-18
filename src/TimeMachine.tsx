import { useState, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { fetchTopTracks, fetchTopArtists } from './spotifyApi';

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

interface TimeMachineProps {
  token: string;
}

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'short_term', label: 'Ostatnie 4 tygodnie' },
  { value: 'medium_term', label: '6 miesięcy' },
  { value: 'long_term', label: 'Od początku' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

/* ── Spinner sub-component ─────────────────────────────────── */
function Spinner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem 0',
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: '3px solid rgba(255,255,255,0.06)',
        borderTopColor: '#1DB954',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Styles ────────────────────────────────────────────────── */
const pillContainerStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '2rem',
};

const activePillStyle: CSSProperties = {
  background: 'linear-gradient(135deg, #1DB954, #1ed760)',
  color: '#000',
  fontWeight: 700,
  border: '1px solid transparent',
  borderRadius: '50px',
  padding: '10px 24px',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  boxShadow: '0 4px 18px rgba(29, 185, 84, 0.25)',
  transform: 'scale(1.04)',
};

const inactivePillStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  color: '#8888a0',
  fontWeight: 500,
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '50px',
  padding: '10px 24px',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  boxShadow: 'none',
  transform: 'scale(1)',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
};

const cardStyle: CSSProperties = {
  padding: '1.5rem',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  backdropFilter: 'blur(12px)',
  minHeight: '300px',
};

const listItemBase: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '10px',
  transition: 'background 0.25s ease',
  cursor: 'default',
};

const rankStyle: CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#55556a',
  width: '28px',
  textAlign: 'center',
  flexShrink: 0,
};

const columnTitleStyle: CSSProperties = {
  fontSize: '1.05rem',
  fontWeight: 700,
  color: '#f0f0f5',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

/* ── Main Component ────────────────────────────────────────── */
export default function TimeMachine({ token }: TimeMachineProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [t, a] = await Promise.all([
        fetchTopTracks(token, timeRange, 20),
        fetchTopArtists(token, timeRange, 20),
      ]);
      setTracks(t);
      setArtists(a);
    } catch (err) {
      console.error('[TimeMachine] fetch error:', err);
      setTracks([]);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  }, [token, timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── Render helpers ───────────────────────────────────────── */

  const renderTrackItem = (track: any, index: number) => {
    const delay = `${Math.min(index * 0.03, 0.5)}s`;
    const isMedal = index < 3;
    const albumImg = track.album?.images?.[1]?.url || track.album?.images?.[0]?.url;

    return (
      <div
        key={track.id}
        className="animate-fade-in-up"
        style={{
          ...listItemBase,
          opacity: 0,
          animationDelay: delay,
          animationFillMode: 'forwards',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(29,185,84,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {/* Rank */}
        <span style={{
          ...rankStyle,
          color: isMedal ? '#1DB954' : '#55556a',
          fontSize: isMedal ? '1.1rem' : '0.85rem',
        }}>
          {isMedal ? MEDALS[index] : `#${index + 1}`}
        </span>

        {/* Album cover */}
        {albumImg ? (
          <img
            src={albumImg}
            alt=""
            style={{
              width: 44,
              height: 44,
              borderRadius: '8px',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ) : (
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1a1a25, #222230)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0,
          }}>🎵</div>
        )}

        {/* Text info */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontWeight: 600,
            fontSize: '0.88rem',
            color: '#f0f0f5',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
          }} title={track.name}>
            {track.name}
          </p>
          <p style={{
            fontSize: '0.78rem',
            color: '#8888a0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
            marginTop: '2px',
          }} title={track.artists?.map((a: any) => a.name).join(', ')}>
            {track.artists?.map((a: any) => a.name).join(', ')}
          </p>
        </div>
      </div>
    );
  };

  const renderArtistItem = (artist: any, index: number) => {
    const delay = `${Math.min(index * 0.03, 0.5)}s`;
    const isMedal = index < 3;
    const artistImg = artist.images?.[1]?.url || artist.images?.[0]?.url;
    const topGenre = artist.genres?.[0] || '—';

    return (
      <div
        key={artist.id}
        className="animate-fade-in-up"
        style={{
          ...listItemBase,
          opacity: 0,
          animationDelay: delay,
          animationFillMode: 'forwards',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(29,185,84,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {/* Rank */}
        <span style={{
          ...rankStyle,
          color: isMedal ? '#1DB954' : '#55556a',
          fontSize: isMedal ? '1.1rem' : '0.85rem',
        }}>
          {isMedal ? MEDALS[index] : `#${index + 1}`}
        </span>

        {/* Artist photo */}
        {artistImg ? (
          <img
            src={artistImg}
            alt=""
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ) : (
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a25, #222230)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0,
          }}>🎤</div>
        )}

        {/* Text info */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontWeight: 600,
            fontSize: '0.88rem',
            color: '#f0f0f5',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
          }} title={artist.name}>
            {artist.name}
          </p>
          <p style={{
            fontSize: '0.78rem',
            color: '#8888a0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
            marginTop: '2px',
            textTransform: 'capitalize',
          }} title={topGenre}>
            {topGenre}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
      {/* ── Section Title ──────────────────────────────────────── */}
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        Wehikuł <span className="accent">Czasu</span>
      </h2>
      <p style={{
        textAlign: 'center',
        color: '#8888a0',
        fontSize: '0.92rem',
        marginBottom: '2rem',
        marginTop: 0,
      }}>
        Podróżuj w czasie przez swoje muzyczne gusta
      </p>

      {/* ── Segmented Control (Pills) ──────────────────────────── */}
      <div style={pillContainerStyle}>
        {TIME_OPTIONS.map((opt) => {
          const isActive = timeRange === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setTimeRange(opt.value)}
              style={isActive ? activePillStyle : inactivePillStyle}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#f0f0f5';
                  e.currentTarget.style.borderColor = 'rgba(29,185,84,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#8888a0';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* ── Two-Column Grid ────────────────────────────────────── */}
      <div style={gridStyle}>
        {/* Left column — Top Piosenki */}
        <div className="glass-card" style={cardStyle}>
          <div style={columnTitleStyle}>
            <span style={{ fontSize: '1.2rem' }}>🎵</span>
            <span>Top Piosenki</span>
          </div>
          {loading ? (
            <Spinner />
          ) : tracks.length === 0 ? (
            <p style={{ color: '#55556a', textAlign: 'center', padding: '2rem 0', margin: 0 }}>
              Brak danych do wyświetlenia
            </p>
          ) : (
            <div key={timeRange} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {tracks.map((track, i) => renderTrackItem(track, i))}
            </div>
          )}
        </div>

        {/* Right column — Top Artyści */}
        <div className="glass-card" style={cardStyle}>
          <div style={columnTitleStyle}>
            <span style={{ fontSize: '1.2rem' }}>🎤</span>
            <span>Top Artyści</span>
          </div>
          {loading ? (
            <Spinner />
          ) : artists.length === 0 ? (
            <p style={{ color: '#55556a', textAlign: 'center', padding: '2rem 0', margin: 0 }}>
              Brak danych do wyświetlenia
            </p>
          ) : (
            <div key={timeRange} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {artists.map((artist, i) => renderArtistItem(artist, i))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
