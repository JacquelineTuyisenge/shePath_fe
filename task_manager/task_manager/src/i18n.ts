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
      // Add more French strings here
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
      delete: 'Siba'
      // Add more Kinyarwanda strings here
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language (you can change this dynamically)
  fallbackLng: 'en', // Fallback language if the current language doesn't have the key
  interpolation: {
    escapeValue: false, // React already escapes strings
  },
});

export default i18n;
