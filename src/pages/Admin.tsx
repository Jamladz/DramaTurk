import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Film, CheckCircle2, X, Loader2, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

type View = 'dashboard' | 'add-series' | 'add-episode' | 'add-movie';

export function Admin() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [seriesData, setSeriesData] = useState({
    title: '',
    poster: '',
    status: 'Ongoing',
    latestEpisode: '',
  });

  const [episodeData, setEpisodeData] = useState({
    seriesTitle: '',
    title: '',
    thumbnail: '',
    duration: '',
    episodeNumber: '',
    releaseDate: new Date().toISOString().split('T')[0],
  });

  const [movieData, setMovieData] = useState({
    title: '',
    poster: '',
    duration: '',
    url: '',
    releaseDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!authLoading && profile?.username !== 'sekanedr_is') {
      navigate('/', { replace: true });
    }
  }, [profile, authLoading, navigate]);

  if (authLoading || profile?.username !== 'sekanedr_is') {
    return null;
  }

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, 'series'), {
        ...seriesData,
        createdAt: serverTimestamp(),
      });
      setSuccess('Series added successfully!');
      setSeriesData({ title: '', poster: '', status: 'Ongoing', latestEpisode: '' });
      setTimeout(() => {
        setSuccess(null);
        setView('dashboard');
      }, 2000);
    } catch (err: any) {
      console.error("Error adding series:", err);
      setError(err.message || 'Failed to add series. Check permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, 'episodes'), {
        ...episodeData,
        episodeNumber: parseInt(episodeData.episodeNumber) || 0,
        createdAt: serverTimestamp(),
      });
      setSuccess('Episode added successfully!');
      setEpisodeData({ 
        seriesTitle: '', 
        title: '', 
        thumbnail: '', 
        duration: '', 
        episodeNumber: '', 
        releaseDate: new Date().toISOString().split('T')[0] 
      });
      setTimeout(() => {
        setSuccess(null);
        setView('dashboard');
      }, 2000);
    } catch (err: any) {
      console.error("Error adding episode:", err);
      setError(err.message || 'Failed to add episode. Check permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, 'movies'), {
        ...movieData,
        createdAt: serverTimestamp(),
      });
      setSuccess('Movie added successfully!');
      setMovieData({ 
        title: '', 
        poster: '', 
        duration: '', 
        url: '', 
        releaseDate: new Date().toISOString().split('T')[0] 
      });
      setTimeout(() => {
        setSuccess(null);
        setView('dashboard');
      }, 2000);
    } catch (err: any) {
      console.error("Error adding movie:", err);
      setError(err.message || 'Failed to add movie. Check permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 text-gray-900 overflow-y-auto pb-24">
      <div className="px-4 py-4 flex items-center gap-3 sticky top-0 bg-white/90 backdrop-blur-xl z-10 border-b border-gray-100 shadow-sm">
        <button 
          onClick={() => view === 'dashboard' ? navigate(-1) : setView('dashboard')} 
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 transition-colors hover:bg-gray-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">
          {view === 'dashboard' ? 'Admin Dashboard' : view === 'add-series' ? 'New Series' : view === 'add-episode' ? 'New Episode' : 'New Movie'}
        </h1>
      </div>

      <div className="p-4 space-y-6">
        {success && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-2xl flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2">
            <X size={18} />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        {view === 'dashboard' && (
          <>
            <div className="bg-gradient-to-br from-[#3390ec] to-blue-500 rounded-3xl p-6 shadow-md relative overflow-hidden text-white">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <h2 className="text-xl font-bold mb-1 relative z-10">Welcome Admin</h2>
              <p className="text-white/90 text-sm relative z-10">You have full control over Drama Turk.</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setView('add-series')}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <PlusCircle size={24} className="text-[#3390ec]" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">New Series</span>
                </button>
                <button 
                  onClick={() => setView('add-episode')}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                    <Film size={24} className="text-purple-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">New Episode</span>
                </button>
                <button 
                  onClick={() => setView('add-movie')}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95 shadow-sm col-span-2"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                    <PlusCircle size={24} className="text-orange-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">New Movie</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">System Status</h3>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Database Connection</span>
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'add-series' && (
          <form onSubmit={handleAddSeries} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Title</label>
              <input 
                required
                type="text"
                value={seriesData.title}
                onChange={e => setSeriesData({...seriesData, title: e.target.value})}
                placeholder="e.g., Kuruluş Osman"
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Poster URL</label>
              <input 
                required
                type="url"
                value={seriesData.poster}
                onChange={e => setSeriesData({...seriesData, poster: e.target.value})}
                placeholder="https://example.com/poster.jpg"
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">Status</label>
                <select 
                  value={seriesData.status}
                  onChange={e => setSeriesData({...seriesData, status: e.target.value})}
                  className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all appearance-none shadow-sm"
                >
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>New</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">Latest Label</label>
                <input 
                  type="text"
                  value={seriesData.latestEpisode}
                  onChange={e => setSeriesData({...seriesData, latestEpisode: e.target.value})}
                  placeholder="e.g., Episode 150"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
                />
              </div>
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#3390ec] text-white font-bold py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Save Series
            </button>
          </form>
        )}

        {view === 'add-episode' && (
          <form onSubmit={handleAddEpisode} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Series Title</label>
              <input 
                required
                type="text"
                value={episodeData.seriesTitle}
                onChange={e => setEpisodeData({...episodeData, seriesTitle: e.target.value})}
                placeholder="e.g., Kuruluş Osman"
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Episode Title</label>
              <input 
                required
                type="text"
                value={episodeData.title}
                onChange={e => setEpisodeData({...episodeData, title: e.target.value})}
                placeholder="e.g., Episode 150 (Sub Arabic)"
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Thumbnail URL</label>
              <input 
                required
                type="url"
                value={episodeData.thumbnail}
                onChange={e => setEpisodeData({...episodeData, thumbnail: e.target.value})}
                placeholder="https://example.com/thumb.jpg"
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">Episode Number</label>
                <input 
                  required
                  type="number"
                  value={episodeData.episodeNumber}
                  onChange={e => setEpisodeData({...episodeData, episodeNumber: e.target.value})}
                  placeholder="150"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">Duration</label>
                <input 
                  type="text"
                  value={episodeData.duration}
                  onChange={e => setEpisodeData({...episodeData, duration: e.target.value})}
                  placeholder="02:15:00"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Release Date</label>
              <input 
                required
                type="date"
                value={episodeData.releaseDate}
                onChange={e => setEpisodeData({...episodeData, releaseDate: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
              />
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#3390ec] text-white font-bold py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Save Episode
            </button>
          </form>
        )}

        {view === 'add-movie' && (
          <form onSubmit={handleAddMovie} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Movie Title</label>
              <input 
                required
                type="text"
                value={movieData.title}
                onChange={e => setMovieData({...movieData, title: e.target.value})}
                placeholder="e.g., Miracle in Cell No. 7"
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Poster URL</label>
              <input 
                required
                type="url"
                value={movieData.poster}
                onChange={e => setMovieData({...movieData, poster: e.target.value})}
                placeholder="https://example.com/movie-poster.jpg"
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Streaming URL</label>
              <input 
                required
                type="url"
                value={movieData.url}
                onChange={e => setMovieData({...movieData, url: e.target.value})}
                placeholder="https://example.com/watch"
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">Duration</label>
                <input 
                  type="text"
                  value={movieData.duration}
                  onChange={e => setMovieData({...movieData, duration: e.target.value})}
                  placeholder="02:12:00"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">Release Date</label>
                <input 
                  required
                  type="date"
                  value={movieData.releaseDate}
                  onChange={e => setMovieData({...movieData, releaseDate: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3390ec]/20 transition-all"
                />
              </div>
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#3390ec] text-white font-bold py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Save Movie
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

