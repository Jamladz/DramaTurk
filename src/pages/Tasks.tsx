import { Target } from 'lucide-react';

export function Tasks() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[70vh]">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
        <Target size={36} className="text-[#3390ec]" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Tasks</h2>
      <p className="text-gray-500 text-sm max-w-[250px] leading-relaxed">
        New tasks will appear here soon. Complete them to earn exclusive rewards.
      </p>
    </div>
  );
}
