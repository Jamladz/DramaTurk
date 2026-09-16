import { NavLink } from 'react-router-dom';
import { Home, Target, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { useTelegram } from '../hooks/useTelegram';
import { useAuth } from '../hooks/useAuth';

export function BottomNav() {
  const { tg } = useTelegram();
  const { profile } = useAuth();
  const safeAreaBottom = tg?.themeParams?.bg_color ? 'env(safe-area-inset-bottom, 16px)' : '16px';

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tasks', icon: Target, label: 'Tasks' },
    { to: '/referral', icon: Users, label: 'Referral' },
  ];

  return (
    <div 
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 pointer-events-none"
      style={{ paddingBottom: safeAreaBottom }}
    >
      <div className="flex items-center gap-3 px-4 pb-4 pointer-events-auto">
        {/* Main Floating Pill */}
        <div className="flex-1 flex items-center justify-around h-16 bg-[#2c2c2e]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                  isActive ? "text-blue-500" : "text-gray-500 hover:text-gray-300"
                )
              }
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Separated Profile Avatar Button */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            clsx(
              "w-16 h-16 shrink-0 rounded-full flex flex-col items-center justify-center border transition-all shadow-2xl overflow-hidden",
              isActive 
                ? "border-blue-500 ring-2 ring-blue-500/30" 
                : "border-white/10 opacity-90 hover:opacity-100",
              !profile?.photoUrl && "bg-gradient-to-br from-[#3a3a3c] to-[#2c2c2e]" // Fallback background if no photo
            )
          }
        >
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className={clsx(
              "text-lg font-bold text-white",
            )}>
              {profile?.initials || '..'}
            </span>
          )}
        </NavLink>
      </div>
    </div>
  );
}
