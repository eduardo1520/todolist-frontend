import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { activityService } from '../services/activityService'
import { projectService } from '../services/projectService'

const statusIcon = { TODO: '📋', DOING: '🔄', DONE: '✅' }
const statusLabel = { TODO: 'A Fazer', DOING: 'Em Andamento', DONE: 'Concluído' }
const statusColor = {
  TODO: 'text-gray-500',
  DOING: 'text-yellow-600',
  DONE: 'text-green-600 line-through',
}

export default function HomePage() {
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [activitiesMap, setActivitiesMap] = useState({})
  const [loadingId, setLoadingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const res = await projectService.findAll()
    setProjects(res.data)
  }

  async function handleCreate(e) {
    e.preventDefault()
    await projectService.create({ name, description })
    setName('')
    setDescription('')
    setShowForm(false)
    loadProjects()
  }

  async function handleDelete(id) {
    if (confirm('Excluir este projeto e todas as atividades?')) {
      await projectService.delete(id)
      loadProjects()
    }
  }

  async function handleToggleAccordion(e, projectId) {
  e.stopPropagation()
  if (expandedId === projectId) {
    setExpandedId(null)
    return
  }
  setExpandedId(projectId)
  if (!activitiesMap[projectId]) {
    setLoadingId(projectId)
    const res = await activityService.findAll(projectId)
    setActivitiesMap(prev => ({ ...prev, [projectId]: res.data }))
    setLoadingId(null)
  }
}

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🗂️ Meus Projetos</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Novo Projeto
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Novo Projeto</h2>
            <input
              type="text"
              placeholder="Nome do projeto *"
              value={name}
              onChange={e => setName(e.target.value)}
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
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Lista de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-xl shadow hover:shadow-md transition">

              {/* Card Header */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base font-semibold text-gray-800">{project.name}</h2>
                                {project.finished && (
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                                    ✅ Finalizado
                                </span>
                                )}
                            </div>
                            {project.description && (
                                <p
                                title={project.description}
                                className="text-gray-500 text-sm mt-1 truncate cursor-default"
                                >
                                {project.description}
                                </p>
                            )}
                        </div>

                        {/* Ações */}
                    <div className="flex items-center gap-0 ml-2 shrink-0">
                    {project.totalActivities > 0 && (
                        <button
                        onClick={(e) => handleToggleAccordion(e, project.id)}
                        title={expandedId === project.id ? 'Ocultar atividades' : 'Ver atividades'}
                        className="p-1 text-blue-400 hover:text-blue-600 transition"
                        >
                        {expandedId === project.id ? '▲' : '▼'}
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        title="Abrir projeto"
                        className="p-1 text-blue-400 hover:text-blue-600 transition"
                    >
                        🗂️
                    </button>
                    <button
                        onClick={() => handleDelete(project.id)}
                        title="Excluir projeto"
                        className="p-1 text-red-400 hover:text-red-600 transition"
                    >
                        🗑️
                    </button>
                    </div>
                </div>

                {/* Contadores */}
                <div className="flex gap-2 text-xs mt-3 flex-wrap">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">📋 {project.totalActivities} total</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">🔄 {project.doingCount} andamento</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ {project.doneCount} feitas</span>
                </div>
              </div>

              {/* Acordeão */}
              {expandedId === project.id && (
                <div className="border-t px-6 pb-6 pt-4">
                  {loadingId === project.id ? (
                    <p className="text-gray-400 text-sm">Carregando...</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {activitiesMap[project.id]?.map(activity => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3 text-sm py-2 border-b last:border-0"
                        >
                          <span>{statusIcon[activity.status]}</span>
                          <span className={`flex-1 ${statusColor[activity.status]}`}>
                            {activity.title}
                          </span>
                          <span className={`text-xs font-medium ${statusColor[activity.status]}`}>
                            {statusLabel[activity.status]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg">Nenhum projeto ainda. Crie o primeiro!</p>
          </div>
        )}
      </div>
    </div>
  )
}