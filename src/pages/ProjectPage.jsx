import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import KanbanBoard from '../components/KanbanBoard'
import { activityService } from '../services/activityService'
import { projectService } from '../services/projectService'

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [activities, setActivities] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    const [projectRes, activitiesRes] = await Promise.all([
      projectService.findById(id),
      activityService.findAll(id)
    ])
    setProject(projectRes.data)
    setActivities(activitiesRes.data)
  }

  async function handleCreate(e) {
    e.preventDefault()
    await activityService.create(id, { title, description, status: 'TODO' })
    setTitle('')
    setDescription('')
    setShowForm(false)
    loadData()
  }

  async function handleStatusChange(activityId, status) {
    await activityService.updateStatus(id, activityId, status)
    loadData()
  }

  async function handleDelete(activityId) {
    if (confirm('Excluir esta atividade?')) {
      await activityService.delete(id, activityId)
      loadData()
    }
  }

  if (!project) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400 text-lg">Carregando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 transition">
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
          {project.finished && (
            <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
              ✅ Finalizado
            </span>
          )}
        </div>
        <p className="text-gray-500 mb-8 ml-16">{project.description}</p>

        {/* Botão nova atividade */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Nova Atividade
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Nova Atividade</h2>
            <input
              type="text"
              placeholder="Título da atividade *"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Salvar
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Kanban Board */}
        <KanbanBoard
          activities={activities}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />

      </div>
    </div>
  )
}