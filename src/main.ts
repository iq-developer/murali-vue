import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  MdCloseRound,
  HiArrowNarrowRight,
  FaHeart,
  GiSpeaker,
  BiArrowLeftShort,
} from 'oh-vue-icons/icons'

addIcons(MdCloseRound, FaHeart, HiArrowNarrowRight, GiSpeaker, BiArrowLeftShort)
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('v-icon', OhVueIcon)
app.mount('#app')
