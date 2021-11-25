// We initialize calendar components here since they don't have SSR support.
// We will render them on the client only by making this plugin ssr:false
import Vue from 'vue'
import Calendar from '@/components/Calendar/Calendar'
Vue.component('Calendar', Calendar)
