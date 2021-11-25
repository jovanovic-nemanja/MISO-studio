<template>
	<div>
		<validation-observer ref="observer">
			<div class="row">
				<div class="col-12">
					<div class="d-flex">
						<div class="d-inline border-bottom mb-4">
							<div
								class="font-weight-bold fs-4 mb-2"
								:class="{ 'text-white': type !== '' }"
							>
								LIQUIDITY PAIR TOKEN*
							</div>
						</div>
						<div class="ml-5 mb-4 liquidity_pair_token text-center py-2">
							{{ model.token.symbol }} + {{ model.auction.payment_currency }}
						</div>
					</div>
					<div
						class="
							border-miso
							radio_wrapper
							d-flex
							justify-content-between
							align-items-center
						"
					>
						<div
							v-if="data.auction.payment_currency === nativeCurrency.symbol"
							class="d-flex align-items-center pl-3"
							style="cursor: not-allowed"
						>
							<base-radio
								v-model="model.auction.payment_currency"
								:name="nativeCurrency.symbol"
								class="text-white font-weight-bold fs-4 mr-3 mb-2"
							>
								{{ nativeCurrency.name }}
							</base-radio>
							<svg-icon
								v-if="data.auction.payment_currency == 'ETH'"
								icon="ethereum"
								height="30"
								width="30"
							/>
						</div>
						<div
							v-else-if="data.auction.payment_currency === 'DAI'"
							class="d-flex align-items-center pl-3"
							style="cursor: not-allowed"
						>
							<base-radio
								v-model="model.auction.payment_currency"
								name="DAI"
								class="text-white font-weight-bold fs-3 mr-3 mb-2"
							>
								DAI
							</base-radio>
							<div class="tokenImage">
								<img src="@/assets/svg/DAI.svg" alt="DAI" class="img-fluid" />
							</div>
						</div>
						<div
							v-else-if="data.auction.payment_currency === 'USDC'"
							class="d-flex align-items-center pl-3"
							style="cursor: not-allowed"
						>
							<base-radio
								v-model="model.auction.payment_currency"
								name="USDC"
								class="text-white font-weight-bold mr-3 mb-2"
								:class="computedFontSize"
							>
								USDC
							</base-radio>
							<div class="tokenImage">
								<img src="@/assets/svg/USD.svg" alt="USDC" />
							</div>
						</div>
						<div
							v-else-if="data.auction.payment_currency === 'USDT'"
							class="d-flex align-items-center pl-3"
							style="cursor: not-allowed"
						>
							<base-radio
								v-model="model.auction.payment_currency"
								name="USDT"
								class="text-white font-weight-bold fs-4 mr-3 mb-2"
								style="cursor: not-allowed"
							>
								TETHER (USDT)
							</base-radio>
							<div class="tokenImage">
								<img src="@/assets/svg/USDT.svg" alt="USDT" class="img-fluid" />
							</div>
						</div>
						<div
							v-else
							class="d-flex col-12 align-items-center pl-3"
							style="cursor: not-allowed"
						>
							<base-radio
								v-model="model.auction.payment_currency"
								:name="model.auction.payment_currency"
								class="text-white col-2 font-weight-bold fs-4 mr-3 mb-2"
							>
								CUSTOM
							</base-radio>
							<base-input
								v-model="customModel"
								:disabled="true"
								class="custom-input custom-disabled-input col-10 p-0"
								name="token"
							/>
						</div>
					</div>

					<div class="row p-3">
						<div class="">
							Liquidity pair token is set to the payment currency from your auction.
						</div>
					</div>
				</div>
				<div class="col-12 mt-5">
					<div class="d-flex">
						<div class="d-inline border-bottom mb-4">
							<div
								class="font-weight-bold fs-4 mb-2"
								:class="{ 'text-white': amountType !== '' }"
							>
								SUSHI LIQUIDITY PROVISIONING*
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-12 mb-4">
							<div
								class="d-flex align-items-center justify-content-between slider-label"
							>
								<span class="fs-2">
									Ballance: {{ model.tokenbalance }}
									{{ model.token.symbol }}
								</span>
								<span class="fs-2">
									Allowance: {{ model.allowance }} {{ model.token.symbol }}
								</span>
							</div>
						</div>
						<div class="col-12 mb-4">
							<div
								class="d-flex align-items-center justify-content-between slider-label"
							>
								<span class="fs-1">
									{{ progressPercent > 100 ? '0' : progressPercent }}%
								</span>
								<span class="fs-1">
									100% ({{ model.tokenSupply }} {{ model.token.symbol }})
								</span>
							</div>
						</div>

						<div class="col-12">
							<div class="position-relative d-flex">
								<div class="w-100">
									<client-only>
										<vue-slider
											v-model="userLimit"
											:max="100"
											:min="0"
											:interval="1"
											:dot-style="{
												background: '#f46e41',
											}"
											:process-style="{
												background: '#f46e41',
											}"
											tooltip="none"
											class="vue-slider"
										></vue-slider>
									</client-only>
								</div>
							</div>
						</div>
						<div class="col-12 mt-4">
							<base-input
								v-model="tokenAmount"
								type="number"
								step="1"
								name="input"
								:bg-color="['#20284E', '#D5D6DC']"
								:rules="`required|max_value:${formatedTokenBalance}`"
								input-classes="is-small invest-input font-weight-bolder"
								sixe="md"
								rounded
							/>
						</div>
						<div class="col-12 mt-4">
							<div
								v-if="
									!tokensApproved &&
									model.amount !== '' &&
									model.amount !== '0' &&
									model.amount !== 0
								"
								class="h-100 invest invest-bg d-sm-block d-none"
							>
								<base-button
									:round="true"
									class="
										btn btn
										font-weight-bold
										text-uppercase
										fs-2
										px-5
										is-rounded
										btn-default
										py-3
									"
									:loading="approveLoading"
									@click="approve()"
								>
									approve
								</base-button>
							</div>
						</div>
						<div class="col-12">
							<div class="mt-5 fs-2">
								The amount raised from the auction, pairing with tokens to be launched
								on SushiSwap with equal weighting in the liquidity pool.
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
import { toDecimals, to18Decimals } from '@/util'
import { getContractInstance as erc20Contract } from '@/services/web3/erc20Token'
import { misoLauncher as misoLauncherAddress } from '@/constants/contracts'
// import { makeBatchCall } from '@/services/web3/base'
import BigNumber from 'bignumber.js'
import { sendTransactionAndWait } from '@/services/web3/base'

