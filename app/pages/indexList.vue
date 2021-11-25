<template>
	<div>
		<auction-types v-if="$route.fullPath === '/'" />
		<app-auctions />
	</div>
</template>

<script>
import AppAuctions from '~/pages/auctions/liveList'
import AuctionTypes from '~/components/Headers/AuctionTypes.vue'
export default {
	components: {
		AppAuctions,
		AuctionTypes,
	},
}
</script>

<style lang="scss" scoped></style>
