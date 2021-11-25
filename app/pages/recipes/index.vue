<template>
	<div>
		<base-header class="pb-6">
			<div class="row align-items-center py-4">
				<div class="col-lg-8 col-9 d-flex align-items-center">
					<n-link to="/" class="h2 text-dark d-inline-block mb-0">MISO -</n-link>
					<nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-1 mt-1">
						<route-breadcrumb />
					</nav>
				</div>
			</div>
		</base-header>

		<div class="container-fluid mt--6">
			<div class="card-wrapper">
				<div class="row">
					<div class="col-lg-4 order-lg-2">
						<card>
							<div slot="header" class="row">
								<div class="col">
									<h6 class="text-uppercase text-muted ls-1 mb-1">
										Crowdsale Market
									</h6>
								</div>
							</div>
							<div>
								<span class="h6 surtitle text-muted">Contract</span>
								<span class="d-block h4">{{ contractAddress }}</span>
							</div>
							<div>
								<span class="h6 surtitle text-muted">Minimum deployment fee</span>
								<span class="d-block h4">
									{{ deploymentFee }} {{ nativeCurrency.symbol }}
								</span>
							</div>
						</card>
					</div>
					<div class="col-lg-8 order-lg-1">
						<recipe02></recipe02>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Recipe02 from '@/components/Miso/Recipes/Recipe02'
import { recipe02 } from '@/constants/contracts'

const contractAddress = recipe02.address
export default {
	components: {
		Recipe02,
	},
	layout: 'DashboardLayout',
	data() {
		return {
			contractAddress: '',
			deploymentFee: 0,
		}
	},
	computed: {
		...mapGetters({
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
			nativeCurrency: 'ethereum/nativeCurrency',
		}),
	},
	mounted() {
		this.contractAddress = this.getRecipe02Address()
	},
	methods: {
		getRecipe02Address() {
			return contractAddress[this.currentProvidersNetworkId]
		},
	},
}
</script>

<style scoped></style>
