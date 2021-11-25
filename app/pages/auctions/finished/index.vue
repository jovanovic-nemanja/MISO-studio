<template>
	<div class="container-fluid">
		<h3 class="text-uppercase text-secondary font-weight-bold my-4 fs-4 h-100">
			finished sales
		</h3>
		<div v-if="!loading" class="row">
			<div
				v-for="(auction, id) in auctionsList"
				:key="id"
				class="col-lg-4 col-md-6 col-12 mb-3"
			>
				<nuxt-link
					:to="`/auctions/${auction}`"
					tag="div"
					class="cursor-pointer specialCard"
				>
					<!-- iconlink: [String] props for icon links -->
					<special-card
						:auction="auction"
						:ingredients="ingredients"
						auction-type="finished"
					/>
				</nuxt-link>
			</div>
		</div>
		<loader v-else width="80" height="80" y="250" />
	</div>
</template>

<script>
import SpecialCard from '@/components/Miso/Auctions/Specials/SpecialCard'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'LiveAuctions',
	components: {
		SpecialCard,
	},
	data() {
		return {
			loading: true,
			auctionsList: [],
			ingredients: [
				{
					icon: 'wheat',
					text: 'Mintable',
				},
				{
					icon: 'teapot',
					text: 'Pool Liquidity',
				},
				{
					icon: 'crowd',
					text: 'Crowdsale',
				},
			],
		}
	},
	computed: {
		...mapGetters({ auctions: 'auctions/list' }),
	},
	mounted() {
		this.initAuctions()
	},
	methods: {
		...mapActions({
			getAuctions: 'auctions/getAuctions',
		}),
		async initAuctions() {
			await this.getAuctions()
			this.auctionsList = this.auctions
				.filter((auction) => {
					const currentTimestamp = Date.parse(new Date()) / 1000
					return currentTimestamp > parseInt(auction.endTime) || auction.finalized
				})
				.map((x) => x[0])
			this.loading = false
		},
	},
}
</script>

<style lang="scss">
.specialCard {
	transition: all 0.4s ease-in-out;
	transform: scale(1);
	max-width: 490px;
	@media screen and (max-width: 768px) {
		max-width: 100%;
	}
	&:hover {
		transition: all 0.4s ease-in-out;
		transform: scale(1.025);
	}
}
</style>
