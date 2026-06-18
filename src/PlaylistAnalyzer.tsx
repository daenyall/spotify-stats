import { useState, useEffect, useCallback, useRef } from 'react';
import type { CSSProperties } from 'react';
import { fetchUserPlaylists, fetchPlaylistTracks } from './spotifyApi';

interface PlaylistAnalyzerProps {
  token: string;
}

interface PlaylistStats {
  totalDuration: number;
  trackCount: number;
  topArtist: { name: string; count: number } | null;
  top5Artists: { name: string; count: number }[];
}

function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

function computeStats(items: any[]): PlaylistStats {
  // Filter out null/undefined tracks (local files or unavailable)
  const validTracks = items.filter((item) => item?.track);

  const totalDuration = validTracks.reduce(
    (sum, item) => sum + (item.track.duration_ms || 0),
    0
  );

  const artistCounts: Record<string, number> = {};
  validTracks.forEach((item) => {
    (item.track.artists || []).forEach((artist: any) => {
      if (artist?.name) {
        artistCounts[artist.name] = (artistCounts[artist.name] || 0) + 1;
      }
    });
  });

  const sorted = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1]);

  const topArtist = sorted.length > 0
    ? { name: sorted[0][0], count: sorted[0][1] }
    : null;

  const top5Artists = sorted.slice(0, 5).map(([name, count]) => ({ name, count }));

  return {
    totalDuration,
    trackCount: validTracks.length,
    topArtist,
    top5Artists,
  };
}

/* ── Spinner ──────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255,255,255,0.06)',
        borderTopColor: '#1DB954',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Stat Card ────────────────────────────────────────── */
function StatCard({ icon, label, value, delay = 0 }: {
  icon: string;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{
        padding: '1.25rem 1.5rem',
        flex: '1 1 180px',
        minWidth: '160px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        opacity: 0,
        animationDelay: `${delay}s`,
        animationFillMode: 'forwards',
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: 500,
        color: '#8888a0',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '1.4rem',
        fontWeight: 800,
        color: '#f0f0f5',
        lineHeight: 1.2,
      }}>
        {value}
      </span>
    </div>
  );
}

