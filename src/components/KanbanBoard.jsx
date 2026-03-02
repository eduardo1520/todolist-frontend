import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
import ActivityCard from './ActivityCard'
import KanbanColumn from './KanbanColumn'

const COLUMNS = [
  { id: 'TODO', label: '📋 A Fazer', color: 'bg-gray-200' },
  { id: 'DOING', label: '🔄 Em Andamento', color: 'bg-yellow-100' },
  { id: 'DONE', label: '✅ Concluído', color: 'bg-green-100' },
]

export default function KanbanBoard({ activities, onStatusChange, onDelete }) {
  const [activeActivity, setActiveActivity] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  function handleDragStart(event) {
    const activity = activities.find(a => a.id === event.active.id)
    setActiveActivity(activity)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveActivity(null)

    if (!over) return

    const newStatus = over.id
    const activity = activities.find(a => a.id === active.id)

    if (activity && COLUMNS.some(c => c.id === newStatus) && activity.status !== newStatus) {
      onStatusChange(activity.id, newStatus)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            activities={activities.filter(a => a.status === column.id)}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeActivity && (
          <ActivityCard activity={activeActivity} onDelete={() => {}} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  )
}