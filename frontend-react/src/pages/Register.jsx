import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password
      });
      
      alert('Conta criada com sucesso! Faça seu login.');
      navigate('/login');
      
    } catch (err) {
      console.error('Erro completo enviado pelo servidor:', err);
      
      if (err.response && err.response.data) {
        console.error('Detalhes do Django:', err.response.data);
        alert(`Erro ao registrar: ${JSON.stringify(err.response.data)}`);
      } else {
        alert('Não foi possível conectar ao servidor.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">Criar Conta</h2>
        <p className="text-indigo-200 text-center text-sm mb-8">Comece a organizar sua rotina agora</p>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">Nome de Usuário</label>
            <input 
              id="reg-username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text" 
              required 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" 
              placeholder="Escolha um usuário" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">E-mail</label>
            <input 
              id="reg-email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email" 
              required 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" 
              placeholder="seu@email.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">Senha</label>
            <input 
              id="reg-password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password" 
              required 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition transform active:scale-95">
            Cadastrar Conta
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-300">
          Já possui conta? <Link to="/login" className="text-indigo-400 hover:underline font-medium">Fazer Login</Link>
        </p>
      </div>
    </div>
  );
}