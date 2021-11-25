import Vue from 'vue'
import BaseInput from '@/components/Inputs/BaseInput.vue'
import BaseDropdown from '@/components/BaseDropdown.vue'
import Card from '@/components/Cards/Card.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseCheckbox from '@/components/Inputs/BaseCheckbox.vue'
import BaseRadio from '@/components/Inputs/BaseRadio'
import Loader from '@/components/loader/loader'
import { Input, InputNumber, Tooltip, Popover } from 'element-ui'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

Vue.component(BaseInput.name, BaseInput)
Vue.component(BaseDropdown.name, BaseDropdown)
Vue.component(Card.name, Card)
Vue.component(BaseCheckbox.name, BaseCheckbox)
Vue.component(BaseButton.name, BaseButton)
Vue.component(BaseRadio.name, BaseRadio)
Vue.component(Input.name, Input)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Loader.name, Loader)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Vue.use(VuePlyr)
