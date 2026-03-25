import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';

export function Quadrant({ id, title, titleColor, bgClass, tasks, onDelete, onEdit }) {
  const isFull = tasks.length >= 3;

  return (
    <div className={`flex flex-col rounded-xl overflow-hidden border-2 border-slate-700 ${bgClass} shadow-inner`}>
      <div className="p-3 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
        <h3 className={`font-bold text-sm ${titleColor}`}>{title}</h3>
        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${isFull ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-400'}`}>
          {tasks.length}/3
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[14rem] transition-colors border-2 border-dashed border-transparent
              ${snapshot.isDraggingOver ? (isFull && snapshot.draggingFromThisWith === null ? 'bg-red-900/40 border-red-500/50' : 'bg-white/5 border-slate-400/50') : ''}
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
            
            {/* Visual slots representation for emptiness */}
            {tasks.length < 3 && !snapshot.isDraggingOver && (
              <div className="h-full flex flex-col gap-2 pointer-events-none opacity-50">
                {Array.from({ length: 3 - tasks.length }).map((_, i) => (
                  <div key={`slot-${i}`} className="flex items-center justify-center h-[46px] rounded-lg border-2 border-dashed border-slate-500 bg-slate-800/40 text-slate-400 text-xs font-medium">
                    {i === 0 && tasks.length === 0 ? 'Arrastrar tareas aquí' : ''}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