/* ── Detail Panel ─────────────────────────────────────── */
function DetailPanel({
  playlist,
  tracks,
  loading,
  onClose,
}: {
  playlist: any;
  tracks: any[] | null;
  loading: boolean;
  onClose: () => void;
}) {
  const stats = tracks ? computeStats(tracks) : null;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const coverUrl = playlist.images?.[0]?.url;

  const panelStyle: CSSProperties = {
    position: 'relative',
    marginBottom: '2rem',
    padding: '2rem',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,37,0.95), rgba(18,18,26,0.98))',
    border: '1px solid rgba(29,185,84,0.2)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(29,185,84,0.05)',
    animation: 'detailSlideIn 0.4s ease-out forwards',
    overflow: 'hidden',
  };

  return (
    <div ref={panelRef} style={panelStyle}>
      <style>{`
        @keyframes detailSlideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#8888a0',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          zIndex: 2,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.color = '#f0f0f5';
          e.currentTarget.style.borderColor = 'rgba(29,185,84,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.color = '#8888a0';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        ✕
      </button>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        marginBottom: '1.75rem',
      }}>
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={playlist.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          />
        ) : (
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1DB954, #0a7e35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}>
            🎵
          </div>
        )}
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#f0f0f5',
          }}>
            {playlist.name}
          </h3>
          <p style={{
            margin: '0.25rem 0 0',
            fontSize: '0.85rem',
            color: '#8888a0',
          }}>
            Statystyki playlisty
          </p>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : stats ? (
        <>
          {/* Stats row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}>
            <StatCard icon="⏱️" label="Łączny czas trwania" value={formatDuration(stats.totalDuration)} delay={0.05} />
            <StatCard icon="🎵" label="Liczba utworów" value={String(stats.trackCount)} delay={0.1} />
            <StatCard
              icon="👑"
              label="Najczęstszy artysta"
              value={stats.topArtist ? `${stats.topArtist.name} (${stats.topArtist.count})` : '—'}
              delay={0.15}
            />
          </div>

          {/* Top 5 artists */}
          {stats.top5Artists.length > 0 && (
            <div
              className="animate-fade-in-up"
              style={{
                opacity: 0,
                animationDelay: '0.25s',
                animationFillMode: 'forwards',
              }}
            >
              <h4 style={{
                margin: '0 0 0.75rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#8888a0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                🏆 Top 5 artystów
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                {stats.top5Artists.map((artist, i) => (
                  <div
                    key={artist.name}
                    className="animate-fade-in-up"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 1rem',
                      borderRadius: '10px',
                      background: i === 0
                        ? 'linear-gradient(135deg, rgba(29,185,84,0.12), rgba(29,185,84,0.04))'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${i === 0 ? 'rgba(29,185,84,0.2)' : 'rgba(255,255,255,0.04)'}`,
                      opacity: 0,
                      animationDelay: `${0.3 + i * 0.06}s`,
                      animationFillMode: 'forwards',
                    }}
                  >
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: i < 3 ? '#1DB954' : '#55556a',
                      fontFamily: 'monospace',
                      minWidth: '28px',
                    }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <span style={{
                      flex: 1,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#f0f0f5',
                    }}>
                      {artist.name}
                    </span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#1DB954',
                      background: 'rgba(29,185,84,0.1)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                    }}>
                      {artist.count} {artist.count === 1 ? 'utwór' : artist.count < 5 ? 'utwory' : 'utworów'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────── */
export default function PlaylistAnalyzer({ token }: PlaylistAnalyzerProps) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>('default');

  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [detailTracks, setDetailTracks] = useState<any[] | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch playlists on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchUserPlaylists(token);
        if (!cancelled) setPlaylists(data);
      } catch (err) {
        console.error('[PlaylistAnalyzer] fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  // Handle playlist click
  const handleSelect = useCallback(async (playlist: any) => {
    if (selectedPlaylist?.id === playlist.id) {
      // Toggle off
      setSelectedPlaylist(null);
      setDetailTracks(null);
      return;
    }

    setSelectedPlaylist(playlist);
    setDetailTracks(null);
    setDetailLoading(true);

    try {
      const tracks = await fetchPlaylistTracks(token, playlist.id);
      setDetailTracks(tracks);
    } catch (err) {
      console.error('[PlaylistAnalyzer] track fetch error:', err);
      setDetailTracks([]);
    } finally {
      setDetailLoading(false);
    }
  }, [token, selectedPlaylist]);

  const handleCloseDetail = useCallback(() => {
    setSelectedPlaylist(null);
    setDetailTracks(null);
  }, []);

  /* ── Loading State ──────────────────────────────── */
  if (loading) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <h3 className="section-title">
          Twoje <span className="accent">Playlisty</span>
        </h3>
        <Spinner />
      </div>
    );
  }

  /* ── Empty State ────────────────────────────────── */
  if (playlists.length === 0) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
        <h3 className="section-title">
          Twoje <span className="accent">Playlisty</span>
        </h3>
        <div
          className="glass-card"
          style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#8888a0',
            fontSize: '1rem',
          }}
        >
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>📂</span>
          Nie znaleziono żadnych playlist.
        </div>
      </div>
    );
  }

  const sortedPlaylists = [...playlists].sort((a, b) => {
    if (sortOrder === 'tracks_desc') {
      const aTracks = a.tracks?.total ?? a.items?.total ?? a.tracks?.length ?? a.items?.length ?? 0;
      const bTracks = b.tracks?.total ?? b.items?.total ?? b.tracks?.length ?? b.items?.length ?? 0;
      return bTracks - aTracks;
    }
    if (sortOrder === 'tracks_asc') {
      const aTracks = a.tracks?.total ?? a.items?.total ?? a.tracks?.length ?? a.items?.length ?? 0;
      const bTracks = b.tracks?.total ?? b.items?.total ?? b.tracks?.length ?? b.items?.length ?? 0;
      return aTracks - bTracks;
    }
    if (sortOrder === 'name_asc') {
      return (a.name || '').localeCompare(b.name || '');
    }
    return 0;
  });

  /* ── Main Render ────────────────────────────────── */
  return (
    <div className="animate-fade-in-up" style={{ padding: '2rem 0' }}>
      {/* Section title */}
      <h3 className="section-title">
        Twoje <span className="accent">Playlisty</span>
      </h3>
      <p style={{
        color: '#8888a0',
        fontSize: '0.9rem',
        marginTop: '-0.5rem',
        marginBottom: '1.75rem',
      }}>
        Analizuj swoje playlisty i odkryj ukryte statystyki
      </p>

      {/* Sort Options */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#8888a0', fontSize: '0.85rem', fontWeight: 600 }}>Sortuj:</span>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="default" style={{ background: '#121212' }}>Domyślnie (od Spotify)</option>
          <option value="tracks_desc" style={{ background: '#121212' }}>Najwięcej utworów</option>
          <option value="tracks_asc" style={{ background: '#121212' }}>Najmniej utworów</option>
          <option value="name_asc" style={{ background: '#121212' }}>Alfabetycznie (A-Z)</option>
        </select>
      </div>

      {/* Detail Panel (above grid) */}
      {selectedPlaylist && (
        <DetailPanel
          playlist={selectedPlaylist}
          tracks={detailTracks}
          loading={detailLoading}
          onClose={handleCloseDetail}
        />
      )}

      {/* Playlist Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.25rem',
      }}>
        {sortedPlaylists.map((playlist, index) => {
          const coverUrl = playlist.images?.[0]?.url;
          const isSelected = selectedPlaylist?.id === playlist.id;

          return (
            <div
              key={playlist.id}
              className="glass-card animate-fade-in-up"
              onClick={() => handleSelect(playlist)}
              style={{
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
                borderRadius: '12px',
                border: `1px solid ${isSelected ? 'rgba(29,185,84,0.4)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.25s ease',
                opacity: 0,
                animationDelay: `${Math.min(index * 0.04, 0.8)}s`,
                animationFillMode: 'forwards',
                transform: isSelected ? 'scale(1.02)' : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.borderColor = 'rgba(29,185,84,0.3)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3), 0 0 20px rgba(29,185,84,0.06)';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                } else {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.borderColor = 'rgba(29,185,84,0.4)';
                }
                e.currentTarget.style.boxShadow = '';
              }}
            >
              {/* Cover Image */}
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={playlist.name}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: '12px 12px 0 0',
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #1a1a25 0%, #1DB954 50%, #0a7e35 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  borderRadius: '12px 12px 0 0',
                }}>
                  🎵
                </div>
              )}

              {/* Info */}
              <div style={{ padding: '0.85rem 1rem 1rem' }}>
                <p
                  title={playlist.name}
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#f0f0f5',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {playlist.name}
                </p>
                <p style={{
                  margin: '0.3rem 0 0',
                  fontSize: '0.75rem',
                  color: '#55556a',
                  fontWeight: 500,
                }}>
                  {playlist.tracks?.total ?? playlist.items?.total ?? playlist.tracks?.length ?? playlist.items?.length ?? 0} utworów
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
