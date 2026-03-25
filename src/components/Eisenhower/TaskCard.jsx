import { Draggable } from '@hello-pangea/dnd';
import { Pencil, X } from 'lucide-react';

export function TaskCard({ task, index, onDelete, onEdit }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group flex items-start justify-between p-2 mb-2 rounded-lg text-sm shadow-sm transition-all cursor-grab active:cursor-grabbing border hover:scale-[1.01] hover:shadow-md
            ${snapshot.isDragging ? 'bg-indigo-600 border-indigo-500 text-white z-50 shadow-2xl scale-[1.05] ring-2 ring-indigo-400 rotate-1' : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100'}
          `}
        >
          <span className="flex-1 min-w-0 break-words whitespace-pre-wrap text-left text-[13px] leading-snug pr-2 select-none">
            {task.content}
          </span>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(task.id)}
              className="p-1 rounded bg-slate-800 text-blue-400 hover:text-blue-300 transition-colors"
              title="Editar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              className="p-1 rounded bg-slate-800 text-red-400 hover:text-red-300 transition-colors"
              title="Eliminar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
