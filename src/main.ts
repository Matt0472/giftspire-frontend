import './main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')

// Initialize stores after mounting
const themeStore = useThemeStore()
themeStore.initTheme()

const authStore = useAuthStore()
authStore.initAuth()
