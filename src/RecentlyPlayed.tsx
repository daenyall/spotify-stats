interface RecentlyPlayedProps {
  recentlyPlayed: any[]; 
}

export default function RecentlyPlayed({ recentlyPlayed }: RecentlyPlayedProps) {
  if (!recentlyPlayed) {
    return <div className="text-zinc-400 animate-pulse text-center mt-10">Ładowanie historii...</div>;
  }

  return(
    <div className="w-full flex justify-center">
      {recentlyPlayed && recentlyPlayed.length > 0 && (
        <div className="w-full max-w-2xl mt-12">
          <h3 className="text-xl font-bold mb-6 text-center text-white">Ostatnio Odtwarzane</h3>
          
          <div className="space-y-4">
            {recentlyPlayed.map((item, index) => (
              <div key={item.played_at} className="bg-zinc-800/80 p-4 rounded-xl flex items-center gap-4 border border-zinc-700/50 hover:bg-zinc-700/50 transition-colors">
                
                <span className="text-zinc-500 font-bold w-6 text-right">{index + 1}.</span>
                
                {item.track.album?.images?.[0] && (
                  <img src={item.track.album.images[0].url} alt="Okładka" className="w-12 h-12 rounded shadow-md" />
                )}
                
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-white truncate">{item.track.name}</p>
                  
                  <p className="text-sm text-zinc-400 truncate">
                    {item.track.artists.map((artist: any) => artist.name).join(', ')}
                  </p>
                </div>

                <div className="text-xs text-zinc-500 text-right whitespace-nowrap ml-2">
                  {new Date(item.played_at).toLocaleDateString()}<br/>
                  {new Date(item.played_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}