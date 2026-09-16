import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { PlayCircle, Film } from 'lucide-react';

export function Home() {
  const [series, setSeries] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const seriesQ = query(collection(db, 'series'), orderBy('createdAt', 'desc'), limit(5));
        const seriesSnap = await getDocs(seriesQ);
        const loadedSeries = seriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const epsQ = query(collection(db, 'episodes'), orderBy('releaseDate', 'desc'), limit(5));
        const epsSnap = await getDocs(epsQ);
        const loadedEps = epsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setSeries(loadedSeries);
        setEpisodes(loadedEps);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-24 overflow-y-auto overflow-x-hidden">
      <div className="px-4 py-6 space-y-8">
        
        {/* Weekly Series Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Weekly Series</h2>
            {series.length > 0 && (
              <button className="text-blue-500 text-sm font-medium">View All</button>
            )}
          </div>
          
          {series.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x -mx-4 px-4 scrollbar-hide">
              {series.map(s => (
                <div key={s.id} className="w-40 shrink-0 snap-start flex flex-col gap-2">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-white/5">
                    <img src={s.poster} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                      <span className="text-[10px] font-bold bg-blue-600 px-1.5 py-0.5 rounded text-white">{s.status}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white line-clamp-1">{s.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1">{s.latestEpisode}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#2c2c2e] rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center">
              <Film size={32} className="text-gray-500 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">No Series Available</h3>
              <p className="text-xs text-gray-400">The administrator has not added any series yet.</p>
            </div>
          )}
        </section>

        {/* Latest Episodes Section */}
        <section>
          <h2 className="text-xl font-bold text-white tracking-tight mb-4">Latest Episodes</h2>
          
          {episodes.length > 0 ? (
            <div className="flex flex-col gap-4">
              {episodes.map(ep => (
                <div key={ep.id} className="flex gap-4 bg-[#2c2c2e] p-3 rounded-2xl border border-white/5 shadow-sm active:scale-[0.98] transition-transform">
                  <div className="w-32 aspect-video rounded-xl overflow-hidden shrink-0 relative bg-black">
                    <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover opacity-80" loading="lazy" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-8 h-8 text-white/90 drop-shadow-lg" />
                    </div>
                    {ep.duration && (
                      <div className="absolute bottom-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-medium text-white backdrop-blur-sm">
                        {ep.duration}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h4 className="text-xs text-blue-400 font-semibold mb-1">{ep.seriesTitle}</h4>
                    <h3 className="text-sm font-bold text-white leading-tight mb-1 truncate">{ep.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">Ep. {ep.episodeNumber}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[10px] text-gray-500">{ep.releaseDate}</span>
                      <button className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors">
                        Watch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#2c2c2e] rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center">
              <PlayCircle size={32} className="text-gray-500 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">No New Episodes</h3>
              <p className="text-xs text-gray-400">Check back later for new releases.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
