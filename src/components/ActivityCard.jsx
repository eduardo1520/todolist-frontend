import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export default function ActivityCard({ activity, onDelete, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: activity.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const statusColors = {
    TODO: 'border-l-gray-400',
    DOING: 'border-l-yellow-400',
    DONE: 'border-l-green-400',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-lg shadow p-4 border-l-4 ${statusColors[activity.status]} 
        ${isDragging ? 'opacity-50 rotate-2 shadow-xl' : 'hover:shadow-md'} 
        cursor-grab active:cursor-grabbing transition`}
    >
      <h3 className="font-semibold text-gray-800 mb-1">{activity.title}</h3>
      {activity.description && (
        <p className="text-gray-500 text-sm mb-3">{activity.description}</p>
      )}
      <button
        onPointerDown={e => e.stopPropagation()}
        onClick={() => onDelete(activity.id)}
        className="text-red-400 hover:text-red-600 text-xs transition"
      >
        🗑️ Excluir
      </button>
    </div>
  )
}