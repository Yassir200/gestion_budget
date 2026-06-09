import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Home, Bus, Utensils, Gamepad2, ShoppingCart, Heart, Briefcase, GraduationCap } from 'lucide-react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';

// 💡 1. Configuration avec les vraies couleurs (Hex) et les noms d'icônes intacts
const CATEGORIES_SUGGEREES = [
  { nom: "Alimentation", icone: "Utensils", couleur: "#eab308", type: "depense" }, // Jaune
  { nom: "Transport", icone: "Bus", couleur: "#0ea5e9", type: "depense" }, // Bleu clair
  { nom: "Logement", icone: "Home", couleur: "#3b82f6", type: "depense" }, // Bleu
  { nom: "Loisirs", icone: "Gamepad2", couleur: "#10b981", type: "depense" }, // Vert
  { nom: "Courses", icone: "ShoppingCart", couleur: "#6366f1", type: "depense" }, // Indigo
  { nom: "Santé", icone: "Heart", couleur: "#ef4444", type: "depense" }, // Rouge
  { nom: "Éducation", icone: "GraduationCap", couleur: "#a855f7", type: "depense" }, // Violet
  { nom: "Salaire", icone: "Briefcase", couleur: "#10b981", type: "revenu" }, // Vert (Revenu)
];

// Fonction pour rendre la bonne icône dynamiquement
const renderIcon = (iconName) => {
  switch(iconName) {
    case 'Utensils': return <Utensils size={24} color="white" />;
    case 'Bus': return <Bus size={24} color="white" />;
    case 'Home': return <Home size={24} color="white" />;
    case 'Gamepad2': return <Gamepad2 size={24} color="white" />;
    case 'ShoppingCart': return <ShoppingCart size={24} color="white" />;
    case 'Heart': return <Heart size={24} color="white" />;
    case 'GraduationCap': return <GraduationCap size={24} color="white" />;
    case 'Briefcase': return <Briefcase size={24} color="white" />;
    default: return <Sparkles size={24} color="white" />;
  }
};

export default function WelcomeOnboarding({ onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCats, setSelectedCats] = useState(CATEGORIES_SUGGEREES);
  const [isSaving, setIsSaving] = useState(false);
  
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const checkCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data.length === 0) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Erreur vérification catégories", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkCategories();
  }, []);

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleSave = async () => {
    if (selectedCats.length === 0) {
      return Swal.fire({ 
        icon: 'warning', 
        title: 'Oups', 
        text: 'Sélectionnez au moins une catégorie.',
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        confirmButtonColor: isDarkMode ? '#06b6d4' : '#4a3728',
        borderRadius: '1.5rem'
      });
    }

    setIsSaving(true);
    try {
      // 💡 2. On envoie TOUTES les données au backend (nom, type, icone, couleur)
      await Promise.all(
        selectedCats.map(cat => 
          api.post('/categories', { 
            nom: cat.nom, 
            type: cat.type,
            icone: cat.icone,
            couleur: cat.couleur
          })
        )
      );
      
      setIsVisible(false);
      if (onComplete) onComplete(); 

      Swal.fire({
        icon: 'success',
        title: 'Espace configuré !',
        text: 'Vos catégories sont prêtes.',
        timer: 3000,
        showConfirmButton: false,
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });
      
    } catch (error) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Erreur', 
        text: "Impossible de créer les catégories.",
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 dark:bg-[#05050A]/80 backdrop-blur-md p-4 transition-all duration-500">
      <div className="bg-[#FDFBF7] dark:bg-[#0B1120] border border-stone-200 dark:border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up transition-colors duration-500">
        
        {/* HEADER MODALE ADAPTATIF */}
        <div className="bg-gradient-to-br from-[#4a3728] to-[#8b5a2b] dark:from-cyan-900/60 dark:to-purple-900/60 px-8 py-10 text-center relative overflow-hidden border-b border-[#4a3728]/10 dark:border-white/5 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md mb-4 shadow-sm">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Bienvenue sur Adawn !</h2>
            <p className="text-white/80 dark:text-cyan-100/80 text-lg font-medium">Configurons votre espace en sélectionnant vos catégories principales.</p>
          </div>
        </div>

        <div className="p-8">
          <p className="text-stone-600 dark:text-slate-400 font-medium mb-6 text-center text-sm">
            Cliquez pour sélectionner ou désélectionner (Vous pourrez les modifier plus tard).
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {CATEGORIES_SUGGEREES.map((cat, index) => {
              const isSelected = selectedCats.includes(cat);
              return (
                <button
                  key={index}
                  onClick={() => toggleCategory(cat)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                    isSelected 
                    ? 'border-[#4a3728] bg-[#4a3728]/5 dark:border-cyan-500 dark:bg-cyan-500/10 scale-105 shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                    : 'border-stone-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] hover:border-[#4a3728]/50 dark:hover:border-cyan-500/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-[#4a3728] dark:bg-cyan-500 text-white p-1 rounded-full border-2 border-[#FDFBF7] dark:border-[#0B1120] shadow-sm">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  )}
                  
                  {/* 💡 3. Utilisation de la vraie couleur (style={{backgroundColor}}) et de la vraie icône */}
                  <div 
                    className="w-12 h-12 rounded-[1rem] flex items-center justify-center mb-3 shadow-md"
                    style={{ backgroundColor: cat.couleur }}
                  >
                    {renderIcon(cat.icone)}
                  </div>
                  <span className={`font-bold text-sm transition-colors ${isSelected ? 'text-[#4a3728] dark:text-cyan-400' : 'text-stone-700 dark:text-slate-300'}`}>
                    {cat.nom}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center mt-2">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`w-full sm:w-auto px-10 py-4 text-white font-bold text-lg rounded-2xl flex justify-center items-center gap-2 transition-all shadow-lg ${
                isSaving ? 'bg-stone-400 dark:bg-slate-600 cursor-not-allowed opacity-70' : 'bg-[#4a3728] hover:bg-[#5c4431] dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:-translate-y-0.5'
              }`}
            >
              {isSaving ? 'Configuration en cours...' : `Commencer avec ${selectedCats.length} catégories`}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}