import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-[#1c1c1e] sticky top-0 z-40 w-full mx-auto">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">🎬</span>
        <h1 className="text-xl font-bold text-white tracking-tight">Drama Turk</h1>
      </div>
    </div>
  );
}
