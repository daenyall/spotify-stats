interface TopTracksProps {
  tracks: any[]; 
}

export default function TopTracks({ tracks }: TopTracksProps) {
  if (!tracks || tracks.length === 0) {
    return null; 
  }

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="section-title">
        Top <span className="accent">Piosenki</span>
      </h3>
      
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        paddingBottom: '1rem',
        scrollSnapType: 'x mandatory',
      }}>
        {tracks.map((track, index) => (
          <div 
            key={track.id} 
            className="glass-card animate-fade-in-up"
            style={{
              scrollSnapAlign: 'start',
              flexShrink: 0,
              width: '180px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              opacity: 0,
              animationDelay: `${Math.min(index * 0.03, 0.5)}s`,
              animationFillMode: 'forwards',
            }}
          >
            {/* Rank badge */}
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: index < 3 ? '#1DB954' : '#55556a',
                fontFamily: 'monospace',
              }}>
                {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
              </span>
            </div>
            
            {/* Album cover */}
            {track.album?.images?.[0] ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <img 
                  src={track.album.images[0].url} 
                  alt="Okładka" 
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                />
                {/* Play overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '12px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  padding: '8px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                  <a
                    href={track.external_urls?.spotify}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#1DB954',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000',
                      fontSize: '16px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ▶
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1a1a25, #222230)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}>
                🎵
              </div>
            )}
            
            {/* Track info */}
            <div style={{ width: '100%', textAlign: 'left' }}>
              <p style={{
                fontWeight: 700,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#f0f0f5',
              }} title={track.name}>
                {track.name}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#8888a0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '2px',
              }} title={track.artists.map((a: any) => a.name).join(', ')}>
                {track.artists.map((artist: any) => artist.name).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}