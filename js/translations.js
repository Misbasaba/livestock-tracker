let currentLang = 'kn';
let translations = {};

async function loadTranslations() {
  try {
    const response = await fetch('data/translations.json');
    translations = await response.json();
    return true;
  } catch (error) {
    console.error('Failed to load translations:', error);
    return false;
  }
}

function t(key) {
  if (translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  if (translations['en'] && translations['en'][key]) {
    return translations['en'][key];
  }
  return key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('preferredLanguage', lang);
  document.documentElement.lang = lang;
  renderAllText();
}

function renderAllText() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}
