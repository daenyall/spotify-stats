interface TopGenresProps {
  genres: string[]; 
}

export default function TopGenres({ genres }: TopGenresProps) {

  if (!genres || genres.length === 0) {
    return <div className="text-zinc-400 text-center mt-10">Ładowanie gatunków...</div>;
  }

  return (
    <div className="w-full flex justify-center mt-12">
      <div className="w-full max-w-2xl text-center text-white">
        <h3 className="text-xl font-bold mb-6">Twoje Top Gatunki</h3>
        

        <div className="flex flex-wrap justify-center gap-3">
          {genres.map((genre, index) => (

            <div 
              key={index} 
              className="bg-zinc-800/80 px-4 py-2 rounded-full border border-[#1DB954]/30 text-sm font-medium hover:bg-[#1DB954] hover:text-white transition-colors cursor-default"
            >
              {genre}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}