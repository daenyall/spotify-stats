interface ProfileProps {
  profile: any; 
}

export default function Profile({ profile }: ProfileProps) {
    if (!profile) {
    return <div className="text-zinc-400 animate-pulse text-center mt-10">Ładowanie profilu...</div>;
  }
    return(
        
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
       
    );
    }
