import { createApp } from 'vue'
import Home from './pages/Home.vue'
import './assets/main.css' 
import { Analytics } from "@vercel/analytics/next"

createApp(Home).mount('#app')
