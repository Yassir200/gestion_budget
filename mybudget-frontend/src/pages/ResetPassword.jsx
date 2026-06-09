import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, Sun, Moon } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const MySwal = withReactContent(Swal);

function ResetPassword() {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState('');
  const [afficherNouveau, setAfficherNouveau] = useState(false);
  const [afficherConfirmer, setAfficherConfirmer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nouveauMotDePasse !== confirmerMotDePasse) {
      return MySwal.fire({
        icon: 'error',
        title: 'Attention',
        text: 'Les mots de passe ne correspondent pas.',
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });
    }

    setIsLoading(true);

    try {
      await api.post(`/utilisateurs/reinitialiser-mot-de-passe/${token}`, { nouveauMotDePasse });
      
      await MySwal.fire({
        icon: 'success',
        title: 'Mot de passe modifié !',
        text: 'Vous pouvez maintenant vous connecter.',
        confirmButtonColor: isDarkMode ? '#06b6d4' : '#4a3728',
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });
      navigate('/Login');
    } catch (erreur) {
      MySwal.fire({
        icon: 'error',
        title: 'Erreur',
        text: erreur.response?.data?.message || "Le lien est invalide ou expiré.",
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#05050A] text-stone-800 dark:text-slate-200 flex flex-col justify-center items-center relative overflow-hidden transition-colors duration-500">
      
      {/* LUEURS ARRIÈRE-PLAN SUBTILES */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber-500/5 dark:bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 dark:bg-cyan-600/20 rounded-full blur-[120px]"></div>
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
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-stone-800 dark:text-white tracking-tight mb-2 text-center">Nouveau mot de passe</h2>
          <p className="text-stone-500 dark:text-slate-400 text-center font-medium text-sm">
            Choisissez un mot de passe fort et sécurisé.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">Nouveau mot de passe</label>
            <div className="relative">
              <input 
                type={afficherNouveau ? "text" : "password"} 
                required 
                minLength="6"
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 outline-none transition-all text-stone-800 dark:text-white font-medium shadow-inner dark:shadow-none"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setAfficherNouveau(!afficherNouveau)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-500 hover:text-[#4a3728] dark:hover:text-cyan-400 transition-colors p-1">
                {afficherNouveau ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">Confirmer le mot de passe</label>
            <div className="relative">
              <input 
                type={afficherConfirmer ? "text" : "password"} 
                required 
                value={confirmerMotDePasse}
                onChange={(e) => setConfirmerMotDePasse(e.target.value)}
                className={`w-full pl-4 pr-12 py-3.5 bg-stone-50 dark:bg-white/5 border rounded-xl outline-none focus:ring-2 transition-all text-stone-800 dark:text-white font-medium shadow-inner dark:shadow-none ${confirmerMotDePasse && nouveauMotDePasse !== confirmerMotDePasse ? 'border-rose-500 focus:ring-rose-500' : 'border-stone-200 dark:border-white/10 focus:ring-[#4a3728] dark:focus:ring-cyan-500'}`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setAfficherConfirmer(!afficherConfirmer)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-500 hover:text-[#4a3728] dark:hover:text-cyan-400 transition-colors p-1">
                {afficherConfirmer ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || (nouveauMotDePasse !== confirmerMotDePasse)}
            className={`w-full py-4 rounded-xl text-white font-bold text-base flex justify-center items-center gap-2 transition-all mt-8 shadow-lg ${
              isLoading || (nouveauMotDePasse !== confirmerMotDePasse) ? 'bg-stone-400 dark:bg-slate-600 cursor-not-allowed' : 'bg-[#4a3728] hover:bg-[#5c4431] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isLoading ? 'Modification...' : 'Confirmer la modification'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default ResetPassword;