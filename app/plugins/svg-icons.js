import Vue from 'vue'
import SvgIcon from 'vue-svgicon'

import '@/assets/icons'

// Default tag name is 'svgicon'
Vue.use(SvgIcon, {
	tagName: 'svg-icon',
	defaultWidth: '1em',
	defaultHeight: '1em',
	isOriginalDefault: true,
})
