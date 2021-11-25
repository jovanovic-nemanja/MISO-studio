<template>
	<div>
		<div class="row justify-content-md-center">
			<div class="col-sm-6 col-md-6">
				<card>
					<div slot="header" class="row">
						<div class="col">
							<h6 class="text-uppercase text-muted ls-1 mb-1">Auction Confirmed</h6>
						</div>
					</div>
					<div class="col-sm-12 col-md-12 mb-3">
						<span class="h6 surtitle text-muted">Transaction Hash</span>
						<br />
						<a
							class="d-block"
							:href="`${explorer.root}${explorer.tx}${market.txHash}`"
							target="blank"
						>
							{{ market.txHash }}
						</a>
					</div>
					<div class="col-sm-12 col-md-12">
						<span class="h6 surtitle text-muted">Auction</span>
						<br />
						<a
							class="d-block"
							:href="`${explorer.root}${explorer.address}${market.address}`"
							target="blank"
						>
							{{ market.address }}
						</a>
					</div>
				</card>

				<hr />

				<base-button
					tag="nuxt-link"
					:to="{
						path: `/auctions/${market.address}`,
					}"
					class="float-right"
					type="primary"
				>
					View Auction
				</base-button>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
	props: {
		market: {
			type: Object,
			required: true,
		},
	},
	computed: {
		...mapGetters({
			explorer: 'ethereum/explorer',
		}),
	},
	methods: {
		redirect(url) {
			this.$router.push(url)
		},
		validate() {
			return this.$validator.validateAll().then((res) => {
				this.$emit('on-validated', res, this.model)
				return res
			})
		},
	},
}
</script>
<style></style>
