import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tag, ArrowRightLeft, Menu, X, Wallet } from 'lucide-react'; 
import { useTranslation } from 'react-i18next'; 
import api from '../services/api'; 

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { t } = useTranslation(); 
  
  const [isOpen, setIsOpen] = useState(false); 

  const isActive = (path) => location.pathname === path;

  const [user, setUser] = useState({ nom: 'Chargement...', email: '', avatar: '' });

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/utilisateurs/me'); 
      const userData = {
        nom: res.data.nom || 'Utilisateur',
        email: res.data.email,
        avatar: res.data.avatar || '' 
      };
      setUser(userData);
      localStorage.setItem('utilisateur', JSON.stringify(userData)); 
    } catch (err) {
      console.error("Erreur récupération utilisateur", err);
      const storedUser = localStorage.getItem('utilisateur');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    const handleProfileUpdate = () => {
      const storedUser = localStorage.getItem('utilisateur');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    
    window.addEventListener('profilMisAJour', handleProfileUpdate);
    return () => window.removeEventListener('profilMisAJour', handleProfileUpdate);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* BOUTON BURGER MOBILE ET TABLETTE (Adaptatif) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 left-4 z-50 p-2.5 bg-white/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl backdrop-blur-md text-stone-800 dark:text-white transition-colors duration-500 shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* OVERLAY SOMBRE MOBILE (Adaptatif) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden fixed inset-0 bg-stone-900/40 dark:bg-[#05050A]/80 backdrop-blur-sm z-40 transition-opacity"
        ></div>
      )}

      {/* CONTENEUR SIDEBAR : NEO-GLASSMORPHISM (Clair / Sombre) */}
      <div className={`fixed inset-y-0 left-0 z-40 w-68 bg-white/60 dark:bg-[#05050A]/20 backdrop-blur-xl border-r border-stone-200/50 dark:border-white/5 shadow-xl dark:shadow-2xl dark:shadow-black/50 flex flex-col transition-all duration-500 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* EN-TÊTE SIDEBAR : LOGO ET NOM APPLICATION */}
        <div className="h-20 shrink-0 px-6 flex items-center border-b border-stone-200/50 dark:border-white/5 mt-14 lg:mt-0 transition-colors duration-500">
          {/* Logo Cuivre/Or en Clair -> Néon Cyan/Violet en Sombre */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4a3728] to-[#8b5a2b] dark:from-cyan-400 dark:to-purple-600 flex items-center justify-center shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.4)] mr-3 transition-colors duration-500">
            <Wallet className="text-white" size={20} />
          </div>
          <span className="font-black text-2xl tracking-tight text-stone-800 dark:text-white transition-colors duration-500">MyBudget</span>
        </div>

        {/* WIDGET UTILISATEUR EN EFFET VERRE SÉLECTIONNABLE */}
        <div 
          onClick={() => handleNavigate('/Profile')} 
          title={t('profile.pageTitle', 'Accéder à mon Profil')}
          className="px-5 py-4 mx-4 mt-6 mb-6 bg-white/50 dark:bg-white/[0.02] hover:bg-white/80 dark:hover:bg-white/[0.06] rounded-2xl border border-stone-200/50 dark:border-white/5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.nom.replace(' ', '+')}&background=eff6ff&color=2563eb&bold=true`} 
                alt="Avatar" 
                className="w-11 h-11 rounded-full border-2 border-white dark:border-white/10 shadow-md group-hover:scale-105 transition-transform duration-300 object-cover" 
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#05050A] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="text-sm font-bold text-stone-800 dark:text-slate-200 truncate group-hover:text-[#4a3728] dark:group-hover:text-cyan-400 transition-colors duration-300">
                {user.nom}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate w-full block transition-colors duration-300">
                {user.email || "Chargement..."}
              </p>
            </div>
          </div>
        </div>
        
        {/* MENU PRINCIPAL DE NAVIGATION (Marron en clair, Néon en sombre) */}
        <nav className="flex-1 px-4 flex flex-col overflow-y-auto custom-scrollbar gap-2">
          <div 
            onClick={() => handleNavigate('/Dashboard')} 
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-300 ${
              isActive('/Dashboard') 
                ? 'bg-stone-100 text-[#4a3728] border border-stone-200/80 shadow-sm dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20 dark:shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] dark:drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]' 
                : 'text-stone-500 hover:bg-white/50 hover:text-stone-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white hover:translate-x-1'
            }`}
          >
            <LayoutDashboard size={18} /> {t('sidebar.dashboard', 'Dashboard')}
          </div>
          
          <div 
            onClick={() => handleNavigate('/Transactions')} 
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-300 ${
              isActive('/Transactions') 
                ? 'bg-stone-100 text-[#4a3728] border border-stone-200/80 shadow-sm dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20 dark:shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] dark:drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]' 
                : 'text-stone-500 hover:bg-white/50 hover:text-stone-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white hover:translate-x-1'
            }`}
          >
            <ArrowRightLeft size={18} /> {t('sidebar.transactions', 'Transactions')}
          </div>
          
          <div 
            onClick={() => handleNavigate('/Categories')} 
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-300 ${
              isActive('/Categories') 
                ? 'bg-stone-100 text-[#4a3728] border border-stone-200/80 shadow-sm dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20 dark:shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] dark:drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]' 
                : 'text-stone-500 hover:bg-white/50 hover:text-stone-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white hover:translate-x-1'
            }`}
          >
            <Tag size={18} /> {t('sidebar.categories', 'Catégories')}
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;