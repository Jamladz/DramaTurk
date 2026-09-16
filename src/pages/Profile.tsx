import { useAuth } from '../hooks/useAuth';
import { Settings, Shield, Bell, ChevronRight, HelpCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const isAdmin = profile.username === 'sekanedr_is';

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 overflow-y-auto">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#2c2c2e] to-[#252527] rounded-3xl p-6 mt-4 border border-white/5 shadow-xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-blue-600 border-4 border-[#1c1c1e] flex items-center justify-center overflow-hidden mb-4 shadow-lg">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">{profile.initials}</span>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1">{fullName}</h2>
          {profile.username && (
            <p className="text-blue-400 text-sm font-medium">@{profile.username}</p>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="mt-6">
          <button 
            onClick={() => navigate('/admin')}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-between transition-transform active:scale-[0.98] shadow-lg border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center">
                <Lock size={20} className="text-white" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-white">Admin Dashboard</span>
                <span className="block text-xs text-white/70">Manage series and episodes</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/50" />
          </button>
        </div>
      )}

      {/* Settings Menu */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Settings</h3>
        <div className="bg-[#2c2c2e] rounded-2xl border border-white/5 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 bg-white/0 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Bell size={16} className="text-blue-500" />
              </div>
              <span className="text-sm font-medium text-white">Notifications</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-white/0 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Settings size={16} className="text-purple-500" />
              </div>
              <span className="text-sm font-medium text-white">Preferences</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-white/0 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Shield size={16} className="text-green-500" />
              </div>
              <span className="text-sm font-medium text-white">Privacy & Security</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-white/0 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <HelpCircle size={16} className="text-orange-500" />
              </div>
              <span className="text-sm font-medium text-white">Help & Support</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
