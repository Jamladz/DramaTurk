import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-white sticky top-0 z-40 w-full mx-auto border-b border-gray-100 shadow-sm">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Drama Turk</h1>
        <img 
          src="https://i.ibb.co/HLT6ZFck/file-00000000a24c81f4a775591b812d2228.png" 
          alt="Drama Turk Logo" 
          className="h-6 w-auto object-contain"
        />
      </div>
    </div>
  );
}
