interface RecentlyPlayedProps {
  recentlyPlayed: any[]; 
}

export default function RecentlyPlayed({ recentlyPlayed }: RecentlyPlayedProps) {
  if (!recentlyPlayed || recentlyPlayed.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <h3 className="section-title">
        Ostatnio <span className="accent">Odtwarzane</span>
      </h3>
      
      <div className="glass-card" style={{
        padding: '0.5rem',
        overflow: 'hidden',
      }}>
        {recentlyPlayed.map((item, index) => (
          <a
            key={`${item.played_at}-${index}`}
            href={item.track.external_urls?.spotify}
            target="_blank"
            rel="noreferrer"
            className="animate-slide-in-left"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background 0.2s ease',
              cursor: 'pointer',
              opacity: 0,
              animationDelay: `${index * 0.03}s`,
              animationFillMode: 'forwards',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29,185,84,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {/* Number */}
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#55556a',
              width: '24px',
              textAlign: 'right',
              fontFamily: 'monospace',
              flexShrink: 0,
            }}>
              {index + 1}
            </span>
            
            {/* Album cover */}
            {item.track.album?.images?.[0] && (
              <img 
                src={item.track.album.images[0].url} 
                alt="Okładka" 
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  flexShrink: 0,
                }}
              />
            )}
            
            {/* Track info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#f0f0f5',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {item.track.name}
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: '#8888a0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '1px',
              }}>
                {item.track.artists.map((artist: any) => artist.name).join(', ')}
              </p>
            </div>

            {/* Timestamp */}
            <div style={{
              fontSize: '0.7rem',
              color: '#55556a',
              textAlign: 'right',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              lineHeight: 1.4,
            }}>
              <div>{new Date(item.played_at).toLocaleDateString('pl-PL')}</div>
              <div style={{ color: '#8888a0' }}>
                {new Date(item.played_at).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}