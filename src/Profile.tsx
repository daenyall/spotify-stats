interface ProfileProps {
  profile: any; 
}

export default function Profile({ profile }: ProfileProps) {
  if (!profile) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '4rem 0',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(29,185,84,0.2)',
          borderTopColor: '#1DB954',
          borderRadius: '50%',
          animation: 'spin-slow 1s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <section className="glass-card animate-fade-in-up" style={{
      padding: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
    }}>
      {/* Avatar */}
      {profile.images?.[0] && (
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1DB954, #4ade80, #1DB954)',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 3s ease infinite',
            opacity: 0.6,
            filter: 'blur(4px)',
          }} />
          <img 
            src={profile.images[0].url} 
            alt="Awatar użytkownika" 
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(29,185,84,0.5)',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#1DB954',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '0.25rem',
        }}>
          Twój profil
        </p>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}>
          Cześć, <span className="gradient-text">{profile.display_name}</span>!
        </h2>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#8888a0',
          }}>
            <span style={{ color: '#55556a' }}>ID</span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              background: 'rgba(255,255,255,0.04)',
              padding: '2px 8px',
              borderRadius: '6px',
              color: '#a0a0b5',
            }}>{profile.id}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#8888a0',
          }}>
            <span style={{ color: '#55556a' }}>✉</span>
            <span>{profile.email}</span>
          </div>

          <a 
            href={profile.external_urls?.spotify} 
            target="_blank" 
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#1DB954',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1ed760'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#1DB954'}
          >
            Otwórz profil ↗
          </a>
        </div>
      </div>
    </section>
  );
}
