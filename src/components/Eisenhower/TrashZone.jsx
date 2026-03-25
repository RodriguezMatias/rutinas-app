import { Trash2 } from 'lucide-react';
import { Droppable } from '@hello-pangea/dnd';

export function TrashZone() {
  return (
    <Droppable droppableId="trash">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`mt-4 p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all
            ${snapshot.isDraggingOver ? 'bg-red-900/40 border-red-500 text-red-300 scale-[1.02]' : 'bg-slate-800/50 border-slate-600 text-slate-500'}
          `}
        >
          <Trash2 className={`w-8 h-8 mb-2 transition-transform ${snapshot.isDraggingOver ? 'animate-bounce text-red-400' : ''}`} />
          <span className="text-sm font-bold uppercase tracking-wider">
            {snapshot.isDraggingOver ? 'Soltar para eliminar' : 'Arrastrar aquí para eliminar'}
          </span>
          {/* We hide the placeholder because we don't want items to physically "stay" in the trash UI */}
          <div className="hidden">{provided.placeholder}</div>
        </div>
      )}
    </Droppable>
  );
}
