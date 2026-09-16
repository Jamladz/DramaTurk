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
    <div className="flex-1 flex flex-col bg-gray-50 text-gray-900 overflow-y-auto pb-24">
      <div className="px-4 py-4 flex items-center gap-3 sticky top-0 bg-white/90 backdrop-blur-xl z-10 border-b border-gray-100 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 transition-colors hover:bg-gray-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-br from-[#3390ec] to-blue-500 rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-bold mb-1 relative z-10 text-white">Welcome Admin</h2>
          <p className="text-white/90 text-sm relative z-10">You have full control over Drama Turk.</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <PlusCircle size={24} className="text-[#3390ec]" />
              </div>
              <span className="text-sm font-bold text-gray-700">New Series</span>
            </button>
            <button className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors active:scale-95 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Film size={24} className="text-purple-500" />
              </div>
              <span className="text-sm font-bold text-gray-700">New Episode</span>
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
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Users</span>
              <span className="text-sm font-bold text-gray-900">42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