export default {
	name: 'SecondStep',
	props: {
		data: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			colors: {
				token: false,
			},
			type: 'ETH',
			amountType: 'input',
			inputActive: false,
			customType: '',
			percentage: 0,
			activeSection: {
				provision: false,
			},
			rule: '',
			approveLoading: false,
			user: {
				tokenBalance: 0,
				allowance: '',
			},
			userTokens: 0,
			progressPercent: 0,
		}
	},
	computed: {
		...mapGetters({
			nativeCurrency: 'ethereum/nativeCurrency',
			coinbase: 'ethereum/coinbase',
			tokens: 'tokens/list',
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
		}),
		model() {
			return this.data
		},
		computedFontSize() {
			const width = this.$screen.width
			if (width >= 1200 && width <= 1400) {
				return 'fs-xs'
			}
			return 'fs-1'
		},
		computedCustomType() {
			if (this.custom === 'custom') {
				return true
			}
			return false
		},
		// user remaining tokens
		remainingTokens() {
			const userEth = 10 // wallet max Eth
			const rate = 0.0001 // rate ETH - token
			const submitedTokens = userEth / rate - this.model.amount
			return this.model.amount !== '' ? submitedTokens : 0
		},
		customModel() {
			return (
				this.model.auction.address +
				' ( ' +
				this.model.auction.payment_currency_name +
				' - ' +
				this.model.auction.payment_currency +
				' )'
			)
		},
		tokensApproved() {
			return (
				parseFloat(this.model.amount) !== 0 &&
				parseFloat(this.formatedAllowance) >= parseFloat(this.model.amount)
			)
		},
		formatedAllowance() {
			if (!this.model.allowance) return 0
			return this.model.allowance
		},
		formatedTokenBalance() {
			if (!this.model.allowance) return 0
			if (!this.model.tokenbalance) return 0
			if (
				BigNumber(this.model.tokenbalance).isGreaterThan(
					BigNumber(this.model.allowance)
				)
			)
				return this.model.allowance
			return this.model.tokenbalance
		},
		userLimit: {
			get() {
				return this.userTokens
			},
			set(val) {
				this.updateTokenlimitAmount(val)
			},
		},
		tokenAmount: {
			get() {
				return this.model.amount
			},
			set(val) {
				this.updateTokenAmount(val)
			},
		},
	},
	watch: {
		customType(val) {
			const typeChecks = ['USD', this.nativeCurrency.symbol, 'DAI', 'USDT']
			typeChecks.forEach((el) => {
				if (el !== this.customType) {
					this.model.type = val
				} else {
					this.type = val
					this.inputActive = false
					this.customType = ''
				}
			})
		},
		type(val) {
			if (val !== 'custom') {
				this.rule = ''
				this.model.type = val
				this.inputActive = false
			} else {
				this.rule = 'required'
				this.inputActive = true
			}
		},
	},
	created() {
		console.log(this.data)
		const typeChecks = ['USD', this.nativeCurrency.symbol, 'DAI', 'USDT']
		if (this.data) {
			Object.assign(this.model, this.data)
			typeChecks.forEach((el) => {
				if (el !== this.model.type) {
					this.type = 'custom'
					this.customType = this.model.type
				} else {
					this.type = this.data.type
				}
			})
		}
	},
	methods: {
		validate() {
			return this.$refs.observer.validate().then((res) => {
				this.$emit('on-validated', res, this.model)
				return res
			})
		},
		activeSectionCalc(val) {
			for (const key in this.activeSection) {
				if (val === key) {
					this.activeSection[key] = true
				} else {
					this.activeSection[key] = false
				}
			}
			this.$emit('active-input', this.activeSection)
		},
		approve() {
			this.approveLoading = true
			const method = erc20Contract(this.model.token.address).methods.approve(
				misoLauncherAddress.address[this.currentProvidersNetworkId],
				to18Decimals(this.model.amount)
			)

			sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
				if (receipt.status) {
					this.user.allowance = receipt.events.Approval.returnValues[2]
					this.model.allowance = toDecimals(this.user.allowance)
				}
				this.approveLoading = false
			})
		},
		updateTokenlimitAmount(val) {
			this.progressPercent = val
			const ratio = this.model.tokenSupply / 100
			this.model.amount = ratio * val
			this.model.percent = this.progressPercent
		},
		updateTokenAmount(val) {
			const ratio = val / this.model.tokenSupply
			this.userTokens = 100 * ratio
			this.progressPercent = this.userTokens
			this.model.amount = val
			this.model.percent = this.progressPercent
		},
	},
}
</script>

<style lang="scss" scoped>
.radio {
	&_wrapper {
		height: 54px;
	}
}
.amount {
	&_or {
		width: 15%;
		position: relative;
	}
	&_section {
		width: calc(85% / 2);
	}
}
.slider-label {
	margin-bottom: -15px;
}
.fs-xs {
	font-size: 10px !important;
}
.custom-input {
	height: 50px !important;
}
.tokenImage {
	width: 30px;
	height: 30px;
	img {
		width: 100%;
		height: 100%;
		@media screen and (max-width: 1400px) and (min-width: 1200px) {
			max-width: none;
			width: 20px;
			height: 20px;
		}
	}
}
</style>

<style>
.custom-input input {
	height: 50px !important;
}
@media screen and (max-width: 1400px) and (min-width: 1200px) {
	.radio_wrapper label {
		font-size: 10px !important;
	}
}
.liquidity_pair_token {
	width: 128px;
	border-radius: 10px;
	background: rgba(246, 102, 69, 0.4);
}
.custom-disabled-input input {
	color: #fff !important;
}
.invest button {
	background: #f46e41 !important;
}
</style>
