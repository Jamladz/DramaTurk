import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTelegram } from '../hooks/useTelegram';
import { Copy, Share, Users, CheckCircle2 } from 'lucide-react';

export function Referral() {
  const { profile } = useAuth();
  const { tg } = useTelegram();
  const [copied, setCopied] = useState(false);

  const referralCode = profile?.referralCode || 'ref_xxxxx';
  // Use current origin if app url not available in env
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
      <div className="bg-[#2c2c2e] rounded-3xl p-6 flex flex-col items-center text-center border border-white/5 shadow-xl mt-4">
        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
          <Users size={32} className="text-blue-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Invite Friends</h2>
        <p className="text-gray-400 text-sm mb-8 max-w-[240px]">
          Share your link and earn rewards for every friend who joins Drama Turk.
        </p>
        
        <div className="w-full bg-[#1c1c1e] rounded-2xl p-4 border border-white/5 relative mb-6">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 text-left">Your Referral Link</p>
          <div className="flex items-center gap-3">
            <p className="text-sm text-white truncate flex-1 text-left font-mono">{botLink}</p>
            <button 
              onClick={handleCopy}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors text-white shrink-0"
            >
              {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          <Share size={20} />
          Share to Telegram
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-4 px-2">Referral Statistics</h3>
        <div className="bg-[#2c2c2e] rounded-2xl p-5 border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Invited Users</p>
            <p className="text-3xl font-bold text-white">{profile?.invitedCount || 0}</p>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
            <Users size={24} className="text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
