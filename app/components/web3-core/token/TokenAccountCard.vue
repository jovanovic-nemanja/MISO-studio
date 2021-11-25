<template>
	<card>
		<div slot="header" class="row">
			<div class="col">
				<h6 class="text-uppercase text-muted ls-1 mb-1">Your Account</h6>
			</div>
		</div>
		<div>
			<span class="h6 surtitle text-muted">Address</span>
			<span class="d-block h4">{{ address }}</span>
		</div>
		<div class="d-flex justify-content-between align-items-center">
			<div>
				<span class="h6 surtitle text-muted">Balance</span>
				<span class="d-block h4">{{ balance }}</span>
			</div>
			<div>
				<base-button
					v-if="parseFloat(this.balance) > 0"
					type="primary"
					class="btn btn-outline-primary"
					@click="redirect(`/factory/auction`)"
				>
					Create Auction
				</base-button>
			</div>
		</div>
	</card>
</template>
<script>
export default {
	props: {
		address: {
			type: String,
			required: true,
		},
		balance: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			creditCard: {
				address: '0x3C538f74958d56a80A9FD87C21D84dd484Ba9b0C',
				name: 'My Venture Token',
				symbol: 'MVT',
			},
		}
	},
	methods: {
		redirect(url) {
			this.$router.push(url)
		},
	},
}
</script>
