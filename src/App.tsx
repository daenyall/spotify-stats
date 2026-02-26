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
    
<div className="flex flex-col min-h-screen bg-zinc-900 text-white">
      
 
      <nav className="bg-zinc-900/95 border-b border-zinc-800 sticky top-0 start-0 z-50 w-full p-4">
        <div className="max-w-8xl mx-auto flex justify-between">
          <a href="#" className="text-2xl font-bold text-white tracking-wider ">
            Spotify<span className="text-[#1DB954]">Stats</span>
          </a>

      <div className="flex space-x-8 text-sm font-medium items-center">
  <a href="#" className="relative group px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
        <span className="relative z-10">Profil</span>
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#1DB954] shadow-[0_0_12px_2px_rgba(29,185,84,0.8)] transition-all duration-300 ease-out group-hover:h-full"></span>
    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#1DB954] shadow-[0_0_12px_2px_rgba(29,185,84,0.8)] transition-all duration-300 ease-out group-hover:h-full"></span>
  </a>
  <a href="#" className="relative group px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
        <span className="relative z-10">Top Artyści</span>
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#1DB954] shadow-[0_0_12px_2px_rgba(29,185,84,0.8)] transition-all duration-300 ease-out group-hover:h-full"></span>
    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#1DB954] shadow-[0_0_12px_2px_rgba(29,185,84,0.8)] transition-all duration-300 ease-out group-hover:h-full"></span>
  </a>
  

  <a href="#" className="relative group px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
    <span className="relative z-10">Ostatnio Odtwarzane</span>
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#1DB954] shadow-[0_0_12px_2px_rgba(29,185,84,0.8)] transition-all duration-300 ease-out group-hover:h-full"></span>
    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#1DB954] shadow-[0_0_12px_2px_rgba(29,185,84,0.8)] transition-all duration-300 ease-out group-hover:h-full"></span>
  </a>
</div>
</div>
      </nav>

   
      <div className="flex-grow flex flex-col justify-center items-center p-6">
        {profile ? (
          <section className="bg-zinc-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md w-full border border-zinc-700/50 flex flex-col items-center">
            
            {profile.images?.[0] && (
              <div className="relative mb-6">
                <img 
                  src={profile.images[0].url} 
                  alt="Awatar użytkownika" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#1DB954] shadow-[0_0_20px_rgba(29,185,84,0.4)]" 
                />
              </div>
            )}

            <h2 className="text-2xl font-bold mb-6 text-center">
              Cześć, <span className="text-[#1DB954]">{profile.display_name}</span>!
            </h2>
            
            <ul className="w-full space-y-4 text-sm">
              <li className="flex justify-between items-center border-b border-zinc-700/50 pb-3">
                <span className="text-zinc-400">User ID</span>
                <span className="font-mono text-xs truncate ml-4">{profile.id}</span>
              </li>
              <li className="flex justify-between items-center border-b border-zinc-700/50 pb-3">
                <span className="text-zinc-400">Email</span>
                <span className="truncate ml-4">{profile.email}</span>
              </li>
              <li className="flex justify-between items-center pt-1">
                <span className="text-zinc-400">Spotify Link</span>
                <a 
                  href={profile.external_urls?.spotify} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#1DB954] hover:text-white transition-colors truncate ml-4"
                >
                  Otwórz profil ↗
                </a>
              </li>
            </ul>
          </section>
        ) : (
          <div className="text-zinc-400 animate-pulse">Ładowanie...</div>
        )}
      </div>

    </div>
  );
}

export default App;