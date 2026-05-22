<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
    <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
      <h2 class="text-3xl font-extrabold text-white text-center mb-2">Bem-vindo de volta</h2>
      <p class="text-indigo-200 text-center text-sm mb-8">Gerencie suas tarefas</p>
      
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-indigo-200 mb-1">Usuário</label>
          <input id="username" v-model="username" type="text" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Seu usuário">
        </div>
        <div>
          <label class="block text-sm font-medium text-indigo-200 mb-1">Senha</label>
          <input id="password" v-model="password" type="password" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="••••••••">
        </div>
        <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition transform active:scale-95">
          Entrar
        </button>
      </form>
      
      <p class="mt-6 text-center text-sm text-slate-300">
        Não tem uma conta? <router-link to="/register" class="text-indigo-400 hover:underline font-medium">Cadastre-se</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() { return { username: '', password: '' } },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:8000/api/token/', {
          username: this.username,
          password: this.password
        })
        localStorage.setItem('token', response.data.access)
        this.$router.push('/')
      } catch (err) {
        alert('Usuário ou senha inválidos!')
      }
    }
  }
}
</script>