import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { 
  Mail, 
  Phone, 
  Send, 
  MessageSquare, 
  LifeBuoy,
  ArrowLeft
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const MySwal = withReactContent(Swal);

function Support() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/utilisateurs/support', formData);

      MySwal.fire({
        icon: 'success',
        title: t('support.successTitle', 'Message envoyé !'),
        text: t('support.successText', 'Notre équipe vous répondra dans les plus brefs délais.'),
        confirmButtonColor: isDarkMode ? '#06b6d4' : '#4a3728',
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });

      setFormData({
        nom: '',
        email: '',
        telephone: '',
        message: ''
      });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: t('support.errorTitle', 'Erreur'),
        text: t('support.errorText', "Une erreur s'est produite lors de l'envoi du message."),
        confirmButtonColor: '#f43f5e',
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-screen w-full bg-[#FDFBF7] dark:bg-[#05050A] text-stone-800 dark:text-slate-200 font-sans overflow-hidden transition-colors duration-500">
      
      {/* LUEURS DE FOND AMBIANTES */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-amber-500/5 dark:bg-cyan-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-500 ${isDarkMode ? 'bg-[#05050A]/70' : 'bg-[#FDFBF7]/40'}`}></div>

      <div className="relative z-10 flex h-full">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* HEADER AVEC BOUTON RETOUR SANS SWITCH DE THÈME */}
          <header className="h-20 shrink-0 px-4 md:px-8 flex items-center bg-white/60 dark:bg-white/[0.02] border-b border-stone-200/50 dark:border-white/5 backdrop-blur-xl transition-colors duration-500">
            <button 
              onClick={() => navigate('/Profile')} 
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-stone-500 dark:text-slate-400 hover:text-[#4a3728] dark:hover:text-cyan-400 transition-colors mr-4"
            >
              <ArrowLeft size={18} /> <span>{t('support.back', 'Retour')}</span>
            </button>
            <div className="w-px h-6 bg-stone-200 dark:bg-white/10 mr-4 md:mr-6"></div>
            <div className="flex items-center gap-3">
              <LifeBuoy className="text-[#4a3728] dark:text-cyan-400" size={24} />
              <h1 className="text-xl font-bold text-stone-800 dark:text-white">{t('support.pageTitle', 'Support Client')}</h1>
            </div>
          </header>

          <div className="flex-1 px-4 md:px-8 pb-8 max-w-[1600px] w-full mx-auto overflow-y-auto custom-scrollbar pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* CARTES D'INFORMATION (Gauche) */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-6 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg dark:shadow-xl transition-colors duration-500">
                  <div className="w-12 h-12 rounded-xl bg-[#4a3728]/10 dark:bg-cyan-500/10 flex items-center justify-center text-[#4a3728] dark:text-cyan-400 mb-4 shadow-sm dark:shadow-none">
                    <Mail size={24} />
                  </div>
                  <h3 className="font-bold text-stone-800 dark:text-white mb-1 text-lg">{t('support.emailTitle', 'Email')}</h3>
                  <p className="text-sm text-stone-500 dark:text-slate-400 font-medium mb-2">{t('support.emailDesc', 'Pour toute question générale :')}</p>
                  <a href="mailto:support@mybudget.com" className="text-[#4a3728] dark:text-cyan-400 font-bold hover:underline">support@monbudget.dev</a>
                </div>

                <div className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-6 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg dark:shadow-xl transition-colors duration-500">
                  <div className="w-12 h-12 rounded-xl bg-[#4a3728]/10 dark:bg-cyan-500/10 flex items-center justify-center text-[#4a3728] dark:text-cyan-400 mb-4 shadow-sm dark:shadow-none">
                    <Phone size={24} />
                  </div>
                  <h3 className="font-bold text-stone-800 dark:text-white mb-1 text-lg">{t('support.phoneTitle', 'Appelez-nous')}</h3>
                  <p className="text-sm text-stone-500 dark:text-slate-400 font-medium mb-2">{t('support.phoneDesc', 'Lun-Ven, de 9h à 18h :')}</p>
                  <a href="tel:+212500000000" className="text-[#4a3728] dark:text-cyan-400 font-bold hover:underline">+212 5 00 00 00 00</a>
                </div>

          
              </div>

              {/* FORMULAIRE DE CONTACT (Droite) */}
              <div className="lg:col-span-2">
                <div className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg dark:shadow-xl transition-colors duration-500">
                  <h2 className="text-xl font-bold text-stone-800 dark:text-white mb-6 pb-4 border-b border-stone-200/50 dark:border-white/10">
                    {t('support.formTitle', 'Envoyez-nous un message')}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('support.nameLabel', 'Nom')}</label>
                        <input 
                          type="text" 
                          required 
                          placeholder={t('support.namePlaceholder', 'Votre nom')} 
                          className="w-full px-4 py-3 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 transition text-stone-800 dark:text-white shadow-sm dark:shadow-none"
                          value={formData.nom}
                          onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('support.emailLabel', 'Email')}</label>
                        <input 
                          type="email" 
                          required 
                          placeholder={t('support.emailPlaceholder', 'Votre adresse email')} 
                          className="w-full px-4 py-3 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 transition text-stone-800 dark:text-white shadow-sm dark:shadow-none"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('support.phoneLabel', 'Téléphone (optionnel)')}</label>
                      <input 
                        type="tel" 
                        placeholder={t('support.phonePlaceholder', 'Votre numéro de téléphone')} 
                        className="w-full px-4 py-3 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 transition text-stone-800 dark:text-white shadow-sm dark:shadow-none"
                        value={formData.telephone}
                        onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('support.messageLabel', 'Message')}</label>
                      <textarea 
                        required 
                        placeholder={t('support.messagePlaceholder', 'Expliquez votre demande en détail...')} 
                        className="w-full px-4 py-3 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 transition resize-none text-sm text-stone-800 dark:text-white custom-scrollbar h-32 shadow-sm dark:shadow-none"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-[#4a3728] hover:bg-[#5c4431] dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl transition shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          <span>{t('support.sendBtn', 'Envoyer le message')}</span>
                        </>
                      )}
                    </button>

                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;