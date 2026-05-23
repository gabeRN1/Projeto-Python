import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      });
      localStorage.setItem('token', response.data.access);
      navigate('/'); // Redireciona para o Dashboard
    } catch (err) {
      alert('Usuário ou senha inválidos!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">Bem-vindo de volta</h2>
        <p className="text-indigo-200 text-center text-sm mb-8">Gerencie suas tarefas</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">Usuário</label>
            <input 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text" 
              required 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" 
              placeholder="Seu usuário" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">Senha</label>
            <input 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password" 
              required 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition transform active:scale-95">
            Entrar
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-300">
          Não tem uma conta? <Link to="/register" className="text-indigo-400 hover:underline font-medium">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}