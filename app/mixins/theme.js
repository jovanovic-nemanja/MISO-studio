import { mapGetters } from 'vuex'

export const theme = {
	computed: {
		...mapGetters({ mode: 'theme/getMode' }),
		computedIconColor() {
			if (this.mode) {
				return '#ffffff #ffffff'
			}
			return '#000a35 #000a35'
		},
	},
}
