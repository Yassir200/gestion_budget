import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import api from '../services/api';
import { Mail, Lock, Wallet, ArrowRight, AlertCircle, Sun, Moon, ArrowLeft } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/utilisateurs/login', { email, motDePasse: password });
      
      // On enregistre les infos dont l'avatar immédiatement
      localStorage.setItem('utilisateur', JSON.stringify(response.data.utilisateur));
      
      login(response.data.token);
      navigate('/Dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#05050A] text-stone-800 dark:text-slate-200 flex flex-col justify-center items-center relative overflow-hidden transition-colors duration-500">
      
      {/* LUEURS ARRIÈRE-PLAN SUBTILES */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 dark:bg-cyan-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* HEADER FLOTTANT : BOUTON RETOUR ET THEME */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 rounded-xl text-sm font-bold text-stone-700 dark:text-slate-300 hover:text-[#4a3728] dark:hover:text-cyan-400 hover:bg-stone-100 dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none"
        >
          <ArrowLeft size={18} /> <span className="hidden sm:inline">Retour à l'accueil</span>
        </button>

        <button 
          onClick={toggleDarkMode} 
          className="p-3 bg-white/80 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 rounded-xl text-stone-700 dark:text-slate-300 hover:text-cyan-400 hover:bg-stone-100 dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="w-full max-w-md bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-xl dark:shadow-2xl border border-stone-200/50 dark:border-white/10 relative z-10 transition-colors duration-500 mx-4">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4a3728] to-[#8b5a2b] dark:from-cyan-400 dark:to-purple-600 flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] mb-6 transition-colors duration-500">
            <Wallet className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-stone-800 dark:text-white tracking-tight mb-2">bienvenue</h2>
          <p className="text-stone-500 dark:text-slate-400 text-center font-medium">
            Connectez-vous pour gérer votre budget.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl mb-6 text-sm font-bold animate-pulse">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">Adresse Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 dark:text-slate-500">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 outline-none transition-all text-stone-800 dark:text-white font-medium shadow-inner dark:shadow-none"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest">Mot de passe</label>
              <Link to="/ForgotPassword" className="text-xs font-bold text-[#4a3728] dark:text-cyan-400 hover:underline">
                Oublié ?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 dark:text-slate-500">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 outline-none transition-all text-stone-800 dark:text-white font-medium shadow-inner dark:shadow-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-base flex justify-center items-center gap-2 transition-all mt-8 shadow-lg ${
              loading ? 'bg-stone-400 dark:bg-slate-600 cursor-not-allowed' : 'bg-[#4a3728] hover:bg-[#5c4431] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            {loading ? 'Connexion...' : (
              <>Se connecter <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-stone-500 dark:text-slate-400">
          Nouveau sur MyBudget ?{' '}
          <Link to="/Register" className="text-[#4a3728] dark:text-cyan-400 font-bold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;