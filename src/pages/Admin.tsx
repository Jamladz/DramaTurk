import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Film, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

export function Admin() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile?.username !== 'sekanedr_is') {
      navigate('/', { replace: true });
    }
  }, [profile, loading, navigate]);

  if (loading || profile?.username !== 'sekanedr_is') {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1c1c1e] text-white overflow-y-auto pb-24">
      <div className="px-4 py-4 flex items-center gap-3 sticky top-0 bg-[#1c1c1e]/90 backdrop-blur-xl z-10 border-b border-white/5">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-bold mb-1 relative z-10">Welcome Admin</h2>
          <p className="text-white/80 text-sm relative z-10">You have full control over Drama Turk.</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-[#2c2c2e] p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-3 hover:bg-[#3a3a3c] transition-colors active:scale-95">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <PlusCircle size={24} className="text-blue-500" />
              </div>
              <span className="text-sm font-semibold">New Series</span>
            </button>
            <button className="bg-[#2c2c2e] p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-3 hover:bg-[#3a3a3c] transition-colors active:scale-95">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Film size={24} className="text-purple-500" />
              </div>
              <span className="text-sm font-semibold">New Episode</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">System Status</h3>
          <div className="bg-[#2c2c2e] rounded-2xl border border-white/5 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Database Connection</span>
              <div className="flex items-center gap-1 text-green-500">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Total Users</span>
              <span className="text-sm font-bold text-white">42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
