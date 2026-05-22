<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 selection:bg-indigo-500 selection:text-white">
    <div class="max-w-6xl mx-auto space-y-6">
      
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 gap-4 shadow-xl">
        <div>
          <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">To-do list</h1>
        </div>
        <button @click="logout" class="px-5 py-2.5 bg-slate-700 hover:bg-rose-600/20 hover:text-rose-400 font-medium rounded-xl transition-all border border-slate-600 hover:border-rose-500/30">
          Sair da Conta
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside class="space-y-6 lg:col-span-1">
          <div class="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-indigo-400">Filtrar Status</h3>
            <div class="flex flex-col gap-1">
              <button @click="filterStatus = 'all'; page = 1" :class="filterStatus === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800'" class="text-left px-3 py-2 rounded-xl text-sm transition-all">Todas</button>
              <button @click="filterStatus = 'pending'; page = 1" :class="filterStatus === 'pending' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800'" class="text-left px-3 py-2 rounded-xl text-sm transition-all">Pendentes</button>
              <button @click="filterStatus = 'completed'; page = 1" :class="filterStatus === 'completed' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800'" class="text-left px-3 py-2 rounded-xl text-sm transition-all">Concluídas</button>
            </div>
          </div>

          <div class="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-cyan-400">Categorias</h3>
            <form @submit.prevent="createCategory" class="flex gap-2">
              <input v-model="newCategoryName" type="text" placeholder="Nova cat..." required class="w-full px-3 py-1.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500">
              <button type="submit" class="p-2 bg-slate-700 hover:bg-cyan-600 text-white rounded-xl transition-all text-xs">+</button>
            </form>
            <div class="flex flex-col gap-1">
              <button @click="selectedCategory = ''; page = 1" :class="selectedCategory === '' ? 'bg-cyan-600/20 text-cyan-400 font-semibold' : 'text-slate-400'" class="text-left text-xs px-3 py-1.5 rounded-lg transition-all">📁 Todas Categorias</button>
              <button v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id; page = 1" :class="selectedCategory === cat.id ? 'bg-cyan-600/20 text-cyan-400 font-semibold' : 'text-slate-400'" class="text-left text-xs px-3 py-1.5 rounded-lg transition-all">🏷️ {{ cat.name }}</button>
            </div>
          </div>
        </aside>

        <main class="lg:col-span-3 space-y-4">
          <form @submit.prevent="createTask" class="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 flex flex-col md:flex-row gap-3 shadow-md">
            <input v-model="newTaskTitle" type="text" placeholder="O que precisa ser feito hoje?..." required class="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm">
            <select v-model="newTaskCategory" class="px-3 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none">
              <option value="">Sem Categoria</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <button type="submit" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg transition-all active:scale-95">
              Criar Tarefa
            </button>
          </form>

          <div class="space-y-2">
            <div v-for="task in paginatedTasks" :key="task.id" class="p-4 bg-slate-800/60 rounded-xl border border-slate-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-600">
              <div class="flex items-center gap-3">
                <input type="checkbox" :checked="task.completed" @change="toggleTask(task)" class="w-5 h-5 rounded-md border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900">
                <div>
                  <span :class="{'line-through text-slate-500 font-normal': task.completed, 'text-slate-200 font-medium': !task.completed}" class="text-sm transition-all">{{ task.title }}</span>
                  <span v-if="task.category_details" class="ml-2 px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px] uppercase font-bold">{{ task.category_details.name }}</span>
                </div>
              </div>
              
              <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button @click="shareTask(task.id)" class="text-xs text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-all">Compartilhar</button>
                <button @click="deleteTask(task.id)" class="text-xs text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all">Deletar</button>
              </div>
            </div>
            
            <div v-if="filteredTasks.length === 0" class="text-center py-12 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
              <p class="text-slate-500 text-sm">Nenhuma tarefa encontrada para este filtro. 😴</p>
            </div>
          </div>

          <div v-if="filteredTasks.length > 0" class="flex justify-between items-center bg-slate-800/20 p-4 rounded-xl border border-slate-800/60">
            <button :disabled="page === 1" @click="page--" class="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium disabled:opacity-30 transition-all">Anterior</button>
            <span class="text-xs text-slate-400">Página {{ page }} de {{ Math.ceil(filteredTasks.length / itemsPerPage) }}</span>
            <button :disabled="page * itemsPerPage >= filteredTasks.length" @click="page++" class="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium disabled:opacity-30 transition-all">Próxima</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      tasks: [],
      categories: [],
      newCategoryName: '',
      newTaskTitle: '',
      newTaskCategory: '',
      filterStatus: 'all',
      selectedCategory: '',
      page: 1,
      itemsPerPage: 5,
    }
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter(task => {
        const matchesStatus = this.filterStatus === 'all' || 
          (this.filterStatus === 'completed' && task.completed) || 
          (this.filterStatus === 'pending' && !task.completed);
        const matchesCategory = !this.selectedCategory || task.category === this.selectedCategory;
        return matchesStatus && matchesCategory;
      });
    },
    paginatedTasks() {
      const start = (this.page - 1) * this.itemsPerPage;
      return this.filteredTasks.slice(start, start + this.itemsPerPage);
    }
  },
  mounted() {
    this.fetchTasks();
    this.fetchCategories();
    this.fetchExternalAPI();
  },
  methods: {
    getHeaders() {
      return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
    },
    async fetchTasks() {
      try {
        const res = await axios.get('http://localhost:8000/api/tasks/', this.getHeaders());
        this.tasks = res.data;
      } catch (err) { this.logout(); }
    },
    async fetchCategories() {
      const res = await axios.get('http://localhost:8000/api/categories/', this.getHeaders());
      this.categories = res.data;
    },
    async createTask() {
      await axios.post('http://localhost:8000/api/tasks/', {
        title: this.newTaskTitle,
        category: this.newTaskCategory || null,
        completed: false
      }, this.getHeaders());
      this.newTaskTitle = '';
      this.fetchTasks();
    },
    async createCategory() {
      await axios.post('http://localhost:8000/api/categories/', { name: this.newCategoryName }, this.getHeaders());
      this.newCategoryName = '';
      this.fetchCategories();
    },
    async toggleTask(task) {
      await axios.patch(`http://localhost:8000/api/tasks/${task.id}/`, { completed: !task.completed }, this.getHeaders());
      this.fetchTasks();
    },
    async deleteTask(id) {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`, this.getHeaders());
      this.fetchTasks();
    },
    async shareTask(id) {
      const username = prompt("Com qual usuário deseja compartilhar esta tarefa?");
      if (username) {
        try {
          await axios.post(`http://localhost:8000/api/tasks/${id}/share/`, { username }, this.getHeaders());
          alert("Tarefa compartilhada com sucesso!");
        } catch {
          alert("Usuário não encontrado.");
        }
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>