import { createI18n } from 'vue-i18n'
import en from './locales/en'
import it from './locales/it'

const messages = {
  en,
  it,
}

// Get saved locale from localStorage or default to 'it'
const savedLocale = localStorage.getItem('locale') || 'it'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLocale,
  fallbackLocale: 'it',
  messages,
})

export default i18n
