import { useAuth } from '../hooks/useAuth';
import { Settings, Shield, Bell, ChevronRight, HelpCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-[#3390ec] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const isAdmin = profile.username === 'sekanedr_is';

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 overflow-y-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 mt-4 border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-[#3390ec] border-4 border-white flex items-center justify-center overflow-hidden mb-4 shadow-md">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">{profile.initials}</span>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h2>
          {profile.username && (
            <p className="text-[#3390ec] text-sm font-medium">@{profile.username}</p>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="mt-6">
          <button 
            onClick={() => navigate('/admin')}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-between transition-transform active:scale-[0.98] shadow-md border border-gray-900"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Lock size={20} className="text-white" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-white">Admin Dashboard</span>
                <span className="block text-xs text-white/80">Manage series and episodes</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/50" />
          </button>
        </div>
      )}

      {/* Settings Menu */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Settings</h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Bell size={16} className="text-[#3390ec]" />
              </div>
              <span className="text-sm font-bold text-gray-700">Notifications</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <Settings size={16} className="text-purple-500" />
              </div>
              <span className="text-sm font-bold text-gray-700">Preferences</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                <Shield size={16} className="text-green-500" />
              </div>
              <span className="text-sm font-bold text-gray-700">Privacy & Security</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <HelpCircle size={16} className="text-orange-500" />
              </div>
              <span className="text-sm font-bold text-gray-700">Help & Support</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
