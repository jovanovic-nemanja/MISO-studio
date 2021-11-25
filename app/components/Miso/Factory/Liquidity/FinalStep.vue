<template>
	<div>
		<validation-observer ref="observer">
			<div class="">
				<div class="row">
					<div class="col-12">
						<div class="row">
							<div class="col-md-6 col-sm-12">
								<div class="row">
									<div class="col-12">
										<div class="d-flex">
											<div class="d-inline border-bottom mb-4">
												<div class="font-weight-bold fs-4 mb-2">YOUR TOKEN PAIR</div>
											</div>
										</div>
										<div class="fs-2">
											<span class="text-white font-weight-bold fs-4">
												{{ model.token.name }} ({{ model.token.symbol }})
											</span>
											<span class="text-white font-weight-bold fs-4">
												+ {{ model.auction.payment_currency_name }} ({{
													model.auction.payment_currency
												}})
											</span>
										</div>
									</div>
									<div class="col-12 mt-5">
										<div class="d-flex">
											<div class="d-inline border-bottom mb-4">
												<div class="font-weight-bold fs-4 mb-2">
													LIQUIDITY PROVISION
												</div>
											</div>
										</div>
										<div class="fs-2">
											<span class="text-white font-weight-bold fs-4">
												{{ model.token.name }} ({{ model.token.symbol }}) :
												{{ model.percent }}% ({{ model.amount }})
											</span>
										</div>
										<div class="text-white mt-3 fs-2 w-75">
											The amount raised from the auction, pairing with tokens to be
											launched on SushiSwap with equal weighting in the liquidity pool
										</div>
									</div>
									<div class="col-12 mt-5">
										<div class="d-flex">
											<div class="d-inline border-bottom mb-3">
												<div class="font-weight-bold fs-4">LAUNCH SETTINGS</div>
											</div>
										</div>
										<div class="font-weight-bold fs-3">Liquidity Lockup</div>
										<div
											v-if="model.customDays"
											class="font-weight-bold text-white fs-2 mt-1"
										>
											Liquidity is set to unlock {{ model.customDays }} Days after the
											auction is finalized.
										</div>
										<div v-else class="font-weight-bold text-white fs-2 mt-1">
											Liquidity is set to unlock {{ model.inputDays }} Days after the
											auction is finalized.
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-6 col-lg-5 col-sm-12 offset-lg-1 mt-sm-5 mt-md-0">
								<div class="row">
									<div class="col-12">
										<div class="d-flex">
											<div class="d-inline border-bottom mb-4">
												<div class="font-weight-bold fs-4 mb-2">
													CONNECTED ADDRESSES
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col-12 mb-3">
												<div class="fs-4 font-weight-bold">Admin Address</div>
												<span class="font-weight-bold text-white mt-1 fs-2">
													{{ model.wallet }}
												</span>
											</div>
											<div v-if="model.auction" class="col-12 mb-3">
												<div class="fs-4 font-weight-bold">Auction Address</div>
												<span class="font-weight-bold text-white mt-1 fs-2">
													{{ model.auctionAddress }}
												</span>
											</div>
											<div class="col-12">
												<div class="fs-4 font-weight-bold">Vault Address</div>
												<span class="font-weight-bold text-white mt-1 fs-2">
													{{ model.vaultAddr }}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</validation-observer>
	</div>
</template>

<script>
export default {
	props: {
		data: {
			type: Object,
			default: null,
		},
	},

	computed: {
		model() {
			return this.data
		},
	},
	methods: {
		validate() {
			return this.$refs.observer.validate().then((res) => {
				this.$emit('on-validated', res, this.model)
				return res
			})
		},
	},
}
</script>

<style lang="scss" scoped></style>
