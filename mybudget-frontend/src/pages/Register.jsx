import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext'; 
import { Mail, Lock, User, Wallet, ArrowRight, AlertCircle, CheckCircle2, KeyRound, ArrowLeft, Sun, Moon } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Register() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ nom: '', email: '', motDePasse: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [etape, setEtape] = useState(1); 
  const [otpCode, setOtpCode] = useState('');

  const handleInscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/utilisateurs', formData);
      setStatus({ type: 'success', message: 'Un code a été envoyé à votre email !' });
      setEtape(2); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de l'inscription.";
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/utilisateurs/verifier-email', { email: formData.email, code: otpCode });
      
      MySwal.fire({
        icon: 'success',
        title: 'Compte activé !',
        text: 'Vous pouvez maintenant vous connecter.',
        confirmButtonColor: isDarkMode ? '#06b6d4' : '#4a3728',
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });
      navigate('/Login');
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Code invalide ou expiré.' });
    } finally {
      setLoading(false);
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

      <div className="w-full max-w-md bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-xl dark:shadow-2xl border border-stone-200/50 dark:border-white/10 relative z-10 transition-colors duration-500 mx-4 mt-12 mb-12">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4a3728] to-[#8b5a2b] dark:from-cyan-400 dark:to-purple-600 flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] mb-6 transition-colors duration-500">
            <Wallet className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-stone-800 dark:text-white tracking-tight mb-2">
            {etape === 1 ? 'Créer un compte' : 'Vérification'}
          </h2>
          <p className="text-stone-500 dark:text-slate-400 text-center font-medium">
            {etape === 1 ? 'Rejoignez MyBudget gratuitement.' : 'Entrez le code envoyé par email.'}
          </p>
        </div>

        {status.message && (
          <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 text-sm font-bold ${status.type === 'error' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'}`}>
            {status.type === 'error' ? <AlertCircle size={20} className="shrink-0" /> : <CheckCircle2 size={20} className="shrink-0" />}
            <p>{status.message}</p>
          </div>
        )}

        {etape === 1 ? (
          <form onSubmit={handleInscription} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Nom complet</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 dark:text-slate-500">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 outline-none transition-all text-stone-800 dark:text-white font-medium shadow-inner dark:shadow-none"
                  placeholder="Yassir Ait Ichou"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Adresse Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 dark:text-slate-500">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 outline-none transition-all text-stone-800 dark:text-white font-medium shadow-inner dark:shadow-none"
                  placeholder="nom@exemple.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 dark:text-slate-500">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  minLength="6"
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 outline-none transition-all text-stone-800 dark:text-white font-medium shadow-inner dark:shadow-none"
                  placeholder="Minimum 6 caractères"
                  value={formData.motDePasse}
                  onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-base flex justify-center items-center gap-2 transition-all mt-6 shadow-lg ${
                loading ? 'bg-stone-400 dark:bg-slate-600 cursor-not-allowed' : 'bg-[#4a3728] hover:bg-[#5c4431] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
            >
              {loading ? 'Création...' : (
                <>S'inscrire <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerification} className="space-y-5" noValidate>
            <div>
              <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2 text-center">Code à 6 chiffres</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-500" size={20} />
                <input 
                  type="text" 
                  required 
                  maxLength="6"
                  placeholder="123456"
                  value={otpCode} 
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} 
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 outline-none font-bold text-center text-2xl tracking-[0.5em] text-stone-800 dark:text-white shadow-inner dark:shadow-none" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || otpCode.length !== 6} 
              className={`w-full py-4 rounded-xl text-white font-bold text-base transition-all shadow-lg ${
                loading || otpCode.length !== 6 ? 'bg-stone-400 dark:bg-slate-600 cursor-not-allowed' : 'bg-[#4a3728] hover:bg-[#5c4431] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
            >
              {loading ? 'Vérification...' : 'Valider mon compte'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm font-medium text-stone-500 dark:text-slate-400">
          Vous avez déjà un compte ?{' '}
          <Link to="/Login" className="text-[#4a3728] dark:text-cyan-400 font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;