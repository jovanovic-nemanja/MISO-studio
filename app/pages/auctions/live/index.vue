<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-lg-6 col-md-8 col-sm-9 justify-content-center">
				<div class="d-block mt-4 mb-3">
					<base-input
						v-model="searchValue"
						:rounded="true"
						placeholder="search for auction"
					>
						<template #prepend>
							<i class="tim-icons icon-zoom-split"></i>
						</template>
					</base-input>
				</div>
			</div>
		</div>
		<h3 class="text-uppercase text-secondary font-weight-bold mb-4 fs-4 h-100">
			Live Sales
		</h3>
		<div v-if="!loading" class="row">
			<div
				v-for="(auction, id) in searchByQuery"
				:key="id"
				class="col-lg-4 col-md-6 col-12 mb-3"
			>
				<nuxt-link
					:to="`/auctions/${auction.addr}`"
					tag="div"
					class="cursor-pointer specialCard"
				>
					<!-- iconlink: [String] props for icon links -->
					<special-card :auction="auction.addr" :ingredients="ingredients" />
				</nuxt-link>
			</div>
			<p
				v-if="auctionsList.length === 0"
				class="font-weight-bold justify-content-center m-auto pt-5"
			>
				Sorry, there's no live sales markets
			</p>
		</div>
		<loader v-else width="80" height="80" y="250" />
	</div>
</template>

<script>
import SpecialCard from '@/components/Miso/Auctions/Specials/SpecialCard'
import { mapGetters, mapActions } from 'vuex'
import { BaseInput } from '@/components'

export default {
	name: 'LiveAuctions',
	components: {
		SpecialCard,
		BaseInput,
	},
	data() {
		return {
			loading: true,
			auctionsList: [],
			searchValue: '',
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
		searchByQuery() {
			// auctionsList is nested arrays
			// for easy access bes will be is auctionsList was array on objects
			/* 
			auctionsList = [
				{
					addr: '0x8f65562879BcE0062561088c56EB2BF457C075Da',
					tokenInfo: {
						name: "miso",
						symbol: 'MISO'
					}
				}
			] 
			*/
			let list = this.auctionsList
			if (this.searchValue !== '' && this.searchValue) {
				list = list.filter((item) => {
					return (
						item.tokenInfo.name
							.toLowerCase()
							.includes(this.searchValue.toLowerCase()) ||
						item.tokenInfo.symbol
							.toLowerCase()
							.includes(this.searchValue.toLowerCase()) ||
						item.addr.toLowerCase().includes(this.searchValue.toLowerCase())
					)
				})
			}
			return list
		},
	},
	updated() {
		console.log(this.auctionsList)
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
					return (
						currentTimestamp >= parseInt(auction.startTime) &&
						currentTimestamp < parseInt(auction.endTime) &&
						!auction.finalized
					)
				})
				.map((x) => x)
			this.loading = false
		},
	},
}
</script>

<style lang="scss" scoped>
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
