<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
    <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
      <h2 class="text-3xl font-extrabold text-white text-center mb-2">Criar Conta</h2>
      <p class="text-indigo-200 text-center text-sm mb-8">Comece a organizar sua rotina agora</p>
      
      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-indigo-200 mb-1">Nome de Usuário</label>
          <input id="reg-username" v-model="username" type="text" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Escolha um usuário">
        </div>
        <div>
          <label class="block text-sm font-medium text-indigo-200 mb-1">E-mail</label>
          <input id="reg-email" v-model="email" type="email" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="seu@email.com">
        </div>
        <div>
          <label class="block text-sm font-medium text-indigo-200 mb-1">Senha</label>
          <input id="reg-password" v-model="password" type="password" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="••••••••">
        </div>
        <button type="submit" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition transform active:scale-95">
          Cadastrar Conta
        </button>
      </form>
      
      <p class="mt-6 text-center text-sm text-slate-300">
        Já possui conta? <router-link to="/login" class="text-indigo-400 hover:underline font-medium">Fazer Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async handleRegister() {
      try {
        const response = await axios.post('http://localhost:8000/api/register/', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        
        alert('Conta criada com sucesso! Faça seu login.')
        this.$router.push('/login')
        
      } catch (err) {
        console.error('Erro completo enviado pelo servidor:', err)
        
        if (err.response && err.response.data) {
          console.error('Detalhes do Django:', err.response.data)
          alert(`Erro ao registrar: ${JSON.stringify(err.response.data)}`)
        } else {
          alert('Não foi possível conectar ao servidor.')
        }
      }
    }
  }
}
</script>