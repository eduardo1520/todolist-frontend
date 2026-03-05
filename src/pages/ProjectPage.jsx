import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';
import api from '../services/api';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        console.error("Erro ao carregar projeto", err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id, navigate]);

  // --- NOVA FUNÇÃO: CONVERTER PARA BASE64 E SALVAR NO BANCO ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file); // Converte para Base64
    reader.onload = async () => {
      const base64Image = reader.result;

      try {
        // Envia para o Java atualizar o projeto
        // O campo 'imageUrl' no Java agora vai receber a String do Base64
        await api.put(`/projects/${id}`, { 
          ...project, 
          imageUrl: base64Image 
        });

        setProject(prev => ({ ...prev, imageUrl: base64Image }));
      } catch (err) {
        console.error("Erro ao salvar imagem no banco:", err);
        alert("Erro ao salvar imagem. Verifique o tamanho do arquivo.");
      }
    };
  };

  // Funções de Modal e Atividades (Mantidas conforme seu código funcional)
  const handleOpenCreate = () => {
    setEditingActivity(null);
    setFormData({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({ title: activity.title, description: activity.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingActivity) {
        const response = await api.put(`/projects/${id}/activities/${editingActivity.id}`, formData);
        setProject(prev => ({
          ...prev,
          activities: prev.activities.map(a => a.id === editingActivity.id ? response.data : a)
        }));
      } else {
        const response = await api.post(`/projects/${id}/activities`, { ...formData, status: 'TODO' });
        setProject(prev => ({
          ...prev,
          activities: [...(prev.activities || []), response.data]
        }));
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (activityId, newStatus) => {
    try {
        // 1. Capture a resposta da API (ela contém a atividade completa e atualizada)
        const response = await api.patch(`/projects/${id}/activities/${activityId}/status`, { status: newStatus });
        const updatedActivity = response.data; 
        setProject(prev => ({
            ...prev,
            // 2. Em vez de criar um objeto na mão, use o updatedActivity que veio do backend
            activities: prev.activities.map(act => 
                act.id === activityId ? updatedActivity : act
            )
        }));
    } catch (err) { 
        console.error("Erro ao atualizar status:", err); 
        // Opcional: Notificar o usuário que a mudança falhou
    }
    };

  if (loading) return <div className="p-10 text-center text-indigo-600">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-6">
          {/* ÁREA DA IMAGEM */}
          <div className="relative group w-20 h-20 bg-white rounded-2xl shadow-sm border overflow-hidden flex items-center justify-center">
            {project.imageUrl ? (
              <img src={project.imageUrl} className="w-full h-full object-cover" alt="Capa" />
            ) : (
              <span className="text-3xl">📷</span>
            )}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              <span className="text-white text-[10px] font-bold">TROCAR</span>
            </label>
          </div>

          <div>
            <button onClick={() => navigate('/')} className="text-indigo-600 mb-2 block">← Painel</button>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          </div>
        </div>
        <button onClick={handleOpenCreate} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold">
          + Nova Atividade
        </button>
      </header>

      <KanbanBoard 
        activities={project.activities || []} 
        onStatusChange={handleStatusChange}
        onEdit={handleOpenEdit} 
        onDelete={() => {}} 
      />

      {/* Modal permanece igual... */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editingActivity ? 'Editar Atividade' : 'Nova Atividade'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Título"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
              <textarea 
                className="border p-3 rounded-lg h-24 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Descrição"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Cancelar</button>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;