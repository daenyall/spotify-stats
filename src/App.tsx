
import { useEffect, useState } from 'react';
import { redirectToAuthCodeFlow, getAccessToken } from './auth';

const clientId = "TWÓJ_CLIENT_ID_Z_PANELU_SPOTIFY"; 

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");


    if (code) {
      getAccessToken(clientId, code).then((accessToken) => {
        setToken(accessToken);

        window.history.replaceState({}, document.title, "/"); 
      });
    }
  }, []);


  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <button 
          onClick={() => redirectToAuthCodeFlow(clientId)}
          style={{ padding: '15px 30px', backgroundColor: '#1DB954', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Zaloguj przez Spotify
        </button>
      </div>
    );
  }


  return (
    <div style={{ padding: '20px' }}>
      <h1>Udało się! Jesteś zalogowany 🎉</h1>
      <p>Twój sekretny token to: {token.substring(0, 20)}...</p>
      <p>Teraz możemy użyć tego tokenu, żeby pobrać Twoich ulubionych artystów!</p>
    </div>
  );
}

export default App;