import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language Translations
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      greeting: "Hello, how are you?",
      lightMode: "Light",
      darkMode: "Dark",
      taskManager: "Task Manager",
      addtask: "Add new Task....",
      add: "Add",
      delete: "Delete",
      lang: "Language",
      join: "Address the lack of access to basic education for girls in rural communities.",
      username: "UserName",
      email: "Email",
      password: "Password",
      welcomeBack: "Welcome back!",
      welcomeToShePath: "Welcome to ShePath!",
      firstName: "First Name",
      enterFirstName: "Enter your first name...",
      lastName: "Last Name",
      enterLastName: "Enter your last name...",
      confirmPassword: "Confirm Password",
      login: "Login",
      register: "Register",
      noAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      passwordMismatch: "Password does not match",
      category: "Category",
      audioLesson: "Audio Lesson",
      videoSupportError: "Your browser does not support the video tag.",
      audioSupportError: "Your browser does not support the audio element.",
      courseOverview: "Course Overview"

    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue",
      greeting: "Bonjour, comment ça va?",
      lightMode: "Clair",
      darkMode: "Sombre",
      taskManager: "Gestionnaire de tâches",
      addtask: "Ajouter une nouvelle tâche...",
      add: "Ajouter",
      delete: "Supprimer",
      lang: "Langue",
      join: "Rejoignez-nous pour créer des opportunités et briser les barrières pour les filles dans les communautés rurales.",
      home: "Réception",
      username: "Nom d'utilisateur",
      email: "E-mail",
      password: "Mot de passe",
      welcomeBack: "Bon retour !",
      welcomeToShePath: "Bienvenue sur ShePath !",
      firstName: "Prénom",
      enterFirstName: "Entrez votre prénom...",
      lastName: "Nom de famille",
      enterLastName: "Entrez votre nom de famille...",
      confirmPassword: "Confirmez le mot de passe",
      login: "Se connecter",
      register: "S'inscrire",
      noAccount: "Vous n'avez pas de compte ?",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      passwordMismatch: "Le mot de passe ne correspond pas",
      category: "Catégorie",
      audioLesson: "Leçon audio",
      videoSupportError: "Votre navigateur ne prend pas en charge la balise vidéo.",
      audioSupportError: "Votre navigateur ne prend pas en charge l'élément audio.",
      courseOverview: "Aperçu du cours"
      // more French words...
    },
  },
  rw: {
    translation: {
      welcome: "Murakaza neza",
      greeting: "Bite, amakuru yanyu?",
      lightMode: "Urumuri",
      darkMode: "Umukara",
      taskManager: "Genzura imirimo",
      addtask: "Ongeraho Umurimo...",
      add: "Ongeraho",
      passwordMismatch: "Umubare w'ibanga ntuhura",
      delete: "Siba",
      lang: "Indimi",
      join: "Dufatanye mu gukora amahirwe no gusenya imbogamizi ku bakobwa bo mu bice by'icyaro.",
      home: "Ahabanza",
      username: "Izina ukoresha",
      email: "Imeri",
      password: "Ijambo Banga",
      welcomeBack: "Ikaze wongere!",
      welcomeToShePath: "Murakaza neza kuri ShePath!",
      firstName: "Izina rya mbere",
      enterFirstName: "Injiza izina ryawe rya mbere...",
      lastName: "Izina rya nyuma",
      enterLastName: "Injiza izina ryawe rya nyuma...",
      confirmPassword: "Emeza Ijambo Banga",
      login: "Injira",
      register: "Iyandikishe",
      noAccount: "Nta konti ufite?",
      alreadyHaveAccount: "Usanzwe ufite konti?",
      category: "Ibyiciro",
      audioLesson: "Isomo rya Audio",
      videoSupportError: "Umukoresha wawe ntabwo ashyigikira tag ya videwo.",
      audioSupportError: "Umukoresha wawe ntabwo ashyigikira element ya audio.",
      courseOverview: "Ibisobanuro bya gahunda"
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language 
  fallbackLng: 'en', // Fallback language 
  interpolation: {
    escapeValue: false, 
  },
});

export default i18n;
