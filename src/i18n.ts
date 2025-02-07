import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language Translations
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      greeting: 'Hello, how are you?',
      lightMode: 'Light',
      darkMode: 'Dark',
      taskManager: 'Task Manager',
      addtask: 'Add new Task....',
      add: 'Add',
      delete: 'Delete',
      lang: 'Language',
      join: "address the lack of access to basic education for girls in rural communities by targeting poverty, and social norms. 'Join me in creating opportunities and breaking barriers for girls in rural communities. Together, we can make education accessible to everyone."
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue',
      greeting: 'Bonjour, comment ça va?',
      lightMode: 'Clair',
      darkMode: 'Sombre',
      taskManager: 'Gestionnaire de tâches',
      addtask: 'Ajouter une nouvelle tâche...',
      add: 'Ajouter',
      delete: 'Supprimer',
      lang: 'Langue',
      join: 'Rejoignez-nous pour créer des opportunités et briser les barrières pour les filles dans les communautés rurales. Ensemble, nous pouvons rendre l\'éducation accessible à tous.'
      // more French words...
    },
  },
  rw: {
    translation: {
      welcome: 'Murakaza neza',
      greeting: 'Bite, amakuru yanyu?',
      lightMode: 'Urumuri',
      darkMode: 'Umukara',
      taskManager: 'Genzura imirimo',
      addtask: 'Ongeraho Umurimo...',
      add: 'Ongeraho',
      delete: 'Siba',
      lang: 'Indimi',
      join: 'Dufatanye mu gukora amahirwe no gusenya imbogamizi ku bakobwa bo mu bice byi icyaro. Hamwe, dushobora gukora uburezi buboneka kuri bose.'
      // more Kinyarwanda words....
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
