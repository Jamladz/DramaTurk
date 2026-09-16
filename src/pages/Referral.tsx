import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTelegram } from '../hooks/useTelegram';
import { Copy, Share, Users, CheckCircle2 } from 'lucide-react';

export function Referral() {
  const { profile } = useAuth();
  const { tg } = useTelegram();
  const [copied, setCopied] = useState(false);

  const referralCode = profile?.referralCode || 'ref_xxxxx';
  const botLink = `https://t.me/DramaTurk_bot?startapp=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(botLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
      }
    });
  };

  const handleShare = () => {
    const text = `Watch Turkish Series on Drama Turk! Use my link: ${botLink}`;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(botLink)}&text=${encodeURIComponent('Watch Turkish Series on Drama Turk!')}`);
    } else if (navigator.share) {
      navigator.share({
        title: 'Drama Turk',
        text: 'Watch Turkish Series on Drama Turk!',
        url: botLink,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 flex flex-col items-center text-center border border-gray-100 shadow-sm mt-4">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Users size={32} className="text-[#3390ec]" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invite Friends</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-[240px]">
          Share your link and earn rewards for every friend who joins Drama Turk.
        </p>
        
        <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 relative mb-6">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 text-left">Your Referral Link</p>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-900 truncate flex-1 text-left font-mono">{botLink}</p>
            <button 
              onClick={handleCopy}
              className="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center transition-colors text-gray-600 shrink-0 shadow-sm"
            >
              {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="w-full bg-[#3390ec] hover:bg-[#2c81d6] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-sm"
        >
          <Share size={20} />
          Share to Telegram
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Referral Statistics</h3>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">Invited Users</p>
            <p className="text-3xl font-bold text-gray-900">{profile?.invitedCount || 0}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Users size={24} className="text-[#3390ec]" />
          </div>
        </div>
      </div>
    </div>
  );
}
