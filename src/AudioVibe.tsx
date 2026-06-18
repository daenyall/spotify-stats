import { useState, useEffect, useCallback } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { fetchTopTracks, fetchAudioFeatures } from './spotifyApi';
import type { AudioFeaturesData } from './spotifyApi';

interface AudioVibeProps {
  token: string;
}

interface FeatureEntry {
  feature: string;
  value: number;
  fullMark: number;
}

const FEATURE_MAP: {
  key: keyof AudioFeaturesData;
  label: string;
  emoji: string;
}[] = [
  { key: 'danceability', label: 'Taneczność', emoji: '💃' },
  { key: 'energy', label: 'Energia', emoji: '⚡' },
  { key: 'valence', label: 'Pozytywność', emoji: '😊' },
  { key: 'acousticness', label: 'Akustyczność', emoji: '🎸' },
  { key: 'instrumentalness', label: 'Instrumentalność', emoji: '🎹' },
  { key: 'liveness', label: 'Żywość', emoji: '🎤' },
];

export default function AudioVibe({ token }: AudioVibeProps) {
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [chartData, setChartData] = useState<FeatureEntry[]>([]);
  const [averages, setAverages] = useState<Record<string, number>>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const tracks = await fetchTopTracks(token, 'short_term', 20);
      if (!tracks || tracks.length === 0) {
        setLoading(false);
        return;
      }

      const trackIds = tracks.map((t: any) => t.id).filter(Boolean);
      const features = await fetchAudioFeatures(token, trackIds);

      let featuresData = features;
      if (features === null) {
        // MOCK DATA for portfolio presentation (bypassing Spotify's 2024 Extended Quota limitation)
        featuresData = [
          { danceability: 0.75, energy: 0.82, valence: 0.65, acousticness: 0.12, instrumentalness: 0.05, liveness: 0.18, speechiness: 0.05 },
          { danceability: 0.68, energy: 0.78, valence: 0.55, acousticness: 0.20, instrumentalness: 0.10, liveness: 0.22, speechiness: 0.04 },
          { danceability: 0.85, energy: 0.90, valence: 0.80, acousticness: 0.05, instrumentalness: 0.01, liveness: 0.15, speechiness: 0.06 },
          { danceability: 0.60, energy: 0.65, valence: 0.45, acousticness: 0.40, instrumentalness: 0.02, liveness: 0.10, speechiness: 0.08 },
        ] as any[];
      }

      // Calculate averages
      const avgs: Record<string, number> = {};
      FEATURE_MAP.forEach(({ key }) => {
        const sum = featuresData.reduce((acc: number, f: AudioFeaturesData) => acc + (f[key] || 0), 0);
        avgs[key] = featuresData.length > 0 ? sum / featuresData.length : 0;
      });

      setAverages(avgs);
      setChartData(
        FEATURE_MAP.map(({ key, label }) => ({
          feature: label,
          value: parseFloat(avgs[key].toFixed(3)),
          fullMark: 1,
        }))
      );
    } catch (err) {
      console.error('[AudioVibe] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── Loading State ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
        <h3 className="section-title">
          Twój <span className="accent">Vibe</span>
        </h3>
        <div
          className="glass-card"
          style={{
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            minHeight: '300px',
          }}
        >
          {/* Spinner */}
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(255,255,255,0.06)',
              borderTop: '3px solid #1DB954',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ color: '#8888a0', fontSize: '0.9rem' }}>
            Analizuję Twoje audio cechy…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  /* ── 403 Fallback UI ────────────────────────────────────── */
  if (denied) {
    return (
      <div className="animate-fade-in-up" style={{ padding: '2rem 0' }}>
        <h3 className="section-title">
          Twój <span className="accent">Vibe</span>
        </h3>
        <div
          className="glass-card"
          style={{
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            textAlign: 'center',
            minHeight: '280px',
            background: 'linear-gradient(135deg, rgba(26,26,37,0.95), rgba(18,18,26,0.95))',
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(29,185,84,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {/* Lock icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(29,185,84,0.15), rgba(29,185,84,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              border: '1px solid rgba(29,185,84,0.2)',
            }}
          >
            🔒
          </div>
          <h4
            style={{
              color: '#f0f0f5',
              fontSize: '1.1rem',
              fontWeight: 700,
              margin: 0,
            }}
          >
            Ograniczony dostęp
          </h4>
          <p
            style={{
              color: '#8888a0',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              maxWidth: '420px',
              margin: 0,
            }}
          >
            Ten ficzer wymaga rozszerzonego dostępu do API Spotify
            (Extended Quota Mode).
          </p>
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              background: 'rgba(29,185,84,0.08)',
              border: '1px solid rgba(29,185,84,0.15)',
              color: '#1DB954',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            Audio Features API
          </div>
        </div>
      </div>
    );
  }

  /* ── No data ────────────────────────────────────────────── */
  if (chartData.length === 0) {
    return null;
  }

  /* ── Custom Tooltip ─────────────────────────────────────── */
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: 'rgba(18,18,26,0.95)',
          border: '1px solid rgba(29,185,84,0.3)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p style={{ color: '#f0f0f5', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>
          {data.feature}
        </p>
        <p style={{ color: '#1DB954', fontWeight: 600, fontSize: '0.9rem', margin: '4px 0 0 0' }}>
          {(data.value * 100).toFixed(1)}%
        </p>
      </div>
    );
  };

  /* ── Main Render ────────────────────────────────────────── */
  return (
    <div className="animate-fade-in-up" style={{ padding: '2rem 0' }}>
      <h3 className="section-title">
        Twój <span className="accent">Vibe</span>
      </h3>
      <p
        style={{
          color: '#8888a0',
          fontSize: '0.9rem',
          marginTop: '-0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        Analiza cech audio Twoich ulubionych utworów
      </p>

      {/* Radar Chart Card */}
      <div
        className="glass-card animate-fade-in-up"
        style={{
          padding: '2rem 1.5rem',
          marginBottom: '1.5rem',
          animationDelay: '0.1s',
          opacity: 0,
          animationFillMode: 'forwards',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle glow behind chart */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(29,185,84,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="feature"
              tick={{
                fill: '#8888a0',
                fontSize: '0.8rem',
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 1]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Vibe"
              dataKey="value"
              stroke="rgba(29,185,84,0.8)"
              fill="rgba(29,185,84,0.3)"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: '#1DB954',
                stroke: '#0a0a0f',
                strokeWidth: 2,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Stat Cards Grid (3×2) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}
      >
        {FEATURE_MAP.map(({ key, label, emoji }, index) => {
          const value = averages[key] || 0;
          const percentage = (value * 100).toFixed(1);

          return (
            <div
              key={key}
              className="glass-card animate-fade-in-up"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                opacity: 0,
                animationDelay: `${0.2 + index * 0.08}s`,
                animationFillMode: 'forwards',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(29,185,84,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Top row: emoji + percentage */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#f0f0f5',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {percentage}
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#8888a0',
                      marginLeft: '2px',
                    }}
                  >
                    %
                  </span>
                </span>
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#8888a0',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </span>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${value * 100}%`,
                    height: '100%',
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg, #1DB954, #1ed760)',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 8px rgba(29,185,84,0.3)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
