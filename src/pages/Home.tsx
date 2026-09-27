import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { PlayCircle, Film, X, Info, Calendar } from 'lucide-react';

export function Home() {
  const [series, setSeries] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<any | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const seriesQ = query(collection(db, 'series'), orderBy('createdAt', 'desc'), limit(10));
        const seriesSnap = await getDocs(seriesQ);
        const loadedSeries = seriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const epsQ = query(collection(db, 'episodes'), orderBy('createdAt', 'desc'), limit(15));
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
        <div className="w-8 h-8 border-4 border-[#3390ec] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-24 overflow-y-auto overflow-x-hidden">
      <div className="px-4 py-6 space-y-8">
        
        {/* Featured / Weekly Series Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Film size={20} className="text-[#3390ec]" />
              Weekly Series
            </h2>
            {series.length > 0 && (
              <button className="text-[#3390ec] text-xs font-bold hover:bg-blue-50 px-3 py-1 rounded-full transition-colors">View All</button>
            )}
          </div>
          
          {series.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x -mx-4 px-4 scrollbar-hide">
              {series.map(s => (
                <div key={s.id} className="w-40 shrink-0 snap-start group cursor-pointer">
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                    <img src={s.poster} alt={s.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-2 right-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm backdrop-blur-md ${s.status === 'Ongoing' ? 'bg-[#3390ec]/80' : 'bg-green-500/80'}`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-0.5">{s.latestEpisode}</p>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{s.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col items-center text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Film size={32} className="text-gray-300" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">No Series Available</h3>
              <p className="text-xs text-gray-500 max-w-[200px]">The administrator has not added any series yet. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Latest Episodes Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <PlayCircle size={20} className="text-purple-500" />
              Latest Episodes
            </h2>
          </div>
          
          {episodes.length > 0 ? (
            <div className="flex flex-col gap-4">
              {episodes.map(ep => (
                <div 
                  key={ep.id} 
                  onClick={() => setSelectedEpisode(ep)}
                  className="flex gap-4 bg-white p-3 rounded-3xl border border-gray-100 shadow-sm active:scale-[0.98] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-32 aspect-video rounded-2xl overflow-hidden shrink-0 relative bg-gray-100 border border-gray-50">
                    <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform transition-transform group-hover:scale-110">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {ep.duration && (
                      <div className="absolute bottom-1.5 right-1.5 bg-black/60 px-2 py-0.5 rounded-lg text-[9px] font-bold text-white backdrop-blur-md">
                        {ep.duration}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] text-[#3390ec] font-bold uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">{ep.seriesTitle}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 truncate group-hover:text-[#3390ec] transition-colors">{ep.title}</h3>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span className="flex items-center gap-1 text-[10px] font-medium">
                        <Info size={10} />
                        Episode {ep.episodeNumber}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-medium">
                        <Calendar size={10} />
                        {ep.releaseDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col items-center text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <PlayCircle size={32} className="text-gray-300" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">No New Episodes</h3>
              <p className="text-xs text-gray-500 max-w-[200px]">We are working on bringing you new content. Stay tuned!</p>
            </div>
          )}
        </section>

      </div>

      {/* Video Player Modal */}
      {selectedEpisode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedEpisode(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{selectedEpisode.seriesTitle}</span>
                <h2 className="text-white font-bold text-sm truncate max-w-[200px]">{selectedEpisode.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedEpisode(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Iframe Player */}
            <div className="aspect-video bg-black flex items-center justify-center">
              <iframe 
                src={selectedEpisode.videoUrl}
                className="w-full h-full border-none"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={selectedEpisode.title}
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#111] border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-[10px] text-gray-400 font-medium">Episode</span>
                    <span className="ml-2 text-sm font-bold text-white">{selectedEpisode.episodeNumber}</span>
                  </div>
                  {selectedEpisode.duration && (
                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-[10px] text-gray-400 font-medium">Duration</span>
                      <span className="ml-2 text-sm font-bold text-white">{selectedEpisode.duration}</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{selectedEpisode.releaseDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
