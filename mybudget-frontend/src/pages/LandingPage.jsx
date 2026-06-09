import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Wallet, 
  ArrowRight, 
  PieChart, 
  ShieldCheck, 
  Sun, 
  Moon,
  Sparkles,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  // === LOGIQUE DE PROFONDEUR 3D (SOURIS) INTACTE ===
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-250, 250], [15, -15]);
  const rotateY = useTransform(smoothX, [-250, 250], [-15, 15]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleGetStarted = () => navigate('/Register');

  // Variantes d'animation d'entrée originales intactes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#05050A] text-stone-800 dark:text-slate-200 transition-colors duration-500 font-sans relative overflow-hidden">
      
      {/* ==========================================
          ARRIÈRE-PLAN PROFOND (Grille & Blobs Adaptatifs)
      ========================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Grille de fond style Cyberpunk / Fine */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/5 dark:bg-blue-500/20 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full bg-amber-500/5 dark:bg-cyan-500/20 blur-[120px]"
        />
      </div>

      {/* ==========================================
          EN-TÊTE (NAVBAR) ADAPTATIF
      ========================================== */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full bg-white/60 dark:bg-[#05050A]/70 backdrop-blur-xl border-b border-stone-200/50 dark:border-white/5 z-50 transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/petit-logo.png" alt="Icône Adawn" className="h-10 md:h-12 w-auto object-contain" />
            <div className="flex flex-col justify-center">
              <span className="text-xl md:text-2xl font-extrabold text-stone-800 dark:text-white leading-none tracking-tight transition-colors">Adawn</span>
              <span className="text-[0.65rem] md:text-xs font-bold text-[#4a3728] dark:text-cyan-400 tracking-[0.2em] mt-0.5 uppercase transition-colors">Gestion Budget</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={toggleDarkMode} className="p-2.5 text-stone-700 dark:text-slate-300 hover:text-[#4a3728] dark:hover:text-white bg-white/80 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 rounded-xl transition-all duration-300 shadow-sm">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/Login" className="hidden sm:block text-sm font-bold text-stone-600 hover:text-[#4a3728] dark:text-slate-400 dark:hover:text-cyan-400 transition-colors">
              {t('landing.login', 'Se connecter')}
            </Link>
            <Link to="/Register" className="px-6 py-2.5 bg-[#4a3728] hover:bg-[#5c4431] dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-600 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5 hover:scale-105">
              {t('landing.register', "S'inscrire")}
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ==========================================
          SECTION HERO ADAPTATIVE
      ========================================== */}
      <main className="flex-1 pt-32 pb-16 flex flex-col items-center justify-center z-10 relative">
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[75vh]">
          
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-start text-left space-y-6">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 dark:bg-blue-900/30 border border-stone-200 dark:border-blue-500/30 text-[#4a3728] dark:text-cyan-400 text-sm font-bold shadow-sm transition-colors">
              <Sparkles size={16} className="animate-pulse" /> IA Financière Intégrée
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-stone-800 dark:text-white tracking-tight transition-colors">
              L'avenir de votre <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a3728] to-[#8b5a2b] dark:from-cyan-400 dark:to-blue-500">
                gestion budgétaire.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-stone-600 dark:text-slate-400 max-w-lg leading-relaxed transition-colors">
              Adawn transforme vos finances. Suivez vos dépenses, analysez vos habitudes et optimisez vos économies grâce à une interface conçue pour la performance.
            </motion.p>
            
            <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row w-full sm:w-auto gap-4">
              <button onClick={handleGetStarted} className="px-8 py-4 bg-[#4a3728] hover:bg-[#5c4431] dark:from-blue-600 dark:to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:scale-105 group relative overflow-hidden dark:bg-gradient-to-r">
                <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:animate-[shine_1.5s_ease-in-out_infinite] skew-x-12 -translate-x-full"></span>
                {t('landing.cta', 'Démarrer l\'expérience')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>

          {/* === EFFET 3D PARALLAXE MULTI-COUCHES (STRUCTURE CONSERVÉE) === */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative w-full z-10 flex items-center justify-center lg:justify-end perspective-[1200px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Conteneur principal avec la rotation 3D originale */}
            <motion.div 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-full max-w-lg cursor-default"
            >
              {/* L'image de fond (Layer 1 Adaptée) */}
              <div className="relative h-80 md:h-[450px] rounded-[2.5rem] shadow-2xl border border-stone-200/50 dark:border-white/10 overflow-hidden bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl transition-colors duration-500">
                <img src="/hh.jfif" alt="Adawn App" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent opacity-0 dark:opacity-80"></div>
              </div>

              {/* Badge Flottant 1 (Layer 2) */}
              <motion.div 
                style={{ translateZ: 80 }} 
                className="absolute -right-6 top-12 bg-white/90 dark:bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl shadow-lg border border-stone-200/50 dark:border-white/10 flex items-center gap-4 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shadow-sm">
                  <ArrowUpRight size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 dark:text-slate-400 font-bold uppercase tracking-wider">Revenus du mois</p>
                  <p className="text-lg font-extrabold text-stone-800 dark:text-white font-mono">+ 4 500 DH</p>
                </div>
              </motion.div>

              {/* Badge Flottant 2 (Layer 3) */}
              <motion.div 
                style={{ translateZ: 120 }} 
                className="absolute -left-8 bottom-16 bg-white/90 dark:bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl shadow-lg border border-stone-200/50 dark:border-white/10 flex items-center gap-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center shadow-sm">
                  <Activity size={16} className="text-[#4a3728] dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 dark:text-slate-400 font-bold uppercase tracking-wider">Budget Actif</p>
                  <div className="w-24 h-1.5 bg-stone-200 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[65%]"></div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </section>

        {/* ==========================================
            SECTION FONCTIONNALITÉS (Au Scroll / Style Harmonisé)
        ========================================== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-32 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-white tracking-tight transition-colors">
              La précision financière à l'état pur.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Wallet, color: "emerald", title: "Suivi Intuitif", desc: "Ajoutez vos revenus et dépenses en un cligne d'œil. La catégorisation n'a jamais été aussi simple et rapide." },
              { icon: PieChart, color: "blue", title: "Analytique Profonde", desc: "Visualisez vos flux financiers avec des graphiques dynamiques et générez des rapports PDF détaillés." },
              { icon: ShieldCheck, color: "rose", title: "Sécurité & Contrôle", desc: "Base de données chiffrée et architecture moderne. Vos informations financières restent strictement privées." }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-stone-200/50 dark:border-white/10 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-stone-100 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                  <feat.icon className="text-[#4a3728] dark:text-cyan-400" size={28} />
                </div>
                <h3 className="text-xl font-bold text-stone-800 dark:text-white mb-3 transition-colors">{feat.title}</h3>
                <p className="text-stone-600 dark:text-slate-400 leading-relaxed transition-colors">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white/40 dark:bg-white/[0.01] backdrop-blur-md border-t border-stone-200/50 dark:border-white/5 py-8 z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm font-medium text-stone-500 dark:text-slate-500">
          <p>© {currentYear} Adawn. Projet de Fin d'Études.</p>
        </div>
      </footer>

      {/* Style CSS original d'effet d'éclair de bouton conservé */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(12deg); }
          100% { transform: translateX(200%) skewX(12deg); }
        }
      `}} />
    </div>
  );
}