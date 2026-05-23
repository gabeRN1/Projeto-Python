import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]); // Lista de usuários para compartilhar
  const [notifications, setNotifications] = useState([]); // Notificações

  // Estados para a Criação de Tarefas
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [categoryInput, setCategoryInput] = useState(''); // Input livre de categoria

  // Filtros e Paginação
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  // Modais e UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [taskToShare, setTaskToShare] = useState(null);
  const [selectedUserToShare, setSelectedUserToShare] = useState('');

  const navigate = useNavigate();

  const getHeaders = () => {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
  };

  // --- FUNÇÕES DE BUSCA (GET) ---
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tasks/', getHeaders());
      setTasks(res.data);
    } catch (err) {
      logout();
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/categories/', getHeaders());
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/users/', getHeaders());
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/notifications/', getHeaders());
      setNotifications(res.data);
    } catch (err) {
      console.error("Erro ao buscar notificações", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchUsers();
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  // --- FUNÇÕES DE AÇÃO (POST / PATCH / DELETE) ---
  const createTask = async (e) => {
    e.preventDefault();
    try {
      let categoryId = null;

      // Lógica inteligente para Categoria: verifica se existe, se não, cria na hora.
      if (categoryInput.trim() !== '') {
        const existingCategory = categories.find(
          cat => cat.name.toLowerCase() === categoryInput.trim().toLowerCase()
        );

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const catRes = await axios.post('http://localhost:8000/api/categories/', { name: categoryInput.trim() }, getHeaders());
          categoryId = catRes.data.id;
          fetchCategories(); // Atualiza a barra lateral
        }
      }

      await axios.post('http://localhost:8000/api/tasks/', {
        title: newTaskTitle,
        description: newTaskDescription,
        category: categoryId,
        completed: false
      }, getHeaders());
      
      // Limpa os campos e fecha o modal
      setNewTaskTitle('');
      setNewTaskDescription('');
      setCategoryInput('');
      setIsModalOpen(false); 
      fetchTasks();
    } catch (error) {
      alert("Erro ao criar a tarefa. Verifique os dados.");
    }
  };

  const createCategorySidebar = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/categories/', { name: categoryInput }, getHeaders());
    setCategoryInput('');
    fetchCategories();
  };

  const toggleTask = async (task) => {
    await axios.patch(`http://localhost:8000/api/tasks/${task.id}/`, { completed: !task.completed }, getHeaders());
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:8000/api/tasks/${id}/`, getHeaders());
    fetchTasks();
  };

  const openShareModal = (task) => {
    setTaskToShare(task);
    setIsShareModalOpen(true);
  };

  const confirmShareTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/api/tasks/${taskToShare.id}/share/`, { user_id: selectedUserToShare }, getHeaders());
      alert("Tarefa compartilhada com sucesso! O usuário foi notificado.");
      setIsShareModalOpen(false);
      setTaskToShare(null);
      setSelectedUserToShare('');
    } catch {
      alert("Erro ao compartilhar tarefa.");
    }
  };

  const markNotificationAsRead = async (id) => {
    // Exemplo de rota para marcar notificação como lida
    await axios.patch(`http://localhost:8000/api/notifications/${id}/`, { read: true }, getHeaders());
    fetchNotifications();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // --- FILTROS E PAGINAÇÃO ---
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && task.completed) || 
      (filterStatus === 'pending' && !task.completed);
    const matchesCategory = !selectedCategory || task.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  const paginatedTasks = filteredTasks.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 selection:bg-indigo-500 selection:text-white relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* CABEÇALHO COM NOTIFICAÇÕES */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 gap-4 shadow-xl relative">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">To-do list</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sino de Notificações */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-all">
                🔔
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-800"></span>
                )}
              </button>

              {/* Dropdown de Notificações */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-700 bg-slate-800/80 font-semibold text-sm">Notificações</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-xs text-slate-400 text-center">Nenhuma notificação nova.</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} onClick={() => markNotificationAsRead(notif.id)} className={`p-3 text-xs border-b border-slate-700/50 cursor-pointer hover:bg-slate-700 transition-all ${notif.read ? 'opacity-50' : 'bg-indigo-900/20'}`}>
                          <p>{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={logout} className="px-5 py-2 bg-slate-700 hover:bg-rose-600/20 hover:text-rose-400 font-medium rounded-xl transition-all border border-slate-600 hover:border-rose-500/30 text-sm">
              Sair da Conta
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="space-y-6 lg:col-span-1">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Filtrar Status</h3>
              <div className="flex flex-col gap-1">
                <button onClick={() => { setFilterStatus('all'); setPage(1); }} className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${filterStatus === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800'}`}>Todas</button>
                <button onClick={() => { setFilterStatus('pending'); setPage(1); }} className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${filterStatus === 'pending' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800'}`}>Pendentes</button>
                <button onClick={() => { setFilterStatus('completed'); setPage(1); }} className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${filterStatus === 'completed' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800'}`}>Concluídas</button>
              </div>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">Categorias</h3>
              <div className="flex flex-col gap-1">
                <button onClick={() => { setSelectedCategory(''); setPage(1); }} className={`text-left text-xs px-3 py-1.5 rounded-lg transition-all ${selectedCategory === '' ? 'bg-cyan-600/20 text-cyan-400 font-semibold' : 'text-slate-400'}`}>📁 Todas Categorias</button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setPage(1); }} className={`text-left text-xs px-3 py-1.5 rounded-lg transition-all ${selectedCategory === cat.id ? 'bg-cyan-600/20 text-cyan-400 font-semibold' : 'text-slate-400'}`}>
                    🏷️ {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 shadow-md">
              <h2 className="text-lg font-bold text-slate-200">Minhas Tarefas</h2>
              <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg transition-all active:scale-95 flex items-center gap-2">
                <span>+</span> Nova Tarefa
              </button>
            </div>

            <div className="space-y-2">
              {paginatedTasks.map(task => (
                <div key={task.id} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-600">
                  <div className="flex items-start sm:items-center gap-4 w-full">
                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} className="w-5 h-5 mt-1 sm:mt-0 rounded-md border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-base transition-all ${task.completed ? 'line-through text-slate-500 font-normal' : 'text-slate-200 font-medium'}`}>{task.title}</span>
                        {task.category_details && (
                          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px] uppercase font-bold">{task.category_details.name}</span>
                        )}
                      </div>
                      {/* Renderização da Descrição */}
                      {task.description && (
                        <p className={`text-sm mt-1 ${task.completed ? 'text-slate-600' : 'text-slate-400'}`}>{task.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button onClick={() => openShareModal(task)} className="text-xs text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-all">Compartilhar</button>
                    <button onClick={() => deleteTask(task.id)} className="text-xs text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all">Deletar</button>
                  </div>
                </div>
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                  <p className="text-slate-500 text-sm">Nenhuma tarefa encontrada para este filtro. 😴</p>
                </div>
              )}
            </div>

            {filteredTasks.length > 0 && (
              <div className="flex justify-between items-center bg-slate-800/20 p-4 rounded-xl border border-slate-800/60">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium disabled:opacity-30 transition-all">Anterior</button>
                <span className="text-xs text-slate-400">Página {page} de {totalPages}</span>
                <button disabled={page * itemsPerPage >= filteredTasks.length} onClick={() => setPage(page + 1)} className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium disabled:opacity-30 transition-all">Próxima</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODAL DE CRIAÇÃO DE TAREFA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">Criar Nova Tarefa</h3>
            <form onSubmit={createTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Título</label>
                <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} type="text" placeholder="Resumo da tarefa..." required autoFocus className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none" />
              </div>
              
              {/* Novo Campo: Descrição */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descrição (Opcional)</label>
                <textarea value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} rows="3" placeholder="Detalhes adicionais..." className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none resize-none"></textarea>
              </div>
              
              {/* Novo Campo: Input de Categoria */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Categoria (Busque ou crie uma nova)</label>
                <input 
                  list="category-options" 
                  value={categoryInput} 
                  onChange={(e) => setCategoryInput(e.target.value)} 
                  placeholder="Ex: Trabalho, Casa, Facul..." 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none" 
                />
                <datalist id="category-options">
                  {categories.map(cat => <option key={cat.id} value={cat.name} />)}
                </datalist>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-all">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all">Salvar Tarefa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOVO MODAL DE COMPARTILHAMENTO DE TAREFA */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-2">Compartilhar Tarefa</h3>
            <p className="text-xs text-slate-400 mb-6">Selecione um usuário para enviar a tarefa <strong className="text-slate-200">"{taskToShare?.title}"</strong>.</p>
            
            <form onSubmit={confirmShareTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Usuário</label>
                <select value={selectedUserToShare} onChange={(e) => setSelectedUserToShare(e.target.value)} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-cyan-500 focus:outline-none appearance-none">
                  <option value="" disabled>Selecione o destinatário...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsShareModalOpen(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-all">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl text-sm transition-all">Compartilhar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}