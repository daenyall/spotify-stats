import { useEffect, useState, useRef } from 'react';
import { redirectToAuthCodeFlow, getAccessToken } from './auth';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

function App() {
  const [token, setToken] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);

  const hasFetchedToken = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !hasFetchedToken.current) {
      hasFetchedToken.current = true;


      getAccessToken(clientId, code)
        .then(async (accessToken) => {
          if (accessToken) {
            setToken(accessToken);


            const profileData = await fetchProfile(accessToken);
            setProfile(profileData);

            window.history.replaceState({}, document.title, "/");
          } else {
            console.error("Nie udało się pobrać tokenu (np. kod wygasł).");
          }
        })
        .catch(err => {
          console.error("Wystąpił błąd podczas autoryzacji:", err);
        });
    }
  }, []);

  async function fetchProfile(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
  }

  if (!token) {
    return (
      <div className="container bg-sky-50">
      <div className="bg-sky-50">
        
        <button
          onClick={() => redirectToAuthCodeFlow(clientId)}
          style={{ padding: '15px 30px', backgroundColor: '#1DB954', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Zaloguj przez Spotify
        </button>
      </div>
      </div>
    );
  }


  return (
    <div className="flex container bg-teal-950 ">
    <div className='flex justify-content: center"'>
      {profile ? (
        <section id="profile" style={{ marginTop: '20px' }}>
          <h2>Zalogowano jako <span>{profile.display_name}</span></h2>

          {profile.images?.[0] && (
            <img
              src={profile.images[0].url}
              alt="Awatar użytkownika"
              style={{ width: '200px', height: '200px', borderRadius: '50%' }}
            />
          )}

          <ul>
            <li>User ID: <span>{profile.id}</span></li>
            <li>Email: <span>{profile.email}</span></li>
            <li>Spotify URI: <a href={profile.external_urls?.spotify}>{profile.uri}</a></li>
            <li>Link: <a href={profile.href}>{profile.href}</a></li>
          </ul>
        </section>
      ) : (
        <p>Ładowanie danych z profilu...</p>
      )}
</div>
    </div>
  );
}

export default App;