import { DragDropContext } from '@hello-pangea/dnd';
import { Quadrant } from './Quadrant';
import { Sidebar } from './Sidebar';
import { TrashZone } from './TrashZone';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const INITIAL_DATA = {
  pending: [
    { id: 't-1', content: 'Revisión trimestral' },
    { id: 't-2', content: 'Hacer ejercicio' }
  ],
  q1: [],
  q2: [],
  q3: [],
  q4: []
};

// Generate UUID for new tasks
const generateId = () => Math.random().toString(36).substr(2, 9);

export function EisenhowerBoard() {
  const [data, setData] = useLocalStorage('eisenhowerTasks', INITIAL_DATA);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    // Handle Trash drop
    if (destination.droppableId === 'trash') {
      const sourceList = Array.from(data[source.droppableId]);
      sourceList.splice(source.index, 1);
      
      setData({
        ...data,
        [source.droppableId]: sourceList
      });
      return;
    }

    // Handle Quadrant constraints (max 3 items per quadrant except pending)
    if (destination.droppableId !== 'pending' && destination.droppableId !== source.droppableId) {
      if (data[destination.droppableId].length >= 3) {
        // Cancel the drop visually by not modifying state
        return;
      }
    }

    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(data[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setData({
        ...data,
        [source.droppableId]: items
      });
    } else {
      // Moving from one list to another
      const sourceItems = Array.from(data[source.droppableId]);
      const destItems = Array.from(data[destination.droppableId]);
      
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setData({
        ...data,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      });
    }
  };

  const handleAddTask = (content) => {
    setData((prev) => ({
      ...prev,
      pending: [{ id: generateId(), content }, ...prev.pending]
    }));
  };

  const handleDeleteTask = (taskId) => {
    const newData = { ...data };
    Object.keys(newData).forEach(key => {
      newData[key] = newData[key].filter(t => t.id !== taskId);
    });
    setData(newData);
  };

  const handleEditTask = (taskId) => {
    // A simple prompt for editing since the user asked for a quick edit functional
    let oldContent = '';
    let foundKey = '';
    
    Object.keys(data).forEach(key => {
      const t = data[key].find(task => task.id === taskId);
      if (t) {
        oldContent = t.content;
        foundKey = key;
      }
    });

    const newContent = window.prompt('Editar tarea:', oldContent);
    if (newContent && newContent.trim() !== '' && newContent !== oldContent) {
      const newList = data[foundKey].map(t => 
        t.id === taskId ? { ...t, content: newContent.trim() } : t
      );
      setData(prev => ({ ...prev, [foundKey]: newList }));
    }
  };

  return (
    <div className="w-full flex gap-3 p-3">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Main Matrix Area */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-[400px]">
            <Quadrant 
              id="q1" 
              title="Importante y Urgente" 
              titleColor="text-slate-100"
              bgClass="bg-slate-600/30" 
              tasks={data.q1 || []}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
            <Quadrant 
              id="q2" 
              title="Importante y NO Urgente" 
              titleColor="text-orange-400"
              bgClass="bg-orange-900/10" 
              tasks={data.q2 || []}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
            <Quadrant 
              id="q3" 
              title="NO Importante y Urgente" 
              titleColor="text-yellow-400"
              bgClass="bg-yellow-900/10" 
              tasks={data.q3 || []}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
            <Quadrant 
              id="q4" 
              title="NO Importante y NO Urgente" 
              titleColor="text-blue-400"
              bgClass="bg-blue-900/10" 
              tasks={data.q4 || []}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          </div>
          <TrashZone />
        </div>

        {/* Sidebar */}
        <Sidebar 
          tasks={data.pending || []} 
          onAddTask={handleAddTask}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
      </DragDropContext>
    </div>
  );
}
