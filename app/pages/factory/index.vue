<template>
	<div>
		<base-header class="pb-6">
			<div class="row align-items-center py-4">
				<div class="col-lg-8 col-9 d-flex align-items-center">
					<n-link to="/" class="h2 text-dark d-inline-block mb-0"></n-link>
					<nav
						aria-label="breadcrumb"
						class="d-none d-md-inline-block ml-1 mt-1"
					></nav>
				</div>
			</div>
		</base-header>
		<div class="container-fluid mt--6">
			<div class="row">
				<div class="col-md-6">
					<!-- Pricing card -->
					<card
						header-classes="bg-transparent"
						body-classes="px-lg-7"
						class="card-pricing border-0 text-center mb-4"
					>
						<!--Header-->
						<h4 slot="header" class="text-uppercase ls-1 text-primary py-3 mb-0">
							Token Factory
						</h4>

						<!--Body-->
						<div class="display-2 d-flex justify-content-center align-items-center">
							0 ETH
							<i class="ml-5 fa fa-info-circle tooltip-img">
								<span class="tooltip-custom shadow-lg">Deployment fee</span>
							</i>
						</div>

						<ul class="list-unstyled my-4">
							<li>
								<div class="d-flex align-items-center">
									<div>
										<div
											class="
												icon icon-xs icon-shape
												bg-gradient-primary
												text-white
												shadow
												rounded-circle
											"
										>
											<i class="fas fa-terminal"></i>
										</div>
									</div>
									<div>
										<span class="pl-2 text-sm">Audited Code</span>
									</div>
								</div>
							</li>
							<li>
								<div class="d-flex align-items-center">
									<div>
										<div
											class="
												icon icon-xs icon-shape
												bg-gradient-primary
												text-white
												shadow
												rounded-circle
											"
										>
											<i class="fas fa-pen-fancy"></i>
										</div>
									</div>
									<div>
										<span class="pl-2 text-sm">3x ERC20 token types</span>
									</div>
								</div>
							</li>
							<li>
								<div class="d-flex align-items-center">
									<div>
										<div
											class="
												icon icon-xs icon-shape
												bg-gradient-primary
												text-white
												shadow
												rounded-circle
											"
										>
											<i class="fas fa-hdd"></i>
										</div>
									</div>
									<div>
										<span class="pl-2 text-sm">No code deployment</span>
									</div>
								</div>
							</li>
						</ul>
						<n-link to="/factory/token">
							<base-button type="primary" class="mb-3">Create Token</base-button>
						</n-link>
					</card>
				</div>
				<div class="col-md-6">
					<!-- Pricing card -->
					<card
						header-classes="bg-transparent"
						body-classes="px-lg-7"
						class="card-pricing border-0 text-center mb-4"
					>
						<!--Header-->
						<h4 slot="header" class="text-uppercase ls-1 text-primary py-3 mb-0">
							Market Factory
						</h4>

						<!--Body-->
						<div class="display-2 d-flex justify-content-center align-items-center">
							0 ETH
							<i class="ml-5 fa fa-info-circle tooltip-img">
								<span class="tooltip-custom shadow-lg">Deployment fee</span>
							</i>
						</div>

						<ul class="list-unstyled my-4">
							<li>
								<div class="d-flex align-items-center">
									<div>
										<div
											class="
												icon icon-xs icon-shape
												bg-gradient-primary
												text-white
												shadow
												rounded-circle
											"
										>
											<i class="fas fa-terminal"></i>
										</div>
									</div>
									<div>
										<span class="pl-2 text-sm">Audited Code</span>
									</div>
								</div>
							</li>
							<li>
								<div class="d-flex align-items-center">
									<div>
										<div
											class="
												icon icon-xs icon-shape
												bg-gradient-primary
												text-white
												shadow
												rounded-circle
											"
										>
											<i class="fas fa-pen-fancy"></i>
										</div>
									</div>
									<div>
										<span class="pl-2 text-sm">Crowdsale or Dutch Auction</span>
									</div>
								</div>
							</li>
							<li>
								<div class="d-flex align-items-center">
									<div>
										<div
											class="
												icon icon-xs icon-shape
												bg-gradient-primary
												text-white
												shadow
												rounded-circle
											"
										>
											<i class="fas fa-hdd"></i>
										</div>
									</div>
									<div>
										<span class="pl-2 text-sm">Accepts any ERC20</span>
									</div>
								</div>
							</li>
						</ul>
						<n-link to="/factory/auctions/new">
							<base-button type="primary" class="mb-3">Create Auction</base-button>
						</n-link>
					</card>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	layout: 'DashboardLayout',
}
</script>

<style lang="scss">
.tooltip-img {
	font-size: x-large;
	position: relative;
	& .tooltip-custom {
		display: none !important;
		position: absolute;
		font-size: 20px;
		background-color: #6c757d;
		left: -55px;
		top: 40px;
		color: #fff;
		padding: 5px 20px;
		border-radius: 10px;
	}

	&:hover {
		& .tooltip-custom {
			display: block !important;
		}
	}
}
</style>
