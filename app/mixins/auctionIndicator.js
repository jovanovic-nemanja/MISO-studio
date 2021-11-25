import { mapGetters } from 'vuex'
export const inpidatorTheme = {
	computed: {
		...mapGetters('theme', ['getMode']),
		activeAuction() {
			if (this.status.auction === 'live') {
				return true
			}
			return false
		},
		statusColor() {
			return {
				'bg-success': this.activeAuction,
				'bg-danger': !this.activeAuction && !this.status.auctionSuccessful,
				'bg-link': !this.activeAuction && this.status.auctionSuccessful,
			}
		},
		statusLightColor() {
			return {
				'bg-success-light': this.activeAuction,
				'bg-danger-light': !this.activeAuction && !this.status.auctionSuccessful,
			}
		},
	},
}
