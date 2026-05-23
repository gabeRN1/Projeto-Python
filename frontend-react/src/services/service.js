import api from './api';

export const service = {
  // Usuários e Perfil
  getProfile: () => api.get('users/me/'),
  getUsers: () => api.get('users/'),

  // Tarefas
  getTasks: () => api.get('tasks/'),
  createTask: (data) => api.post('tasks/', data),
  toggleTask: (id, completed) => api.patch(`tasks/${id}/`, { completed }),
  deleteTask: (id) => api.delete(`tasks/${id}/`),
  shareTask: (taskId, userId) => api.post(`tasks/${taskId}/share/`, { user_id: userId }),

  // Categorias
  getCategories: () => api.get('categories/'),
  createCategory: (name) => api.post('categories/', { name }),

  // Notificações
  getNotifications: () => api.get('notifications/'),
  markNotificationAsRead: (id) => api.patch(`notifications/${id}/`, { read: true }),

  // Integração com API Externa (Clima e Geolocalização)
  getClimaLocal: () => api.get('clima/'),
};