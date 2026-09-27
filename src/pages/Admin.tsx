import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Film, CheckCircle2, X, Upload, Save, Loader2, Trash2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export function Admin() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'menu' | 'series' | 'episode'>('menu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [seriesForm, setSeriesForm] = useState({
    title: '',
    poster: '',
    status: 'Ongoing',
    latestEpisode: ''
  });
  const [episodeForm, setEpisodeForm] = useState({
    title: '',
    thumbnail: '',
    duration: '',
    episodeNumber: '',
    seriesId: '',
    videoUrl: ''
  });

  useEffect(() => {
    if (!loading && profile?.username !== 'sekanedr_is') {
      navigate('/', { replace: true });
    }
  }, [profile, loading, navigate]);

  useEffect(() => {
    if (activeTab === 'episode' || activeTab === 'menu') {
      fetchSeries();
    }
  }, [activeTab]);

  async function fetchSeries() {
    try {
      const q = query(collection(db, 'series'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setSeriesList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    }
  }

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      await addDoc(collection(db, 'series'), {
        ...seriesForm,
        createdAt: serverTimestamp()
      });
      setMessage({ type: 'success', text: 'Series added successfully!' });
      setSeriesForm({ title: '', poster: '', status: 'Ongoing', latestEpisode: '' });
      setTimeout(() => setActiveTab('menu'), 1500);
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to add series.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      const selectedSeries = seriesList.find(s => s.id === episodeForm.seriesId);
      await addDoc(collection(db, 'episodes'), {
        ...episodeForm,
        seriesTitle: selectedSeries?.title || '',
        episodeNumber: Number(episodeForm.episodeNumber),
        releaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        createdAt: serverTimestamp()
      });
      setMessage({ type: 'success', text: 'Episode added successfully!' });
      setEpisodeForm({ title: '', thumbnail: '', duration: '', episodeNumber: '', seriesId: '', videoUrl: '' });
      setTimeout(() => setActiveTab('menu'), 1500);
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to add episode.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSeries = async (id: string) => {
    if (!window.confirm('Are you sure? This will not delete associated episodes.')) return;
    try {
      await deleteDoc(doc(db, 'series', id));
      fetchSeries();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || profile?.username !== 'sekanedr_is') {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 text-gray-900 overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-10 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => activeTab === 'menu' ? navigate(-1) : setActiveTab('menu')} 
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 transition-colors hover:bg-gray-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">
            {activeTab === 'menu' && 'Admin Dashboard'}
            {activeTab === 'series' && 'Add New Series'}
            {activeTab === 'episode' && 'Add New Episode'}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} border animate-in fade-in slide-in-from-top-4`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        {activeTab === 'menu' && (
          <>
            <div className="bg-gradient-to-br from-[#3390ec] to-blue-500 rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <h2 className="text-xl font-bold mb-1 relative z-10 text-white">Welcome Admin</h2>
              <p className="text-white/90 text-sm relative z-10">You have full control over Drama Turk.</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Content Management</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('series')}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <PlusCircle size={24} className="text-[#3390ec]" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Add Series</span>
                </button>
                <button 
                  onClick={() => setActiveTab('episode')}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                    <Film size={24} className="text-purple-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Add Episode</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Existing Series</h3>
              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-sm overflow-hidden">
                {seriesList.length > 0 ? seriesList.map(s => (
                  <div key={s.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={s.poster} alt="" className="w-10 h-14 object-cover rounded-lg bg-gray-100" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{s.title}</h4>
                        <p className="text-[10px] text-gray-500">{s.status} • {s.latestEpisode}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteSeries(s.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-400 text-sm">No series found</div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'series' && (
          <form onSubmit={handleAddSeries} className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Series Title</label>
                <input 
                  required
                  type="text" 
                  value={seriesForm.title}
                  onChange={e => setSeriesForm({...seriesForm, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                  placeholder="e.g. Kurulus Osman"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Poster Image URL</label>
                <input 
                  required
                  type="url" 
                  value={seriesForm.poster}
                  onChange={e => setSeriesForm({...seriesForm, poster: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Status</label>
                  <select 
                    value={seriesForm.status}
                    onChange={e => setSeriesForm({...seriesForm, status: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                  >
                    <option>Ongoing</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Latest Info</label>
                  <input 
                    type="text" 
                    value={seriesForm.latestEpisode}
                    onChange={e => setSeriesForm({...seriesForm, latestEpisode: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                    placeholder="e.g. Episode 124"
                  />
                </div>
              </div>
            </div>
            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full bg-[#3390ec] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Save Series
            </button>
          </form>
        )}

        {activeTab === 'episode' && (
          <form onSubmit={handleAddEpisode} className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Parent Series</label>
                <select 
                  required
                  value={episodeForm.seriesId}
                  onChange={e => setEpisodeForm({...episodeForm, seriesId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                >
                  <option value="">Select Series...</option>
                  {seriesList.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Episode Title</label>
                <input 
                  required
                  type="text" 
                  value={episodeForm.title}
                  onChange={e => setEpisodeForm({...episodeForm, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                  placeholder="e.g. The Battle of Inegol"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Episode Number</label>
                  <input 
                    required
                    type="number" 
                    value={episodeForm.episodeNumber}
                    onChange={e => setEpisodeForm({...episodeForm, episodeNumber: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Duration</label>
                  <input 
                    type="text" 
                    value={episodeForm.duration}
                    onChange={e => setEpisodeForm({...episodeForm, duration: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                    placeholder="2h 15m"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Thumbnail URL</label>
                <input 
                  required
                  type="url" 
                  value={episodeForm.thumbnail}
                  onChange={e => setEpisodeForm({...episodeForm, thumbnail: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Video Player URL</label>
                <input 
                  required
                  type="url" 
                  value={episodeForm.videoUrl}
                  onChange={e => setEpisodeForm({...episodeForm, videoUrl: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3390ec] outline-none transition-all"
                  placeholder="https://embed.video/..."
                />
              </div>
            </div>
            <button 
              disabled={isSubmitting || !episodeForm.seriesId}
              type="submit" 
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-200 active:scale-95 transition-transform disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
              Publish Episode
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
