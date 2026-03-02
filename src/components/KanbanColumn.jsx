import { useDroppable } from '@dnd-kit/core'
import ActivityCard from './ActivityCard'

export default function KanbanColumn({ column, activities, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={`${column.color} rounded-xl p-4 min-h-64 transition ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-700">{column.label}</h2>
        <span className="bg-white text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
          {activities.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {activities.map(activity => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onDelete={onDelete}
          />
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          <p className="text-sm">Solte aqui</p>
        </div>
      )}
    </div>
  )
}