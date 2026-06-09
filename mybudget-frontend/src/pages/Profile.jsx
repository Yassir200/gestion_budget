import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Globe, ChevronDown, Sun, Moon, Save, Lock, AlertTriangle, Eye, EyeOff, LogOut, LifeBuoy, Camera } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../services/api'; 

const MySwal = withReactContent(Swal);

const formaterNom = (nom) => {
    if (!nom) return "";
    let mots = nom.split(' ');
    let motsFormates = mots.map(mot => mot.slice(0, 1).toUpperCase() + mot.slice(1).toLowerCase());
    return motsFormates.join(' ');
};

function Profile() {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const languages = [
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'en', label: 'English', flag: 'GB' }
  ];
  const currentLangObj = languages.find(l => l.code === i18n.language?.substring(0, 2)) || languages[0];

  const [utilisateurInitial, setUtilisateurInitial] = useState({ nom: '', email: '', avatar: '' });
  const [utilisateur, setUtilisateur] = useState({ nom: '', email: '', avatar: '' });
  const [motsDePasse, setMotsDePasse] = useState({ actuel: '', nouveau: '', confirmer: '' });
  
  const [afficherActuel, setAfficherActuel] = useState(false);
  const [afficherNouveau, setAfficherNouveau] = useState(false);
  const [afficherConfirmer, setAfficherConfirmer] = useState(false);

  const fetchProfil = async () => {
    try {
      const res = await api.get('/utilisateurs/me');
      const data = { 
        nom: res.data.nom, 
        email: res.data.email,
        avatar: res.data.avatar || '' 
      };
      setUtilisateur(data);
      setUtilisateurInitial(data);
    } catch (erreur) {
      console.error("Erreur de récupération :", erreur);
    }
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      MySwal.fire({
        title: t('profile.uploading', 'Téléchargement...'),
        allowOutsideClick: false,
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        didOpen: () => MySwal.showLoading()
      });

      const res = await api.post('/utilisateurs/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newAvatarUrl = res.data.avatarUrl || res.data.avatar || res.data.utilisateur?.avatar;

      setUtilisateur(prev => ({ ...prev, avatar: newAvatarUrl }));
      setUtilisateurInitial(prev => ({ ...prev, avatar: newAvatarUrl }));
      
      const storedUser = JSON.parse(localStorage.getItem('utilisateur') || '{}');
      localStorage.setItem('utilisateur', JSON.stringify({ ...storedUser, avatar: newAvatarUrl }));
      window.dispatchEvent(new Event('profilMisAJour')); 

      MySwal.fire({ 
        icon: 'success', 
        title: t('profile.photoUpdated', 'Photo mise à jour'), 
        toast: true, 
        position: 'top-end', 
        timer: 2000, 
        showConfirmButton: false,
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917'
      });
    } catch (erreur) {
      console.error(erreur);
      MySwal.fire({ 
        icon: 'error', 
        title: t('profile.error', 'Erreur'), 
        text: t('profile.photoError', 'Impossible de modifier la photo de profil.'),
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917'
      });
    }
  };

  const handleSauvegarderInfo = async (e) => {
    e.preventDefault();
    const nomFormate = formaterNom(utilisateur.nom);
    const emailAChange = utilisateur.email.trim().toLowerCase() !== utilisateurInitial.email;

    try {
      if (emailAChange) {
        await api.post('/utilisateurs/demander-changement-email', { nouvelEmail: utilisateur.email.trim().toLowerCase(), nom: nomFormate });
        let tentatives = 3;

        await MySwal.fire({
            title: `<span class="text-xl font-bold ${isDarkMode ? 'text-white' : 'text-stone-800'}">${t('profile.verificationRequired', 'Vérification requise')}</span>`,
            html: `<p class="text-sm ${isDarkMode ? 'text-slate-400' : 'text-stone-500'} mb-4">${t('profile.codeSentTo', 'Un code a été envoyé à')} <br/><strong>${utilisateur.email}</strong></p>`,
            input: 'text',
            inputAttributes: { maxlength: 6, placeholder: '123456' },
            background: isDarkMode ? '#0B1120' : '#ffffff',
            customClass: {
                popup: `rounded-[2rem] border ${isDarkMode ? 'border-white/10' : 'border-stone-200'} shadow-xl`,
                input: `text-center text-2xl tracking-widest font-bold border rounded-xl outline-none py-4 ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:ring-cyan-500' : 'bg-stone-50 border-stone-200 text-stone-800 focus:ring-2 focus:ring-[#4a3728]'}`,
                confirmButton: `${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-[#4a3728] hover:bg-[#5c4431]'} text-white font-bold rounded-xl px-6 py-3 transition-colors w-full`,
                cancelButton: `${isDarkMode ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'} font-bold rounded-xl px-6 py-3 mt-2 w-full transition-colors`,
                validationMessage: 'text-rose-500 font-bold text-sm mt-3 bg-rose-500/10 p-2 rounded-lg'
            },
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: t('profile.validateBtn', 'Valider'),
            cancelButtonText: t('profile.cancelBtn', 'Annuler'),
            showLoaderOnConfirm: true,
            preConfirm: async (otpCode) => {
                if (!otpCode || otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
                    MySwal.showValidationMessage(t('profile.enter6Digits', 'Veuillez entrer les 6 chiffres du code.'));
                    return false;
                }
                try {
                    await api.post('/utilisateurs/confirmer-changement-email', { otp: otpCode });
                    return true;
                } catch (erreur) {
                    tentatives--;
                    if (tentatives > 0) {
                        MySwal.showValidationMessage(`${t('profile.incorrectCode', 'Code incorrect. Il vous reste')} ${tentatives} ${t('profile.attempts', 'tentative(s).')}`);
                        return false;
                    } else {
                        throw new Error(t('profile.maxAttemptsReached', 'Nombre maximum de tentatives atteint.'));
                    }
                }
            },
            allowOutsideClick: () => !MySwal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({ icon: 'success', title: t('profile.emailUpdated', 'Email mis à jour !'), timer: 2000, showConfirmButton: false, background: isDarkMode ? '#0B1120' : '#ffffff', color: isDarkMode ? '#fff' : '#1c1917' });
                fetchProfil(); 
            } else if (result.isDismissed) {
                setUtilisateur({...utilisateur, email: utilisateurInitial.email});
            }
        }).catch((erreur) => {
            MySwal.fire({ icon: 'error', title: t('profile.failure', 'Échec'), text: erreur.message, background: isDarkMode ? '#0B1120' : '#ffffff', color: isDarkMode ? '#fff' : '#1c1917' });
            setUtilisateur({...utilisateur, email: utilisateurInitial.email});
        });
      } else {
        await api.put('/utilisateurs/profil', { nom: nomFormate });
        MySwal.fire({ icon: 'success', title: t('profile.profileUpdated', 'Profil mis à jour'), toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: isDarkMode ? '#0B1120' : '#ffffff', color: isDarkMode ? '#fff' : '#1c1917' });
        fetchProfil();
      }
    } catch (erreur) {
      MySwal.fire({ icon: 'error', title: t('profile.error', 'Erreur'), text: erreur.response?.data?.message || t('profile.generalError', 'Erreur'), background: isDarkMode ? '#0B1120' : '#ffffff', color: isDarkMode ? '#fff' : '#1c1917' });
      setUtilisateur({...utilisateur, email: utilisateurInitial.email});
    }
  };

  const handleMiseAJourMotDePasse = async (e) => {
    e.preventDefault();
    if (motsDePasse.nouveau !== motsDePasse.confirmer) return MySwal.fire({ icon: 'error', title: t('profile.error', 'Erreur'), text: t('profile.passwordMismatch', 'Les mots de passe ne correspondent pas.'), background: isDarkMode ? '#0B1120' : '#ffffff', color: isDarkMode ? '#fff' : '#1c1917' });
    try {
      const response = await api.put('/utilisateurs/profil', { motDePasseActuel: motsDePasse.actuel, nouveauMotDePasse: motsDePasse.nouveau });
      if (response.data.token) localStorage.setItem('token', response.data.token);
      setMotsDePasse({ actuel: '', nouveau: '', confirmer: '' }); 
      MySwal.fire({ icon: 'success', title: t('profile.passwordUpdated', 'Mot de passe mis à jour'), background: isDarkMode ? '#0B1120' : '#ffffff', color: isDarkMode ? '#fff' : '#1c1917' });
    } catch (erreur) {
      MySwal.fire({ icon: 'error', title: t('profile.error', 'Erreur'), text: erreur.response?.data?.message || t('profile.wrongCredentials', 'Identifiants incorrects.'), background: isDarkMode ? '#0B1120' : '#ffffff', color: isDarkMode ? '#fff' : '#1c1917' });
    }
  };

  // --- REINTEGRATION DE LA LOGIQUE DE LIEN OUBLIÉ ---
  const handleMotDePasseOublieDirect = async () => {
    try {
      await api.post('/utilisateurs/mot-de-passe-oublie', { email: utilisateurInitial.email });
      MySwal.fire({ 
        icon: 'success', 
        title: t('profile.emailSent', 'Email envoyé !'), 
        text: t('profile.checkInbox', 'Vérifiez votre boîte mail.'),
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });
    } catch (erreur) {
      MySwal.fire({ 
        icon: 'error', 
        title: t('profile.error', 'Erreur'), 
        text: t('profile.emailSendError', "Impossible d'envoyer l'email."),
        background: isDarkMode ? '#0B1120' : '#ffffff',
        color: isDarkMode ? '#fff' : '#1c1917',
        borderRadius: '1.5rem'
      });
    }
  };

  const handleLogout = () => {
    MySwal.fire({
      title: t('profile.logoutTitle', 'Se déconnecter ?'), 
      text: t('profile.logoutText', 'Voulez-vous vraiment fermer votre session ?'), 
      icon: 'question',
      showCancelButton: true, confirmButtonColor: '#f43f5e', 
      confirmButtonText: t('profile.logoutConfirm', 'Oui, déconnexion'), 
      cancelButtonText: t('profile.cancelBtn', 'Annuler'), 
      background: isDarkMode ? '#0B1120' : '#ffffff',
      color: isDarkMode ? '#fff' : '#1c1917',
      borderRadius: '1.5rem'
    }).then((result) => {
      if (result.isConfirmed) {
        const currentAvatar = utilisateur.avatar;
        localStorage.removeItem('token'); 
        if(currentAvatar) localStorage.setItem('lastAvatar', currentAvatar);
        window.location.href = '/Login';
      }
    });
  };

  const handleDeleteAccount = () => {
    MySwal.fire({
      title: t('profile.deleteAccountTitle', 'Supprimer mon compte ?'), 
      text: t('profile.deleteAccountText', 'Cette action effacera définitivement toutes vos données.'), 
      icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#f43f5e', 
      confirmButtonText: t('profile.deleteConfirm', 'Oui, supprimer tout'), 
      cancelButtonText: t('profile.cancelBtn', 'Annuler'),
      background: isDarkMode ? '#0B1120' : '#ffffff',
      color: isDarkMode ? '#fff' : '#1c1917',
      borderRadius: '1.5rem'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { await api.delete('/utilisateurs/me'); localStorage.clear(); window.location.href = '/Login'; } 
        catch (erreur) { MySwal.fire({ icon: 'error', title: t('profile.error', 'Erreur'), text: t('profile.deleteError', 'Impossible de supprimer le compte.'), background: isDarkMode ? '#0B1120' : '#ffffff', color: isDarkMode ? '#fff' : '#1c1917' }); }
      }
    });
  };

  return (
    <div className="relative h-screen w-full bg-[#FDFBF7] dark:bg-[#05050A] text-stone-800 dark:text-slate-200 font-sans overflow-hidden transition-colors duration-500">
      
      {/* LUEURS ARRIÈRE-PLAN */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-amber-500/5 dark:bg-cyan-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-500 ${isDarkMode ? 'bg-[#05050A]/70' : 'bg-[#FDFBF7]/40'}`}></div>

      <div className="relative z-10 flex h-full">
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* HEADER */}
          <header className="h-20 shrink-0 px-8 flex justify-between items-center bg-white/60 dark:bg-white/[0.02] border-b border-stone-200/50 dark:border-white/5 backdrop-blur-xl transition-colors duration-500 relative z-40">
            <h1 className="text-2xl font-black tracking-tight text-stone-800 dark:text-white">{t('profile.title', 'Mon Profil')}</h1>
            
            <div className="flex items-center gap-3">
              {/* DROPDOWN LANGUE SÉCURISÉ (Z-INDEX CORRIGÉ) */}
              <div className="relative">
                <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 rounded-xl font-bold hover:bg-stone-100 dark:hover:bg-white/10 shadow-sm dark:shadow-none text-stone-700 dark:text-slate-300 transition-colors">
                  <Globe size={16} /> <span className="uppercase">{currentLangObj.flag}</span> <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLangOpen && (
                  <>
                    <div className="fixed inset-0 z-[90]" onClick={() => setIsLangOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#0B1120] border border-stone-200 dark:border-white/10 shadow-xl rounded-xl overflow-hidden z-[100] py-1">
                      {languages.map((lng) => (
                        <button key={lng.code} onClick={() => { i18n.changeLanguage(lng.code); setIsLangOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${currentLangObj.code === lng.code ? 'bg-stone-50 dark:bg-white/5 text-[#4a3728] dark:text-cyan-400' : 'text-stone-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-white/5'}`}>
                          <span className="text-sm font-extrabold text-slate-400 dark:text-slate-500">{lng.flag}</span><span>{lng.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* BOUTON THÈME */}
              <button onClick={toggleDarkMode} className="p-3 bg-white/80 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 rounded-xl text-stone-700 dark:text-slate-300 hover:text-cyan-400 hover:bg-stone-100 dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </header>

          <div className="flex-1 px-4 lg:px-8 pb-8 overflow-y-auto custom-scrollbar pt-6 relative z-10">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* 1. INFORMATIONS PERSONNELLES */}
              <div className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg dark:shadow-xl flex flex-col transition-colors duration-500">
                <div className="flex items-center gap-5 mb-8">
                  {/* === AJOUT DE L'ICONE D'ÉDITION PRÈS DE L'IMAGE === */}
                  <div className="relative group cursor-pointer rounded-full shrink-0" onClick={() => document.getElementById('avatar-upload').click()}>
                    <img src={utilisateur.avatar || `https://ui-avatars.com/api/?name=${utilisateur.nom.replace(' ', '+')}&background=eff6ff&color=2563eb&bold=true`} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-stone-200 dark:border-white/10 group-hover:opacity-80 transition-all shadow-sm" />
                    <div className="absolute -bottom-1 -right-1 p-2 bg-[#4a3728] dark:bg-cyan-600 text-white rounded-full shadow-md border-2 border-[#FDFBF7] dark:border-[#05050A] group-hover:scale-110 transition-transform">
                      <Camera size={14} />
                    </div>
                    <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-stone-800 dark:text-white">{t('profile.personalInfo', 'Informations Personnelles')}</h2>
                  </div>
                </div>

                <form onSubmit={handleSauvegarderInfo} className="flex-1 flex flex-col">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('profile.fullName', 'Nom complet')}</label>
                      <input type="text" value={utilisateur.nom} onChange={(e) => setUtilisateur({...utilisateur, nom: e.target.value})} className="w-full px-5 py-3.5 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 text-stone-800 dark:text-white font-medium shadow-sm dark:shadow-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('profile.emailAddress', 'Adresse Email')}</label>
                      <input type="email" value={utilisateur.email} onChange={(e) => setUtilisateur({...utilisateur, email: e.target.value})} className="w-full px-5 py-3.5 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 text-stone-800 dark:text-white font-medium shadow-sm dark:shadow-none transition-all" required />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={utilisateur.nom === utilisateurInitial.nom && utilisateur.email === utilisateurInitial.email} className="w-full flex justify-center items-center gap-2 px-8 py-3.5 bg-[#4a3728] hover:bg-[#5c4431] dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold rounded-xl shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      <Save size={18} /> {t('profile.saveBtn', 'Enregistrer')}
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. SÉCURITÉ */}
              <div className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg dark:shadow-xl flex flex-col transition-colors duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-[#4a3728]/10 dark:bg-amber-500/10 text-[#4a3728] dark:text-amber-400 rounded-2xl shadow-sm dark:shadow-none"><Lock size={24} /></div>
                  <h2 className="text-xl font-bold text-stone-800 dark:text-white">{t('profile.security', 'Sécurité')}</h2>
                </div>
                <form onSubmit={handleMiseAJourMotDePasse} className="flex-1 flex flex-col">
                  <div className="space-y-5">
                    <div>
                      {/* === REINTEGRATION DU BOUTON OUBLIÉ === */}
                      <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest">{t('profile.currentPassword', 'Mot de passe actuel')}</label>
                        <button type="button" onClick={handleMotDePasseOublieDirect} className="text-xs font-bold text-[#4a3728] dark:text-cyan-400 hover:underline">{t('profile.forgotPassword', 'Oublié ?')}</button>
                      </div>
                      <div className="relative">
                        <input type={afficherActuel ? "text" : "password"} required value={motsDePasse.actuel} onChange={(e) => setMotsDePasse({...motsDePasse, actuel: e.target.value})} className="w-full px-5 py-3.5 pr-12 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 text-stone-800 dark:text-white shadow-sm dark:shadow-none transition-all" />
                        <button type="button" onClick={() => setAfficherActuel(!afficherActuel)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#4a3728] dark:hover:text-cyan-400 transition-colors">{afficherActuel ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                          <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('profile.newPassword', 'Nouveau')}</label>
                          <div className="relative">
                              <input type={afficherNouveau ? "text" : "password"} required value={motsDePasse.nouveau} onChange={(e) => setMotsDePasse({...motsDePasse, nouveau: e.target.value})} className="w-full px-5 py-3.5 pr-12 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-[#4a3728] dark:focus:ring-cyan-500 text-stone-800 dark:text-white shadow-sm dark:shadow-none transition-all" />
                              <button type="button" onClick={() => setAfficherNouveau(!afficherNouveau)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#4a3728] dark:hover:text-cyan-400 transition-colors">{afficherNouveau ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                          </div>
                      </div>
                      <div>
                          <label className="block text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('profile.confirmPassword', 'Confirmer')}</label>
                          <div className="relative">
                              <input type={afficherConfirmer ? "text" : "password"} required value={motsDePasse.confirmer} onChange={(e) => setMotsDePasse({...motsDePasse, confirmer: e.target.value})} className={`w-full px-5 py-3.5 pr-12 bg-white/50 dark:bg-white/5 border rounded-xl outline-none focus:ring-2 transition-all text-stone-800 dark:text-white shadow-sm dark:shadow-none ${motsDePasse.confirmer && motsDePasse.nouveau !== motsDePasse.confirmer ? 'border-rose-500 focus:ring-rose-500' : 'border-stone-200 dark:border-white/10 focus:ring-[#4a3728] dark:focus:ring-cyan-500'}`} />
                              <button type="button" onClick={() => setAfficherConfirmer(!afficherConfirmer)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#4a3728] dark:hover:text-cyan-400 transition-colors">{afficherConfirmer ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={!motsDePasse.actuel || !motsDePasse.nouveau || motsDePasse.nouveau !== motsDePasse.confirmer} className="w-full flex justify-center items-center gap-2 px-8 py-3.5 bg-[#4a3728] hover:bg-[#5c4431] dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold rounded-xl shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      <Save size={18} /> {t('profile.updateBtn', 'Mettre à jour')}
                    </button>
                  </div>
                </form>
              </div>

              {/* 3. ACTIONS RAPIDES */}
              <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                  <div className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-6 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#4a3728]/10 dark:bg-cyan-500/10 text-[#4a3728] dark:text-cyan-400 rounded-2xl shadow-sm dark:shadow-none">
                        <LifeBuoy size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-800 dark:text-white">{t('profile.support', 'Support & Assistance')}</h3>
                      </div>
                    </div>
                    <button onClick={() => navigate('/Support')} className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-[#4a3728] dark:text-cyan-400 font-bold rounded-xl transition-colors">{t('profile.contactBtn', 'Contacter')}</button>
                  </div>
                  
                  <div className="bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl p-6 rounded-[2rem] border border-stone-200/50 dark:border-white/10 shadow-lg flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-slate-400 rounded-2xl shadow-sm dark:shadow-none">
                        <LogOut size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-800 dark:text-white">{t('profile.logout', 'Déconnexion')}</h3>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl transition-colors">{t('profile.quitBtn', 'Quitter')}</button>
                  </div>
              </div>
                
              {/* 4. ZONE DE DANGER */}
              <div className="xl:col-span-2 bg-rose-50/80 dark:bg-rose-500/5 p-8 rounded-[2rem] border border-rose-200 dark:border-rose-500/20 shadow-sm transition-colors mt-2">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 text-rose-600 dark:text-rose-500">
                      <AlertTriangle size={28} /> 
                    </div>
                    <p className="text-stone-600 dark:text-slate-400 text-sm font-medium">{t('profile.deleteWarning', 'La suppression est irréversible et effacera toutes vos données.')}</p>
                  </div>
                  <button onClick={handleDeleteAccount} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-colors whitespace-nowrap">
                    {t('profile.deleteAccountBtn', 'Supprimer mon compte')}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;