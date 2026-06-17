
interface TopGenresProps {
  genres: string[]; 
}

export default function TopGenres({ genres }: TopGenresProps) {
  if (!genres || genres.length === 0) {
    return null;
  }

  // Generate a subtle hue shift for each genre tag
  const getTagStyle = (index: number): React.CSSProperties => {
    if (index === 0) {
      return {
        background: 'linear-gradient(135deg, #1DB954, #1ed760)',
        color: '#000',
        fontWeight: 700,
        boxShadow: '0 0 24px rgba(29,185,84,0.4)',
        transform: 'scale(1.08)',
        border: 'none',
      };
    }
    if (index <= 2) {
      return {
        background: 'rgba(29,185,84,0.12)',
        color: '#1DB954',
        border: '1px solid rgba(29,185,84,0.25)',
      };
    }
    return {
      background: 'rgba(255,255,255,0.03)',
      color: '#a0a0b5',
      border: '1px solid rgba(255,255,255,0.06)',
    };
  };

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <h3 className="section-title">
        Twoje Top <span className="accent">Gatunki</span>
      </h3>
      
      <div className="glass-card" style={{
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.75rem',
        }}>
          {genres.map((genre, index) => (
            <div 
              key={index} 
              className="animate-fade-in"
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
                transition: 'all 0.3s ease',
                cursor: 'default',
                opacity: 0,
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'forwards',
                ...getTagStyle(index),
              }}
              onMouseEnter={(e) => {
                if (index > 0) {
                  e.currentTarget.style.borderColor = 'rgba(29,185,84,0.4)';
                  e.currentTarget.style.color = '#1DB954';
                  e.currentTarget.style.background = 'rgba(29,185,84,0.08)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (index > 0) {
                  const s = getTagStyle(index);
                  e.currentTarget.style.borderColor = (s.border as string)?.match(/rgba[^)]+\)/)?.[0] || '';
                  e.currentTarget.style.color = s.color as string;
                  e.currentTarget.style.background = s.background as string;
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {index === 0 && <span style={{ marginRight: '6px' }}>👑</span>}
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}