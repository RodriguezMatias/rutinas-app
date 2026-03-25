import { Droplet, Plus, Minus, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function WaterProgress({ currentHour = new Date().getHours() }) {
  const [water, setWater] = useLocalStorage('dailyWater', 0);
  const target = 3000; // 3 liters in ml
  const cup = 250; // 1 glass
  const bottle = 1000; // 1 liter

  const percentage = Math.min((water / target) * 100, 100);

  let showAlert = false;
  let alertMsg = '';
  if (currentHour >= 14 && water < 1000) {
    showAlert = true;
    alertMsg = '¡Atrasado en hidratación (Mañana)!';
  } else if (currentHour >= 20 && water < 2000) {
    showAlert = true;
    alertMsg = '¡Atrasado en hidratación (Tarde)!';
  }

  return (
    <div className="bg-slate-800 rounded-xl flex flex-col shadow-lg mb-2 w-full overflow-hidden">
      {showAlert && (
        <div className="w-full bg-blue-600/90 py-1 flex items-center justify-center gap-1 border-b border-blue-400 transition-all duration-300">
          <AlertCircle className="w-3 h-3 text-white animate-pulse" strokeWidth={2} />
          <span className="text-white text-[10px] font-bold tracking-wide uppercase">{alertMsg}</span>
        </div>
      )}
      
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <Droplet className="w-3 h-3 text-blue-400" />
            Hidratación (3L)
          </h2>
          <span className="text-slate-300 font-mono text-[11px]">{water} / {target} ml</span>
        </div>

        <div className="relative h-3 bg-slate-700 rounded-full mb-4 mt-1.5 shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
          
          <div className="absolute top-0 left-1/3 w-0 h-full border-l-2 border-slate-800 z-10"></div>
          <div className="absolute top-0 left-2/3 w-0 h-full border-l-2 border-slate-800 z-10"></div>
          
          <div className="absolute top-full left-0 w-1/3 text-center text-[9px] text-slate-400 mt-0.5 font-bold">Mañana</div>
          <div className="absolute top-full left-1/3 w-1/3 text-center text-[9px] text-slate-400 mt-0.5 font-bold">Tarde</div>
          <div className="absolute top-full left-2/3 w-1/3 text-center text-[9px] text-slate-400 mt-0.5 font-bold">Noche</div>
        </div>

        <div className="flex justify-center gap-1.5">
          <button 
            onClick={() => setWater(Math.max(0, water - cup))}
            className="px-2 py-1 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title="Deshacer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setWater(water + cup)}
            className="flex flex-1 items-center justify-center gap-1 px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer text-[11px] font-medium"
          >
            <Plus className="w-3 h-3" /> Vaso
          </button>
          <button 
            onClick={() => setWater(water + bottle)}
            className="flex flex-2 items-center justify-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold transition-colors cursor-pointer shadow-md text-[11px]"
          >
            <Plus className="w-3 h-3" /> Botella (1L)
          </button>
        </div>
      </div>
    </div>
  );
}
