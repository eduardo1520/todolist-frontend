import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Estados do Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', imageUrl: '' });
  
  const [isSaving, setIsSaving] = useState(false);
  const [viewFullImage, setViewFullImage] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (e, project) => {
    e.stopPropagation();
    setIsEditing(true);
    setCurrentProjectId(project.id);
    setFormData({
      name: project.name,
      description: project.description || '',
      imageUrl: project.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleNewProjectClick = () => {
    setIsEditing(false);
    setCurrentProjectId(null);
    setFormData({ name: '', description: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0") return "---";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "---";
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit' 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing) {
        await api.put(`/projects/${currentProjectId}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert("Erro ao salvar projeto.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando projetos...</div>;

  return (
    <div style={styles.dashboard}>
      <aside style={styles.sidebar}>
        <div style={{ flex: 1 }}>
          <div style={styles.brand}>
            <h2 style={styles.logoText}>Todo<span>List</span></h2>
            <small>Você no controle</small>
          </div>
          <nav style={styles.sideNav}>
            <button style={styles.navItemActive}>📂 Meus Projetos</button>
          </nav>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span>🚪 Sair do Sistema</span>
        </button>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.topBar}>
          <div>
            <h1 style={styles.greeting}>Painel de Controle</h1>
            <p style={styles.subGreeting}>Gerencie as suas tarefas e prazos.</p>
          </div>
          <button onClick={handleNewProjectClick} style={styles.primaryBtn}>+ Criar Novo Projeto</button>
        </header>

        <section style={styles.contentBody}>
          <div style={styles.projectGrid}>
            {projects.map((project) => {
              // REGRA DE CONCLUSÃO: Verifica se todas as atividades são DONE
              const isProjectDone = project.activities?.length > 0 && 
                                    project.activities.every(a => a.status === 'DONE');

              // CALCULA A DATA DE CONCLUSÃO: Pega o finishedAt mais recente das atividades
              const completionDate = isProjectDone 
                ? project.activities.reduce((latest, act) => {
                    if (!act.finishedAt) return latest;
                    const current = new Date(act.finishedAt);
                    return current > latest ? current : latest;
                  }, new Date(0))
                : null;

              return (
                <div key={project.id} style={styles.projectCard} onClick={() => navigate(`/projects/${project.id}`)}>
                  <div style={styles.cardActions}>
                    <button style={styles.editBtn} onClick={(e) => handleEditClick(e, project)}>✏️</button>
                  </div>

                  {project.imageUrl && (
                    <img src={project.imageUrl} alt="Capa" style={styles.cardImage} />
                  )}
                  
                  <h4 style={styles.cardTitle}>{project.name}</h4>
                  <p style={styles.cardDesc}>{project.description}</p>

                  <div style={styles.dateContainer}>
                    {isProjectDone ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ ...styles.dateText, color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          ✅ Concluído em: {formatDate(completionDate)}
                        </span>
                        <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                          Criado em: {formatDate(project.createdAt)}
                        </span>
                      </div>
                    ) : (
                      <span style={styles.dateText}>
                        📅 Criado em: {formatDate(project.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div style={styles.addCard} onClick={handleNewProjectClick}>+ Novo Projeto</div>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: '20px' }}>{isEditing ? 'Editar Projeto' : 'Novo Projeto'}</h2>
            
            <div style={styles.dropzone}>
              {formData.imageUrl ? (
                <div style={styles.previewContainer}>
                  <img src={formData.imageUrl} alt="Preview" style={styles.imagePreview} />
                  <div style={styles.previewActions}>
                    <button type="button" onClick={() => setViewFullImage(formData.imageUrl)} style={styles.iconBtn}>👁️ Ver</button>
                    <button type="button" onClick={() => fileInputRef.current.click()} style={styles.iconBtn}>🔄 Trocar</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current.click()} style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Adicionar Capa</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={(e) => processFile(e.target.files[0])} accept="image/*" style={{ display: 'none' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <input style={styles.input} placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <textarea style={{...styles.input, height: '80px', resize: 'none'}} placeholder="Descrição" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelBtn}>Cancelar</button>
                <button type="submit" disabled={isSaving} style={styles.saveBtn}>
                  {isSaving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewFullImage && (
        <div style={styles.lightboxOverlay} onClick={() => setViewFullImage(null)}>
          <img src={viewFullImage} style={styles.fullImage} alt="Full Size" />
        </div>
      )}
    </div>
  );
};

const styles = {
  dashboard: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#111827', color: '#fff', padding: '30px 20px', display: 'flex', flexDirection: 'column' },
  brand: { marginBottom: '40px' },
  logoText: { fontSize: '22px', fontWeight: '800', color: '#6366F1' },
  sideNav: { display: 'flex', flexDirection: 'column', gap: '10px' },
  navItemActive: { textAlign: 'left', padding: '12px', backgroundColor: '#1F2937', color: '#fff', borderRadius: '10px', border: 'none', cursor: 'pointer' },
  logoutBtn: { padding: '12px', backgroundColor: 'transparent', color: '#FCA5A5', border: '1px solid #374151', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  mainContent: { flex: 1, padding: '50px', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' },
  greeting: { fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 },
  subGreeting: { color: '#6B7280', margin: '5px 0 0 0' },
  primaryBtn: { padding: '12px 24px', backgroundColor: '#4F46E5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  projectCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #E5E7EB', cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease' },
  cardActions: { position: 'absolute', top: '15px', right: '15px', zIndex: 10 },
  editBtn: { backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  cardImage: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' },
  cardTitle: { margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600', color: '#111827' },
  cardDesc: { fontSize: '14px', color: '#6B7280', marginBottom: '15px', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' },
  dateContainer: { paddingTop: '10px', borderTop: '1px solid #F3F4F6', minHeight: '45px' },
  dateText: { fontSize: '11px', color: '#9CA3AF', fontWeight: '600' },
  addCard: { border: '2px dashed #D1D5DB', borderRadius: '20px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modalContent: { backgroundColor: '#fff', padding: '30px', borderRadius: '25px', width: '420px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  dropzone: { height: '160px', border: '2px dashed #E5E7EB', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', backgroundColor: '#F9FAFB' },
  previewContainer: { width: '100%', height: '100%', position: 'relative' },
  imagePreview: { width: '100%', height: '100%', objectFit: 'cover' },
  previewActions: { position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '10px' },
  iconBtn: { backgroundColor: 'white', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' },
  saveBtn: { flex: 2, padding: '12px', backgroundColor: '#4F46E5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '12px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' },
  lightboxOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  fullImage: { maxWidth: '90%', maxHeight: '90%', borderRadius: '10px' },
};

export default HomePage;