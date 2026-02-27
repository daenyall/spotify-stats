interface TopTracksProps {
  tracks: any[]; 
}

export default function TopTracks({ tracks }: TopTracksProps) {
    if (!tracks || tracks.length === 0) {
    return null; 
  }
    return(
        
          <div>
        {tracks && tracks.length > 0 && (
          <div className="w-full max-w-2xl mt-12">
            <h3 className="text-xl font-bold mb-6 text-center text-white">Twoje Top Piosenki</h3>
            <div className="space-y-4">
              {tracks.map((track, index) => (
                <div key={track.id} className="bg-zinc-800/80 p-4 rounded-xl flex items-center gap-4 border border-zinc-700/50 hover:bg-zinc-700/50 transition-colors">
                  
                  <span className="text-zinc-500 font-bold w-6 text-right">{index + 1}.</span>
                  
                  
                  {track.album?.images?.[0] && (
                    <img src={track.album.images[0].url} alt="Okładka" className="w-12 h-12 rounded shadow-md" />
                  )}
                  
                  
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-white truncate">{track.name}</p>
                    
                    <p className="text-sm text-zinc-400 truncate">
                      {track.artists.map((artist: any) => artist.name).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
       
    );
    }
