interface TopArtistsProps {
  artists: any[]; 
}

export default function TopArtists({ artists }: TopArtistsProps) {
  if (!artists || artists.length === 0) {
    return null; 
  }

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="section-title">
        Top <span className="accent">Artyści</span>
      </h3>
      
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        paddingBottom: '1rem',
        scrollSnapType: 'x mandatory',
      }}>
        {artists.map((artist, index) => (
          <a
            key={artist.id}
            href={artist.external_urls?.spotify}
            target="_blank"
            rel="noreferrer"
            className="glass-card animate-fade-in-up"
            style={{
              scrollSnapAlign: 'start',
              flexShrink: 0,
              width: '170px',
              padding: '1.25rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit',
              opacity: 0,
              animationDelay: `${Math.min(index * 0.03, 0.5)}s`,
              animationFillMode: 'forwards',
            }}
          >
            {/* Rank */}
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: index < 3 ? '#1DB954' : '#55556a',
              fontFamily: 'monospace',
              alignSelf: 'flex-start',
            }}>
              {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
            </span>
            
            {/* Artist image */}
            {artist.images?.[0] ? (
              <div style={{
                position: 'relative',
                width: '110px',
                height: '110px',
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '-3px',
                  borderRadius: '50%',
                  background: index === 0
                    ? 'linear-gradient(135deg, #1DB954, #4ade80, #1DB954)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                  backgroundSize: '200% 200%',
                  animation: index === 0 ? 'gradient-shift 3s ease infinite' : 'none',
                }} />
                <img 
                  src={artist.images[0].url} 
                  alt={artist.name} 
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a1a25, #222230)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
              }}>
                🎤
              </div>
            )}
            
            {/* Artist info */}
            <div style={{ textAlign: 'center', width: '100%' }}>
              <p style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#f0f0f5',
              }} title={artist.name}>
                {artist.name}
              </p>
              <p style={{
                fontSize: '0.7rem',
                fontWeight: 500,
                color: '#1DB954',
                marginTop: '4px',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }} title={artist.genres?.join(', ')}>
                {artist.genres && artist.genres.length > 0 ? artist.genres[0] : 'Artysta'}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}