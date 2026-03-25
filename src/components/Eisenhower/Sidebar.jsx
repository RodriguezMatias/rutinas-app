import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';

export function Sidebar({ tasks, onAddTask, onDelete, onEdit }) {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div className="w-[220px] flex-shrink-0 bg-slate-800 rounded-xl p-3 flex flex-col shadow-lg border border-slate-700/50">
      <h2 className="text-base font-bold text-white mb-3">Zona de Espera</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-1 mb-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva Tarea..."
          className="flex-1 min-w-0 bg-slate-700 text-xs rounded-lg px-2 py-1.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600/50"
        />
        <button 
          type="submit"
          disabled={!newTask.trim()}
          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <Droppable droppableId="pending">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto min-h-[200px] p-2 -mx-2 rounded-lg transition-colors
              ${snapshot.isDraggingOver ? 'bg-slate-700/50' : ''}
            `}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index} 
                onDelete={onDelete} 
                onEdit={onEdit} 
              />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center text-slate-500 text-sm mt-8 px-4">
                No hay tareas pendientes. Agregá una arriba.
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
