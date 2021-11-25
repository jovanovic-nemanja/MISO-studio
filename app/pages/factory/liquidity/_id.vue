<template>
	<div class="pl-3">
		<div class="row">
			<div class="col-12 col-lg-9 col-xl-8">
				<div class="d-flex align-items-center mt-4">
					<svg-icon icon="liquid-luncher" height="70" width="70" />
					<h2 class="mb-0 pl-3 text-white font-weight-bold fs-10">
						Confirm Your Launch
					</h2>
				</div>
			</div>
			<div class="col-12 mt-5">
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
										{{ liquidity.token.name }} ({{ liquidity.token.symbol }})
									</span>
									<span class="text-white font-weight-bold fs-4">
										+ {{ liquidity.auction.payment_currency_name }} ({{
											liquidity.auction.payment_currency
										}})
									</span>
								</div>
							</div>
							<div class="col-12 mt-5">
								<div class="d-flex">
									<div class="d-inline border-bottom mb-4">
										<div class="font-weight-bold fs-4 mb-2">LIQUIDITY PROVISION</div>
									</div>
								</div>
								<div class="fs-2">
									<span class="text-white font-weight-bold fs-4">
										{{ liquidity.token.name }} ({{ liquidity.token.symbol }}) :
										{{ liquidity.percent }}% ({{ liquidity.amount }})
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
									v-if="liquidity.customDays"
									class="font-weight-bold text-white fs-2 mt-1"
								>
									Liquidity is set to unlock {{ liquidity.customDays }} Days after the
									auction is finalized.
								</div>
								<div v-else class="font-weight-bold text-white fs-2 mt-1">
									Liquidity is set to unlock {{ liquidity.inputDays }} Days after the
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
										<div class="font-weight-bold fs-4 mb-2">CONNECTED ADDRESSES</div>
									</div>
								</div>
								<div class="row">
									<div class="col-12 mb-3">
										<div class="fs-4 font-weight-bold">Admin Address</div>
										<span class="font-weight-bold text-white mt-1 fs-2">
											{{ liquidity.wallet }}
										</span>
									</div>
									<div v-if="liquidity.auction" class="col-12 mb-3">
										<div class="fs-4 font-weight-bold">Auction Address</div>
										<span class="font-weight-bold text-white mt-1 fs-2">
											{{ liquidity.auctionAddress }}
										</span>
									</div>
									<div class="col-12">
										<div class="fs-4 font-weight-bold">Vault Address</div>
										<span class="font-weight-bold text-white mt-1 fs-2">
											{{ liquidity.vaultAddr }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="mt-5 pt-5">
					<base-divider />
					<div class="d-flex justify-content-between mt-4">
						<base-button
							tag="nuxt-link"
							to="/factory/liquidity"
							type="primary"
							style="border-radius: 1.85rem !important"
						>
							PREVIOUS
						</base-button>
						<base-button
							type="primary"
							style="border-radius: 1.85rem !important"
							@click="deployLiquidity"
						>
							DEPLOY
						</base-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { sendTransactionAndWait } from '@/services/web3/base'
import { to18Decimals } from '@/util'
import { dai, uniswapFactory as uniswapFactoryAddress } from '@/constants/contracts'
import { initContractInstance as misoLauncherContract } from '@/services/web3/liquidityLauncher'
import { BaseButton, BaseDivider } from '~/components'

export default {
	components: { BaseDivider, BaseButton },
	middleware: 'liquidity',
	data() {
		return {
			nextBtnLoading: false,
			deployedMarket: {
				address: '',
				txHash: '',
			},
		}
	},
	computed: {
		...mapGetters({
			liquidity: 'factory/liquidModel',
			coinbase: 'ethereum/coinbase',
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
		}),
	},
	mounted() {
		this.breackpoint = this.$screen.breakpoint
	},
	methods: {
		deployLiquidity() {
			return new Promise((resolve) => {
				this.nextBtnLoading = true
				const launcherTemplateID = 1
				const model = this.liquidity
				let data
				switch (launcherTemplateID) {
					case 1:
						data = this.getdataParams()
						break
					default:
						data = this.getdataParams()
						break
				}
				const method = misoLauncherContract().methods.createLauncher(
					launcherTemplateID,
					model.token.address,
					to18Decimals((model.tokenSupply * model.percent) / 100),
					dai.misoFeeAcct,
					data
				)

				sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
					this.nextBtnLoading = false
					if (receipt) {
						this.deployedMarket.txHash = receipt.transactionHash
						this.deployedMarket.address = receipt.events.MarketCreated.returnValues[1]
					}
					resolve(receipt.status)
				})
			})
		},
		getdataParams() {
			const model = this.liquidity
			const factory = uniswapFactoryAddress.address[this.currentProvidersNetworkId]
			const percent = (model.percent * 100).toFixed()
			const lockTime =
				(model.inputDays === null ? model.customDays : model.inputDays) * 3600 * 24

			const dataParams = [
				model.auctionAddress,
				factory,
				model.wallet,
				model.vaultAddr,
				percent,
				lockTime,
			]

			return web3.eth.abi.encodeParameters(
				['address', 'address', 'address', 'address', 'uint256', 'uint256'],
				dataParams
			)
		},
	},
}
</script>

<style lang="scss" scoped></style>
