import { Check, Pill, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useEffect, useState } from 'react';

export function HabitTracker({ currentHour = new Date().getHours(), currentMinute = new Date().getMinutes() }) {
  const [habits, setHabits] = useLocalStorage('dailyHabits', {
    valsartan: false,
  });
  
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // If it is past 11:15 AM and valsartan is not taken, show alert
    if ((currentHour > 11 || (currentHour === 11 && currentMinute >= 15)) && !habits.valsartan) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [currentHour, currentMinute, habits.valsartan]);

  const toggleHabit = (key) => {
    setHabits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-slate-800 rounded-xl flex flex-col shadow-lg mb-0 w-full overflow-hidden">
      {showAlert && (
        <div className="w-full bg-red-600/90 py-1 flex items-center justify-center gap-1 border-b border-red-400 transition-all duration-300">
          <AlertCircle className="w-3 h-3 text-white animate-pulse" strokeWidth={2} />
          <span className="text-white text-[10px] font-bold tracking-wide uppercase">¡Olvidaste el Valsartán!</span>
        </div>
      )}
      
      <div className="p-3">
        <h2 className="text-base font-bold text-white mb-2">Rutina Médica</h2>
        
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer group p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all duration-300 ${habits.valsartan ? 'bg-green-500 border-green-500 scale-110' : showAlert ? 'border-red-500 bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-slate-500 group-hover:border-slate-400'}`}>
                {habits.valsartan && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </div>
              <div className="flex items-center space-x-1.5">
                <Pill className={`w-3.5 h-3.5 ${habits.valsartan ? 'text-green-500' : 'text-red-400'}`} />
                <span className={`text-[13px] transition-colors ${habits.valsartan ? 'text-slate-500 line-through' : showAlert ? 'text-red-300 font-bold' : 'text-slate-200'}`}>
                  Valsartán (11:00 AM)
                </span>
              </div>
            </div>
            <input type="checkbox" className="hidden" checked={habits.valsartan} onChange={() => toggleHabit('valsartan')} />
          </label>
        </div>
      </div>
    </div>
  );
}
