import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export default function ActivityCard({ activity, onEdit, onDelete, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: activity.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const statusColors = {
    TODO: 'border-l-gray-300',
    DOING: 'border-l-blue-500',
    DONE: 'border-l-green-500',
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    try {
      const cleanDateString = dateString.split('.')[0]; 
      const date = new Date(cleanDateString);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return null;
    }
  };

  const renderDateBadge = () => {
    if (activity.status === 'DONE' && activity.finishedAt) {
      return (
        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
          ✅ Concluído: {formatDateTime(activity.finishedAt)}
        </span>
      );
    }
    if (activity.status === 'DOING' && activity.startedAt) {
      return (
        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
          🚀 Iniciado: {formatDateTime(activity.startedAt)}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
        📅 Criado: {formatDateTime(activity.createdAt)}
      </span>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      // REMOVIDO: onClick global removido para não atrapalhar o Drag
      className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${statusColors[activity.status]} 
        ${isDragging ? 'opacity-50 rotate-2 shadow-xl z-50' : 'hover:shadow-md'} 
        cursor-grab active:cursor-grabbing transition group mb-3 select-none relative`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 leading-tight pr-8">{activity.title}</h3>
        
        {/* BOTÃO EDITAR (Lápis) */}
        {activity.status !== 'DONE' && (
            <button
            onPointerDown={e => e.stopPropagation()} // Impede o início do drag ao clicar no botão
            onClick={(e) => {
                e.stopPropagation();
                onEdit(activity);
            }}
            className="absolute top-3 right-3 text-gray-300 hover:text-blue-500 transition-colors p-1"
            title="Editar atividade"
            >
            ✏️
            </button>)}
      </div>

      {activity.description && (
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{activity.description}</p>
      )}

      <div className="flex flex-col gap-3 mt-2">
        <div>{renderDateBadge()}</div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
          {activity.status !== "DONE" && (
          <button
            onPointerDown={e => e.stopPropagation()} 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(activity.id);
            }}
            className="text-gray-300 hover:text-red-500 transition-colors px-1"
            title="Excluir atividade"
          >
            🗑️
          </button>)}
          
          <span className="text-[9px] text-gray-400 font-black tracking-widest uppercase">
            {activity.status}
          </span>
        </div>
      </div>
    </div>
  )
}