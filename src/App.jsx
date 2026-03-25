import { useEffect, useState } from 'react';
import { HabitTracker } from './components/HabitTracker';
import { WaterProgress } from './components/WaterProgress';
import { PomodoroTimer } from './components/PomodoroTimer';
import { SeedSnacks } from './components/SeedSnacks';
import { EisenhowerBoard } from './components/Eisenhower/EisenhowerBoard';
import { isNewDay, getStoredDate } from './utils/dateLogic';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [, setHabits] = useLocalStorage('dailyHabits', { valsartan: false });
  const [, setWater] = useLocalStorage('dailyWater', 0);
  const [, setSeeds] = useLocalStorage('dailySeeds', 0);

  const [realHour, setRealHour] = useState(new Date().getHours());
  const [realMinute, setRealMinute] = useState(new Date().getMinutes());

  useEffect(() => {
    // Keep real time updated
    const interval = setInterval(() => {
      setRealHour(new Date().getHours());
      setRealMinute(new Date().getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if it's a new day and reset tracking
    if (isNewDay()) {
      setHabits({ valsartan: false });
      setWater(0);
      setSeeds(0);
      console.log('New day! Habits reset.');
    }
  }, [setHabits, setWater, setSeeds]);

  const currentHour = realHour;
  const currentMinute = realMinute;

 
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-2 font-sans flex flex-col items-center">
      <header className="mb-2 text-left w-full max-w-[1400px] px-2 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Mi Día
          </h1>
          <p className="text-slate-400 text-[11px] leading-none">
            {getStoredDate() ? getStoredDate().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Hoy'}
          </p>
        </div>
      </header>

      <div className="w-full max-w-[1400px] flex flex-col md:flex-row gap-3 items-start px-2">
        {/* Columna Izquierda: Rutinas */}
        <aside className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0 flex flex-col gap-0 items-stretch">
          <PomodoroTimer />
          <WaterProgress currentHour={currentHour} />
          <SeedSnacks currentHour={currentHour} />
          <HabitTracker currentHour={currentHour} currentMinute={currentMinute} />
        </aside>

        {/* Columna Derecha: Matriz de Eisenhower */}
        <main className="flex-1 w-full bg-slate-800/20 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden min-w-[400px]">
          <EisenhowerBoard />
        </main>
      </div>
    </div>
  );
}

export default App;
