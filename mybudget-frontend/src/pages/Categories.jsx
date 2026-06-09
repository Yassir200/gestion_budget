import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext'; 
import { motion, AnimatePresence } from 'framer-motion';

import {
  LayoutDashboard, Tag, LogOut, Wallet, PlusCircle, Trash2, Pencil,
  AlertCircle, CheckCircle2, Palette, FileText, ArrowLeft, Plus, ArrowRightLeft,
  Heart, Gamepad2, Home, Utensils, GraduationCap, Bus,
  ShoppingCart, Users, Dumbbell, Shirt, Apple, Briefcase, Coffee, Plane,
  Car, Train, Ship, Bike, Fuel, Pizza, Croissant, Beer, Wine,
  Tv, Film, Music, Mic, Ticket, Smartphone, Laptop, Monitor, Mouse,
  Sofa, Bed, Bath, Lightbulb, Stethoscope, Syringe, Pill,
  Baby, Cat, Dog, CreditCard, Coins, Landmark, PiggyBank, Receipt,
  Gift, Scissors, Wrench, Umbrella, Globe
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const ICON_MAP = {
  Heart, Gamepad2, Home, Utensils, GraduationCap, Bus,
  ShoppingCart, Users, Dumbbell, Shirt, Apple, Briefcase, Coffee, Plane, FileText, Wallet,
  Car, Train, Ship, Bike, Fuel, Pizza, Croissant, Beer, Wine,
  Tv, Film, Music, Mic, Ticket, Smartphone, Laptop, Monitor, Mouse,
  Sofa, Bed, Bath, Lightbulb, Stethoscope, Syringe, Pill,
  Baby, Cat, Dog, CreditCard, Coins, Landmark, PiggyBank, Receipt,
  Gift, Scissors, Wrench, Umbrella, Globe
};

// VOS PRESETS ORIGINAUX INTACTS
const PRESET_CATEGORIES = [
  { nom: 'Santé', couleur: '#ef4444', icone: 'Heart' },
  { nom: 'Loisirs', couleur: '#10b981', icone: 'Gamepad2' },
  { nom: 'Maison', couleur: '#3b82f6', icone: 'Home' },
  { nom: 'Alimentation', couleur: '#eab308', icone: 'Utensils' },
  { nom: 'Éducation', couleur: '#d946ef', icone: 'GraduationCap' },
  { nom: 'Transport', couleur: '#0ea5e9', icone: 'Bus' },
  { nom: 'Courses', couleur: '#6366f1', icone: 'ShoppingCart' },
  { nom: 'Famille', couleur: '#f43f5e', icone: 'Users' },
  { nom: 'Sport', couleur: '#22c55e', icone: 'Dumbbell' },
  { nom: 'Voyage', couleur: '#14b8a6', icone: 'Plane' },
  { nom: 'Vêtements', couleur: '#f59e0b', icone: 'Shirt' },
];

const MySwal = withReactContent(Swal);

function Categories() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isEng = i18n.language === 'en';
  
  const { isDarkMode } = useTheme();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [uiMode, setUiMode] = useState('presets');
  const [newCat, setNewCat] = useState({ nom: '', couleur: '#3b82f6', icone: 'FileText', budgetMax: '' });

  // VOTRE PALETTE DE COULEURS ORIGINALE INTACTE
  const presetColors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#14b8a6', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'];

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleQuickAdd = async (preset) => {
    try {
      await api.post('/categories', preset);
      const motSucces = isEng ? 'successfully added!' : 'ajoutée !';
      const nomTraduit = t(`categories_list.${preset.nom}`, preset.nom);
      setStatus({ type: 'success', message: `${nomTraduit} ${motSucces}` });
      fetchCategories();
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      let errorMsg = err.response?.data?.message || t('categories.addError', isEng ? "Add error" : "Erreur d'ajout");
      if (errorMsg.includes('existante') || errorMsg.includes('utilisé')) {
        errorMsg = isEng ? 'This category already exists.' : 'Catégorie déjà existante.';
      }
      setStatus({ type: 'error', message: errorMsg });
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', newCat);
      setStatus({ type: 'success', message: t('categories.customSuccess', 'Catégorie sur-mesure créée !') });
      setNewCat({ nom: '', couleur: '#3b82f6', icone: 'FileText', budgetMax: '' });
      setUiMode('presets');
      fetchCategories();
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      let errorMsg = err.response?.data?.message || t('categories.addError', isEng ? "Creation error" : "Erreur de création");
      if (errorMsg.includes('existante') || errorMsg.includes('utilisé')) {
        errorMsg = isEng ? 'This category already exists.' : 'Catégorie déjà existante.';
      }
      setStatus({ type: 'error', message: errorMsg });
    }
  };

  const handleEditBudget = (cat) => {
    MySwal.fire({
      title: isEng ? 'Edit Monthly Budget' : 'Modifier le budget mensuel',
      text: `${t('categories.name', 'Nom')} : ${t(`categories_list.${cat.nom}`, cat.nom)}`,
      input: 'number',
      inputValue: cat.budgetMax || '',
      inputPlaceholder: isEng ? 'Ex: 1500 (MAD)' : 'Ex: 1500 (DH)',
      showCancelButton: true,
      confirmButtonColor: isDarkMode ? '#06b6d4' : '#4a3728',
      cancelButtonColor: '#8a8d91',
      confirmButtonText: isEng ? 'Save' : 'Enregistrer',
      cancelButtonText: isEng ? 'Cancel' : 'Annuler',
      background: isDarkMode ? '#0B1120' : '#ffffff',
      color: isDarkMode ? '#fff' : '#1c1917',
      borderRadius: '1.5rem',
      inputValidator: (value) => {
        if (value && Number(value) < 0) {
          return isEng ? 'Budget cannot be negative' : 'Le budget ne peut pas être négatif';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const nouveauBudget = result.value ? Number(result.value) : 0;
          await api.put(`/categories/${cat._id}`, {
            nom: cat.nom,
            couleur: cat.couleur,
            icone: cat.icone,
            budgetMax: nouveauBudget
          });
          
          MySwal.fire({
            icon: 'success',
            title: isEng ? 'Updated!' : 'Mis à jour !',
            text: isEng ? 'Budget modified successfully.' : 'Le budget a bien été modifié.',
            timer: 2000,
            showConfirmButton: false,
            background: isDarkMode ? '#0B1120' : '#ffffff',
            color: isDarkMode ? '#fff' : '#1c1917'
          });
          fetchCategories();
        } catch (err) {
          MySwal.fire({
            icon: 'error',
            title: isEng ? 'Error' : 'Erreur',
            text: isEng ? 'Could not modify budget.' : 'Impossible de modifier le budget.',
            background: isDarkMode ? '#0B1120' : '#ffffff',
            color: isDarkMode ? '#fff' : '#1c1917'
          });
        }
      }
    });
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: t('categories.deleteTitle', 'Supprimer cette catégorie ?'),
      text: t('categories.deleteWarning', "Vos transactions risquent de ne plus avoir de catégorie associée !"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#8a8d91',
      confirmButtonText: t('categories.confirmBtn', 'Oui, supprimer'),
      cancelButtonText: t('categories.cancelBtn', 'Annuler'),
      background: isDarkMode ? '#0B1120' : '#ffffff',
      color: isDarkMode ? '#fff' : '#1c1917',
      borderRadius: '1.5rem'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/categories/${id}`);
          fetchCategories();
          MySwal.fire({
            title: t('categories.deletedTitle', 'Supprimée !'),
            text: t('categories.deletedMsg', 'La catégorie a bien été effacée.'),
            icon: 'success',
            confirmButtonColor: isDarkMode ? '#06b6d4' : '#4a3728',
            background: isDarkMode ? '#0B1120' : '#ffffff',
            color: isDarkMode ? '#fff' : '#1c1917'
          });
        } catch (err) {
          MySwal.fire({
            title: t('categories.errorTitle', 'Erreur'),
            text: t('categories.errorMsg', 'Impossible de supprimer cette catégorie.'),
            icon: 'error',
            background: isDarkMode ? '#0B1120' : '#ffffff',
            color: isDarkMode ? '#fff' : '#1c1917'
          });
        }
      }
    });
  };

  const RenderIcon = ({ name, size = 24, className = "" }) => {
    const IconComponent = ICON_MAP[name] || ICON_MAP['FileText'];
    return <IconComponent size={size} className={className} />;
  };

  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const slideUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#FDFBF7] dark:bg-[#05050A] text-[#4a3728] dark:text-cyan-500 font-bold tracking-widest transition-colors duration-500">{isEng ? 'Loading...' : 'Chargement...'}</div>;

  return (
    <div className="relative h-screen w-full bg-[#FDFBF7] dark:bg-[#05050A] text-stone-800 dark:text-slate-200 font-sans overflow-hidden transition-colors duration-500">
      
      {/* LUEURS ARRIÈRE-PLAN SUBTILES SANS CANVAS 3D */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-amber-500/5 dark:bg-cyan-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-500 ${isDarkMode ? 'bg-[#05050A]/70' : 'bg-[#FDFBF7]/40'}`}></div>

      <div className="relative z-10 flex h-full">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* HEADER ÉPURÉ SANS SWITCH DE THÈME */}
          <header className="h-20 shrink-0 px-8 flex items-center bg-white/60 dark:bg-white/[0.02] border-b border-stone-200/50 dark:border-white/5 backdrop-blur-xl transition-colors duration-500">
            <h1 className="text-2xl font-black tracking-tight text-stone-800 dark:text-white">{t('categories.pageTitle', 'Paramètres des Catégories')}</h1>
          </header>

          <div className="flex-1 px-4 lg:px-8 pb-8 max-w-[1600px] w-full mx-auto overflow-hidden flex flex-col min-h-0 pt-6">
            
            {status.message && (
              <div className={`shrink-0 flex items-center gap-2 p-4 rounded-xl mb-6 text-sm font-bold ${status.type === 'success' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 border dark:border-emerald-500/20' : 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 border dark:border-rose-500/20'}`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {status.message}
              </div>
            )}

            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0 h-full">
              
              {/* PANNEAU GAUCHE : FORMULAIRES DE CRÉATION */}
              <div className="lg:col-span-1 flex flex-col min-h-0 gap-6">
                <AnimatePresence mode="wait">
                  {uiMode === 'presets' ? (
                    <motion.div key="presets" variants={slideUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg dark:shadow-xl flex-1 flex flex-col min-h-0 transition-colors duration-500">
                      <h2 className="text-xl font-bold text-stone-800 dark:text-white mb-6 shrink-0">{t('categories.quickAdd', 'Ajouter rapidement')}</h2>
                      <div className="flex-1 grid grid-cols-3 gap-y-6 gap-x-4 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                        {PRESET_CATEGORIES.map((preset) => (
                          <div key={preset.nom} onClick={() => handleQuickAdd(preset)} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-md" style={{ backgroundColor: preset.couleur }}>
                              <RenderIcon name={preset.icone} size={22} />
                            </div>
                            <span className="text-xs font-bold text-stone-700 dark:text-slate-300 text-center">
                              {t(`categories_list.${preset.nom}`, preset.nom)}
                            </span>
                          </div>
                        ))}
                        <div onClick={() => setUiMode('custom')} className="flex flex-col items-center gap-2 cursor-pointer group">
                          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-stone-100 dark:bg-white/5 text-[#4a3728] dark:text-cyan-400 shadow-sm transition-all group-hover:scale-110 group-hover:bg-stone-200 dark:group-hover:bg-cyan-500/10 border-2 border-dashed border-[#4a3728]/30 dark:border-cyan-500/30">
                            <Plus size={24} />
                          </div>
                          <span className="text-xs font-bold text-[#4a3728] dark:text-cyan-400 text-center">{t('categories.create', 'Créer')}</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="custom" variants={slideUp} initial={{ opacity: 0, y: 20 }} animate="show" exit={{ opacity: 0, y: 20 }} className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg dark:shadow-xl flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar transition-colors duration-500">
                      <button onClick={() => setUiMode('presets')} className="flex items-center gap-2 text-sm text-stone-500 dark:text-slate-400 hover:text-[#4a3728] dark:hover:text-cyan-400 mb-6 transition shrink-0">
                        <ArrowLeft size={16} /> {t('categories.back', 'Retour')}
                      </button>
                      
                      <h2 className="text-xl font-bold text-stone-800 dark:text-white mb-6 shrink-0">{t('categories.customCat', 'Catégorie Sur-mesure')}</h2>

                      <form onSubmit={handleCustomSubmit} className="space-y-6 flex-1 flex flex-col">
                        <div className="shrink-0">
                          <label className="block text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('categories.name', 'Nom')}</label>
                          <input type="text" placeholder={t('categories.namePlaceholder', 'Ex: Cinéma...')} required maxLength="20" className="w-full px-4 py-3 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 outline-none transition shadow-sm dark:shadow-none" value={newCat.nom} onChange={(e) => setNewCat({ ...newCat, nom: e.target.value })} />
                        </div>
                        
                        <div className="shrink-0 mt-4">
                          <label className="block text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">{isEng ? 'Max Monthly Budget (MAD)' : 'Budget Mensuel Max (DH)'}</label>
                          <input type="number" placeholder={isEng ? "Ex: 1500" : "Ex: 1500"} min="0" className="w-full px-4 py-3 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 outline-none transition shadow-sm dark:shadow-none" value={newCat.budgetMax} onChange={(e) => setNewCat({ ...newCat, budgetMax: e.target.value })} />
                        </div>
                        
                        <div className="shrink-0 mt-4">
                          <label className="block text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('categories.chooseIcon', 'Choisir une icône')}</label>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 bg-stone-50 dark:bg-white/5 p-3 rounded-xl border border-stone-200/50 dark:border-white/10 h-40 overflow-y-auto custom-scrollbar shadow-inner dark:shadow-none">
                            {Object.keys(ICON_MAP).map(iconKey => (
                              <div key={iconKey} onClick={() => setNewCat({ ...newCat, icone: iconKey })} className={`p-2 flex justify-center items-center rounded-lg cursor-pointer transition ${newCat.icone === iconKey ? 'text-white shadow-md scale-110' : 'text-stone-400 dark:text-slate-500 hover:text-stone-800 dark:hover:text-white'}`} style={newCat.icone === iconKey ? { backgroundColor: newCat.couleur } : {}}>
                                <RenderIcon name={iconKey} size={20} />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="shrink-0 mt-4">
                          <label className="block text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <Palette size={14} /> {t('categories.color', 'Couleur')}
                          </label>
                          <div className="grid grid-cols-6 gap-2 flex-wrap mb-3">
                            {presetColors.map(color => (
                              <div key={color} onClick={() => setNewCat({ ...newCat, couleur: color })} className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${newCat.couleur === color ? 'scale-125 ring-2 ring-offset-2 ring-offset-[#FDFBF7] dark:ring-offset-[#0B1120] ring-[#4a3728] dark:ring-cyan-400' : 'hover:scale-110'}`} style={{ backgroundColor: color }} />
                            ))}
                          </div>
                        </div>

                        <button type="submit" className="mt-auto w-full bg-[#4a3728] hover:bg-[#5c4431] dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl transition shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-sm shrink-0">
                          {t('categories.createBtn', 'Créer la catégorie')}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PANNEAU DROIT : LISTE DES CATÉGORIES EXISTANTES */}
              <motion.div variants={slideUp} className="lg:col-span-2 flex flex-col min-h-0">
                <div className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg dark:shadow-xl flex-1 flex flex-col min-h-0 transition-colors duration-500">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <h2 className="text-xl font-bold text-stone-800 dark:text-white">{t('categories.yourCategories', 'Vos Catégories')}</h2>
                    <span className="bg-[#4a3728]/10 text-[#4a3728] dark:bg-cyan-500/10 dark:text-cyan-400 border border-[#4a3728]/20 dark:border-cyan-500/20 px-3 py-1 rounded-full text-xs font-bold shadow-sm dark:shadow-none">{categories.length} {t('categories.total', 'total')}</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categories.map(cat => (
                        /* ✅ CORRECTION DÉFINITIVE DU HOVER APPLIQUÉE ICI */
                        <div key={cat._id} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 hover:bg-stone-100 dark:hover:bg-white/10 rounded-2xl transition-colors group shadow-sm dark:shadow-none">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: cat.couleur || '#cbd5e1' }}>
                              <RenderIcon name={cat.icone} size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-stone-800 dark:text-white text-base leading-tight">
                                {t(`categories_list.${cat.nom}`, cat.nom)}
                              </h4>
                              <p className="text-xs text-stone-500 dark:text-slate-400 font-medium mt-0.5">
                                {cat.budgetMax > 0 
                                  ? (isEng ? `Budget: ${cat.budgetMax} MAD` : `Budget: ${cat.budgetMax} DH`) 
                                  : (isEng ? 'No limit' : 'Pas de limite')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button onClick={() => handleEditBudget(cat)} className="text-stone-400 dark:text-slate-400 hover:text-[#4a3728] dark:hover:text-cyan-400 transition-colors p-2 bg-white/80 dark:bg-white/10 rounded-xl shadow-sm dark:shadow-none" title={isEng ? 'Edit Budget' : 'Modifier le budget'}>
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete(cat._id)} className="text-stone-400 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-2 bg-white/80 dark:bg-white/10 rounded-xl shadow-sm dark:shadow-none" title={t('categories.deleteTitle', 'Supprimer')}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {categories.length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center py-12 text-stone-400 dark:text-slate-500 italic">
                          <Tag size={48} className="mx-auto mb-4 opacity-20" />
                          <p>{t('categories.empty', 'Votre catalogue de catégories est vide.')}</p>
                          <p className="text-sm mt-2">{t('categories.emptyDesc', 'Cliquez sur une icône à gauche pour commencer.')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;