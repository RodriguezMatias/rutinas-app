import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, MonitorUp, Coffee } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function PomodoroTimer() {
  const [settings, setSettings] = useLocalStorage('pomodoroSettings', {
    workDuration: 55,
    breakDuration: 5
  });
  
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft((isBreak ? settings.breakDuration : settings.workDuration) * 60);
  }, [isBreak, settings]);

  useEffect(() => {
    // Only reset timer when settings or mode change explicitly
    resetTimer();
  }, [settings, isBreak, resetTimer]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsFlashing(true);
      
      // Delay alert slightly so the styling applies first and flashes the background
      setTimeout(() => {
        if (!isBreak) {
          alert("¡Tiempo de trabajar terminado! Levantante 5 minutos.");
          setIsBreak(true);
        } else {
          alert("¡Fin de la pausa! Volvemos a enfocarnos.");
          setIsBreak(false);
        }
        setIsFlashing(false);
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDuration = isBreak ? settings.breakDuration : settings.workDuration;
  const progress = ((currentDuration * 60 - timeLeft) / (currentDuration * 60)) * 100;
  
  const spinnerFlash = isActive && timeLeft <= 10 && timeLeft > 0 && timeLeft % 2 === 0;
  const strokeDashoffset = 352 * (1 - progress/100);

  // Flashing colors based on what mode just finished
  const flashClass = isFlashing 
    ? (!isBreak ? "bg-indigo-700" : "bg-orange-700") 
    : "bg-slate-800";

  return (
    <div className={`w-full rounded-xl p-3 shadow-lg mb-2 flex flex-col items-center transition-colors duration-300 ${flashClass}`}>
      <div className="flex justify-between w-full mb-2 items-center">
        <h2 className="text-base font-bold text-white flex items-center gap-1.5">
          {isBreak ? <Coffee className="w-3 h-3 text-orange-400" /> : <MonitorUp className="w-3 h-3 text-indigo-400" />}
          {isBreak ? 'Pausa' : 'Concentración'}
        </h2>
        
        <div className="flex gap-1.5">
          <button 
            onClick={() => setIsBreak(false)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${!isBreak ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            Work
          </button>
          <button 
            onClick={() => setIsBreak(true)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${isBreak ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            Break
          </button>
        </div>
      </div>

      <div className="relative mb-3 flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64" cy="64" r="56"
            className="stroke-slate-700"
            strokeWidth="6" fill="none"
          />
          <circle
            cx="64" cy="64" r="56"
            className={`transition-all duration-1000 ease-linear ${spinnerFlash ? 'stroke-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : isBreak ? 'stroke-orange-500' : 'stroke-indigo-500'}`}
            strokeWidth="6" fill="none" strokeLinecap="round"
            strokeDasharray={352} strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-mono font-bold tracking-wider ${spinnerFlash ? 'text-white' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full justify-center">
        <button 
          onClick={toggleTimer} 
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer shadow-md hover:-translate-y-px
            ${isActive 
              ? 'bg-slate-700 text-white hover:bg-slate-600' 
              : isBreak 
                ? 'bg-orange-600 hover:bg-orange-500 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }
          `}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          {isActive ? 'Pausar' : 'Iniciar'}
        </button>

        <div className="flex gap-1.5">
          <button 
            onClick={resetTimer}
            className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            title="Reiniciar"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
