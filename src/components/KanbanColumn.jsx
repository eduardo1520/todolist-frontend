import { useDroppable } from '@dnd-kit/core'; // 1. Importação necessária
import ActivityCard from './ActivityCard';

export default function KanbanColumn({ column, activities, onEdit, onDelete }) {
  // 2. Registra a coluna como área de soltura (drop)
  const { setNodeRef } = useDroppable({
    id: column.id, // O ID será 'TODO', 'DOING' ou 'DONE'
  });

  return (
    <div 
      ref={setNodeRef} // 3. Aplica a referência aqui!
      className={`rounded-xl p-4 min-h-[500px] transition-colors ${column.color}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-700">{column.label}</h2>
        <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">
          {activities.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        
        {activities.length === 0 && (
          <div className="text-gray-400 text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
            Solte aqui
          </div>
        )}
      </div>
    </div>
  );
}