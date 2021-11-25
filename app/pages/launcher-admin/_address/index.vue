<template>
	<div>
		<div class="row d-flex justify-content-center">
			<div class="col-md-11 mt-6">
				<div v-if="!loading">
					<!---- Liquidity Launcher details !---->
					<div class="hero-section mt-4 pt-3 pb-2 position-relative">
						<span
							class="
								text-uppercase text-secondary
								font-weight-bold
								border-bottom
								pb-1
								fs-4
								h-100
							"
						>
							LIQUIDITY LAUNCHER DETAILS
						</span>
						<hr class="mt-4" />
						<span class="fs-3 text-white text-secondary mt-4">
							Liquidity Receiving Address
						</span>
						<p class="mt-2">
							The LP tokens will transferred to this wallet after lock up duration is
							over.
						</p>
					</div>
					<div>
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateLauncherWallet">
								<div class="row">
									<div class="col-md-5 mt-3">
										<base-input
											v-model="wallet"
											name="address"
											placeholder=""
											type="text"
											rules="required|isAddress"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
											:loading="waitingForWallet"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
					</div>

					<!---- CANCEL LIQUIDITY LAUNCHER !---->
					<div v-if="liquidityStatus !== 2">
						<div class="hero-section mt-4 pt-3 pb-2 position-relative">
							<span
								class="
									text-uppercase text-secondary
									font-weight-bold
									border-bottom
									pb-2
									fs-4
									h-100
								"
							>
								CANCEL LIQUIDITY LAUNCHER
							</span>
							<p class="mt-4">
								The liquidity launcher can only be cancelled by the admin before the
								launcher is launched.
								<br />
								Please use the section below to withdraw the tokens from the liquidity
								launcher after cancelling it.
							</p>
						</div>
						<div class="d-flex">
							<base-button
								class="float-left"
								type="primary"
								:disabled="isLiquidityCancelled"
								:loading="waitingForCancel"
								@click="cancelLiquidityLauncher"
							>
								{{ isLiquidityCancelled ? 'Cancelled' : 'Cancel' }}
							</base-button>
						</div>
					</div>

					<!---- WITHDRAW DEPOSITS !---->
					<div class="hero-section mt-4 pt-3 pb-2 position-relative">
						<span
							class="
								text-uppercase text-secondary
								font-weight-bold
								border-bottom
								pb-2
								fs-4
								h-100
							"
						>
							WITHDRAW DEPOSITS
						</span>
						<p class="mt-4">
							{{
								`The admin will be able to withdraw the remaining deposits after the
							launcher is launched. ${liquidityPercent}% of the rasied is set to be deposited`
							}}
							<br />
							to SushiSwap liquidity pool. The remaining amount is available for claim
							from the launcher contract after the launcher is launched.
						</p>
					</div>
					<base-button
						class="float-left"
						type="primary"
						:disabled="isLiquidityNotLaunched"
						:loading="waitingForWithdraw"
						@click="withdrawDeposit"
					>
						Withdraw Deposits
					</base-button>
				</div>

				<loader v-else width="80" height="80" y="250" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import BigNumber from 'bignumber.js'

import { getContractInstance as postAuctionLauncherContract } from '@/services/web3/postAuctionLauncher'
import { makeBatchCall, sendTransactionAndWait } from '@/services/web3/base'

export default {
	name: 'AuctionAdminInfo',
	data() {
		return {
			launcherAddress: this.$route.params.address,
			liquidityStatus: 0,
			liquidityTemplate: null,
			wallet: '',
			launcherInfo: null,
			lpTokenAddress: null,
			lpTokenBalance: 0,
			isAdmin: false,
			contractInstance: null,
			loading: true,
			waitingForWallet: false,
			waitingForCancel: false,
			waitingForWithdraw: false,
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
		}),
		liquidityPercent() {
			return this.launcherInfo ? this.launcherInfo.liquidityPercent / 100 : 0
		},
		isLiquidityNotLaunched() {
			return this.launcherInfo ? !this.launcherInfo.launched : true
		},
		isLiquidityCancelled() {
			return this.liquidityStatus === -1
		},
	},
	async mounted() {
		this.contractInstance = postAuctionLauncherContract(this.launcherAddress)

		await this.getLauncherInfo()

		this.loading = false
	},
	methods: {
		async getLauncherInfo() {
			// Get Liquidity Template
			try {
				const liquidityMethods = [
					{ methodName: 'liquidityTemplate' },
					{ methodName: 'wallet' },
					{ methodName: 'launcherInfo' },
					{ methodName: 'getLPTokenAddress' },
					{ methodName: 'hasAdminRole', args: [this.coinbase] },
				]
				const [liquidityTemplate, wallet, launcherInfo, lpTokenAddress, isAdmin] =
					await makeBatchCall(this.contractInstance, liquidityMethods)

				this.liquidityTemplate = Number(liquidityTemplate)
				this.wallet = wallet
				this.launcherInfo = launcherInfo
				this.lpTokenAddress = lpTokenAddress
				this.isAdmin = isAdmin

				// Get LP Balance
				try {
					const method = [
						{
							methodName: 'getLPBalance',
						},
					]
					const [lpTokenBalance] = await makeBatchCall(this.contractInstance, method)
					this.lpTokenBalance = lpTokenBalance
				} catch (error) {
					this.lpTokenBalance = 0
				}

				// Check the Liquidity Status
				if (launcherInfo.launched) {
					if (BigNumber(this.lpTokenBalance).isGreaterThan(0)) {
						this.liquidityStatus = 2 // Launcher is successfully finalized
					} else {
						this.liquidityStatus = -1 // Launcher is cancelled
					}
				} else {
					this.liquidityStatus = 1 // Launcher is not finalized yet
				}
			} catch (error) {
				this.liquidityStatus = 0 // No Launcher
				this.liquidityTemplate = null
				this.lpTokenAddress = null
				this.lpTokenBalance = 0
				this.launcherInfo = null
				this.isAdmin = false
			}
		},
		updateLauncherWallet() {
			this.waitingForWallet = true

			const method = this.contractInstance.methods.setWallet(this.wallet)

			sendTransactionAndWait(method, { from: this.coinbase }, (_) => {
				this.waitingForWallet = false
			})
		},
		cancelLiquidityLauncher() {
			this.waitingForCancel = true

			const method = this.contractInstance.methods.cancelLauncher()

			sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
				this.waitingForWallet = false
				console.log('===>', receipt)
				if (receipt.status) {
					this.launcherInfo.launched = true
					this.liquidityStatus = -1
				}
			})
		},
		withdrawDeposit() {
			this.waitingForWithdraw = true

			const method = this.contractInstance.methods.withdrawDeposits()

			sendTransactionAndWait(method, { from: this.coinbase }, (_) => {
				this.waitingForWithdraw = false
			})
		},
	},
}
</script>
