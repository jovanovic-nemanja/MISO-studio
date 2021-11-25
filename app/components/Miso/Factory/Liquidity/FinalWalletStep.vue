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
												<div class="font-weight-bold fs-4 mb-2">TRANSACTION HASH</div>
											</div>
										</div>
										<div class="fs-2">
											<a
												class="text-white font-weight-bold fs-4"
												:href="`${explorer.root}${explorer.tx}${model.deployedLauncher.txHash}`"
												target="blank"
											>
												{{ model.deployedLauncher.txHash }}
											</a>
										</div>
									</div>

									<div class="col-12 mt-4">
										<div class="d-flex">
											<div class="d-inline border-bottom mb-4">
												<div class="font-weight-bold fs-4 mb-2">Auction Address</div>
											</div>
										</div>
										<div class="fs-2">
											<a
												class="text-white font-weight-bold fs-4"
												:href="`${explorer.root}${explorer.address}${model.auctionAddress}`"
												target="blank"
											>
												{{ model.auctionAddress }}
											</a>
										</div>
									</div>

									<div class="col-12 mt-4">
										<div class="d-flex">
											<div class="d-inline border-bottom mb-4">
												<div class="font-weight-bold fs-4 mb-2">Launcher Address</div>
											</div>
										</div>
										<div class="fs-2">
											<a
												class="text-white font-weight-bold fs-4"
												:href="`${explorer.root}${explorer.address}${model.deployedLauncher.address}`"
												target="blank"
											>
												{{ model.deployedLauncher.address }}
											</a>
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
import { mapGetters } from 'vuex'

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
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			explorer: 'ethereum/explorer',
		}),
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
