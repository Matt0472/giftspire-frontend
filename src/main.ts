import './main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'
import { echoPlugin } from './plugins/echo'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')

const themeStore = useThemeStore()
themeStore.initTheme()

const authStore = useAuthStore()
authStore.initAuth()

app.use(echoPlugin)
