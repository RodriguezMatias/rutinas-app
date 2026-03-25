import { Plus, Minus, Wheat, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function SeedSnacks({ currentHour = new Date().getHours() }) {
  const [bowls, setBowls] = useLocalStorage('dailySeeds', 0);
  const target = 3;

  let showAlert = false;
  let alertMsg = '';
  if (currentHour >= 14 && bowls < 1) {
    showAlert = true;
    alertMsg = '¡Falta colación matutina!';
  } else if (currentHour >= 20 && bowls < 2) {
    showAlert = true;
    alertMsg = '¡Falta colación de tarde!';
  }

  return (
    <div className="bg-slate-800 rounded-xl flex flex-col shadow-lg mb-2 w-full overflow-hidden">
      {showAlert && (
        <div className="w-full bg-yellow-600/90 py-1 flex items-center justify-center gap-1 border-b border-yellow-400 transition-all duration-300">
          <AlertCircle className="w-3 h-3 text-white animate-pulse" strokeWidth={2} />
          <span className="text-white text-[10px] font-bold tracking-wide uppercase">{alertMsg}</span>
        </div>
      )}
      
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <Wheat className="w-3 h-3 text-yellow-500" />
            Colaciones <span className="text-[10px] text-slate-400 font-normal ml-0.5 hidden sm:inline">(Meta: {target})</span>
          </h2>
          <span className="text-slate-300 font-mono text-[11px]">{bowls} {bowls === 1 ? 'bowl' : 'bowls'}</span>
        </div>

        <div className="flex justify-between px-1 mb-3 gap-1.5">
          {Array.from({ length: Math.max(target, bowls) }).map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 h-1.5 rounded-md transition-all duration-300 ${i < bowls ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-slate-700'}`}
            />
          ))}
        </div>

        <div className="flex justify-center gap-1.5">
          <button 
            onClick={() => setBowls(Math.max(0, bowls - 1))}
            className="px-2 py-1 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title="Restar bowl"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setBowls(bowls + 1)}
            className="flex flex-1 items-center justify-center gap-1 px-3 py-1 rounded-lg bg-yellow-600 text-white hover:bg-yellow-500 shadow-md transition-colors cursor-pointer text-[11px] font-medium"
          >
            <Plus className="w-3 h-3" />
            Anotar Bowl
          </button>
        </div>
      </div>
    </div>
  );
}
