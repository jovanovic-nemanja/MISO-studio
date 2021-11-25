<template>
	<validation-observer ref="observer">
		<div>
			<div class="row">
				<div class="col-12 bottom-45">
					<div class="row">
						<div class="col-12 bottom-45">
							<payment-currency
								:tokens-approved="tokensApproved"
								@currency-updated="updateCurrency($event)"
							/>
						</div>

						<!-- input line 3 -->
						<div class="col-12 bottom-45">
							<div class="row mt-4">
								<base-input
									v-model="model.fundWallet"
									:disabled="!tokensApproved"
									class="col"
									name="address"
									placeholder="Enter the wallet address where funds raised will be sent"
									rules="required|isAddress"
									@focus="focusInput('walletAddress')"
								>
									<template #label>
										<span
											class="
												font-weight-bold
												fs-4
												text-secondary
												white-txt
												border-bottom
											"
										>
											Fund Wallet
										</span>
										*
									</template>
								</base-input>
							</div>
							<svg-icon
								class="svg-icon-left"
								icon="ethereum"
								height="24"
								width="20"
							/>
							<p
								class="font-weight-bold cursor-pointer text-underline"
								@click="selectCurrentAccount"
							>
								Use my account
							</p>
						</div>

						<!-- input line 1 -->
						<div class="col-12">
							<div class="mt-3 mb-2 fs-2">
								<span
									class="font-weight-bold fs-4 text-secondary white-txt border-bottom"
								>
									Dutch Auction Settings*
								</span>
							</div>
							<div class="row">
								<div class="col-md-6 form-group">
									<span class="font-weight-bold fs-4">STARTING PRICE</span>
									<br />
									<i>Dutch auctions start high, and lowers over time</i>
									<br />

									<currency-input
										v-model="model.startPrice"
										:disabled="!tokensApproved"
										name="starting price"
										class="form-control font-weight-bold text-bg-white mt-2"
										placeholder="0"
										:currency="{
											suffix: ' ' + model.paymentCurrency.symbol || 'ETH',
										}"
										locale="en"
										:precision="Number(model.paymentCurrency.decimals)"
										:allow-negative="false"
										@focus="focusInput('dutchSettings')"
									/>
								</div>

								<div class="col-md-6 form-group">
									<span class="font-weight-bold fs-4">ENDING PRICE</span>
									<br />
									<i>Auction ends at this price</i>
									<br />

									<currency-input
										v-model="model.minPrice"
										:disabled="!tokensApproved"
										name="minimum price"
										class="form-control font-weight-bold text-bg-white mt-2"
										placeholder="0"
										:currency="{
											suffix: ' ' + model.paymentCurrency.symbol || 'ETH',
											distractionFree: true,
											valueRange: { min: 0 },
											allowNegative: false,
										}"
										locale="en"
										:precision="Number(model.paymentCurrency.decimals)"
										:allow-negative="false"
										@focus="focusInput('dutchSettings')"
									/>
								</div>
							</div>
						</div>

						<!-- input line 2 -->
						<div class="col-12">
							<div class="row mt-4">
								<div class="col-md-6 form-group">
									<i class="el-icon-bottom-right"></i>
									<span class="font-weight-bold fs-4">MAXIMUM RAISED</span>
									<br />
									<i>
										Maximum amount raised if all tokens are
										<br />
										sold at highest price possible
									</i>
									<br />
									<div class="mt-2 max_raise text-center">
										{{ maxRaise }}
									</div>
								</div>

								<div class="col-md-6 form-group">
									<i class="el-icon-bottom-right"></i>
									<span class="font-weight-bold fs-4">MINIMUM RAISED</span>
									<br />
									<i>
										Minimum amount raised in order to have
										<br />
										a successful auction
									</i>
									<br />
									<div class="mt-2 max_raise text-center">
										{{ minRaise }}
									</div>
								</div>
							</div>
						</div>

						<!-- input line 3 -->
						<div class="col-12">
							<div class="mt-3 mb-2 fs-2 mt-5">
								<span
									class="font-weight-bold fs-4 text-secondary white-txt border-bottom"
								>
									Auction Start & End*
								</span>
							</div>
							<div class="row">
								<base-input
									:disabled="!tokensApproved"
									class="col-md-6 right-icon position-relative"
									name="start date"
									type="text"
									:rules="`required|afterNow:${(model.startDate, 'start date')}`"
								>
									<el-date-picker
										v-model="model.startDate"
										:disabled="!tokensApproved"
										type="datetime"
										format="MMMM dd, yyyy HH:mm:ss"
										placeholder="Select a start date for your auction"
										:picker-options="{
											start: '00:00',
											step: '00:15',
											end: '23:59',
										}"
										@focus="focusInput('startend')"
									></el-date-picker>
									<template #timestemp>
										<span class="position-absolute timeZone text-white">
											{{ getStartTimeAbbr }}
										</span>
									</template>
								</base-input>
								<base-input
									:disabled="!tokensApproved"
									class="col-md-6 right-icon position-relative"
									name="end date"
									type="text"
									:rules="`required|afterNow:${(model.endDate, 'end date')}`"
								>
									<el-date-picker
										v-model="model.endDate"
										:disabled="!tokensApproved"
										type="datetime"
										format="MMMM dd, yyyy HH:mm:ss"
										placeholder="Select a end date for your auction"
										:picker-options="{
											start: '00:00',
											step: '00:15',
											end: '23:59',
										}"
										@focus="focusInput('startend')"
									></el-date-picker>
									<template #timestemp>
										<span class="position-absolute timeZone text-white">
											{{ getStartTimeAbbr }}
										</span>
									</template>
								</base-input>
							</div>
						</div>
					</div>
				</div>
				<div class="col-12">
					<div class="line-divider"></div>
				</div>
			</div>
		</div>
	</validation-observer>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { DatePicker, TimeSelect } from 'element-ui'
import { getContractInstance as erc20Contract } from '@/services/web3/erc20Token'
import { misoMarket as misoMarketConfig } from '@/constants/contracts'
import { NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'
import { makeBatchCall } from '@/services/web3/base'
import { multiplyNumbers, toDecimalPlaces, toDecimals } from '@/util'
import { duration } from '@/mixins/duration.js'
import PaymentCurrency from '../PaymentCurrency.vue'
export default {
	components: {
		[DatePicker.name]: DatePicker,
		[TimeSelect.name]: TimeSelect,
		PaymentCurrency,
	},
	mixins: [duration],
	props: {
		initModel: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			misoMarketAddress: '',
			user: {
				tokenBalance: 0,
				allowance: '',
			},
			tokensLoading: false,
			userLoading: false,
			approveLoading: false,
			items: {
				auctionType: false,
				tokenAddress: false,
				tokenAllowance: false,
				tokenAmount: false,
				payment_currency: false,
				walletAddress: false,
				dutchSettings: false,
				startend: false,
			},
		}
	},
	computed: {
		model() {
			return this.initModel
		},
		isETH() {
			return this.model.paymentCurrency.address === NATIVE_CURRENCY_ADDRESS
		},
		paymentType() {
			return this.isETH ? 'ETH' : 'ERC20'
		},
		...mapGetters({
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
			coinbase: 'ethereum/coinbase',
			walletFound: 'ethereum/walletFound',
			explorer: 'ethereum/explorer',
			tokens: 'tokens/list',
		}),
		formatedTokenBalance() {
			if (!this.user.tokenBalance) return 0
			return toDecimals(this.user.tokenBalance)
		},
		formatedAllowance() {
			if (!this.user.allowance) return 0
			return toDecimals(this.user.allowance)
		},
		userHasToken() {
			return this.user.tokenBalance > 0
		},
		tokensApproved() {
			return parseFloat(this.model.allowanceformatted) !== 0
		},
		getStartTimeAbbr() {
			return new Date(this.model.startDate)
				.toLocaleTimeString('en-us', { timeZoneName: 'short' })
				.split(' ')[2]
		},
		getEndTimeAbbr() {
			return new Date(this.model.endDate)
				.toLocaleTimeString('en-us', { timeZoneName: 'short' })
				.split(' ')[2]
		},
		maxRaise() {
			if (this.model.startPrice !== '') {
				return (
					toDecimalPlaces(
						multiplyNumbers(this.model.tokenSupply, this.model.startPrice),
						this.model.paymentCurrency.decimals
					) +
					' ' +
					this.model.paymentCurrency.symbol
				)
			}
			return 0
		},
		minRaise() {
			if (this.model.minPrice !== '') {
				return (
					toDecimalPlaces(
						multiplyNumbers(this.model.tokenSupply, this.model.minPrice),
						this.model.paymentCurrency.decimals
					) +
					' ' +
					this.model.paymentCurrency.symbol
				)
			}
			return 0
		},
	},
	async mounted() {
		this.misoMarketAddress = misoMarketConfig.address[this.currentProvidersNetworkId]
		const tokenAddress = this.model.token.address
		if ((tokenAddress || '').length > 0) {
			await this.fetchTokens()
			const matches = this.tokens.filter(
				(token) => token.addr.toLowerCase() === tokenAddress.toLowerCase()
			)
			if (matches.length > 0) {
				this.handleTokenComplete(matches[0])
			}
		}
	},
	methods: {
		...mapActions({
			getTokens: 'tokens/getTokens',
		}),
		validate() {
			return this.$refs.observer.validate().then((res) => {
				this.$emit('on-validated', res, this.model)
				return res && this.model.paymentCurrency.address
			})
		},
		async fetchTokens() {
			// Clear Tokens
			this.user.allowance = 0
			this.user.tokenBalance = 0
			this.model.token.name = ''
			this.model.token.symbol = ''
			this.model.token.decimals = ''

			// Get Tokens
			if (!this.tokensLoading) {
				this.tokensLoading = true
				if (this.tokens.length === 0) {
					await this.getTokens()
				}
				this.tokensLoading = false
			}
		},
		async updateUserInfo() {
			this.userLoading = true
			const methods = [
				{
					methodName: 'allowance',
					args: [this.coinbase, this.misoMarketAddress],
				},
				{
					methodName: 'balanceOf',
					args: [this.coinbase],
				},
			]

			const data = await makeBatchCall(
				erc20Contract(this.model.token.address),
				methods
			)
			if (data) {
				;[this.user.allowance, this.user.tokenBalance] = data
				this.model.allowanceformatted = toDecimals(this.user.allowance)
			}
			this.userLoading = false
		},

		handleTokenComplete(token) {
			this.model.token = {
				address: token.addr,
				name: token.name,
				symbol: token.symbol,
				decimals: token.decimals,
			}
			this.updateUserInfo()
		},
		selectCurrentAccount() {
			this.model.fundWallet = this.coinbase
		},
		updateCurrency(currency) {
			this.items.walletAddress = false
			this.items.dutchSettings = false
			this.items.startend = false
			this.model.paymentCurrency = currency
			this.items.payment_currency = true
			this.$emit('active-focus', this.items, this.model.chosenAuctionType)
		},
		focusInput(val) {
			for (const key in this.items) {
				if (val === key) {
					this.items[key] = true
				} else {
					this.items[key] = false
				}
			}
			this.$emit('active-focus', this.items, this.model.chosenAuctionType)
		},
	},
}
</script>

<style lang="scss">
.timeZone {
	top: 45px;
	right: 30px;
}
.right-icon {
	.el-input__prefix {
		font-size: 20px;
		margin-right: 10px;
	}
	.el-input__inner {
		padding-left: 40px;
	}
}
.svg-icon-left {
	position: absolute;
	z-index: 10;
	right: 25px !important;
	top: 65px;
	left: auto !important;
}
.label-underline {
	padding-left: 0;
}
.label-underline label {
	border-bottom: 1px solid #ffffff;
	font-weight: bold;
	font-size: 18px;
	color: #ffffff;
}

.el-date-picker .el-picker-panel__footer .el-button:first-child {
	display: none;
}
.custom {
	input {
		padding-right: 80px !important;
		border: 0.0625rem solid #23306b !important;
		background: #000a35 !important;
	}
	&-token {
		top: 35%;
		transform: translateY(-35%);
		right: 30px;
	}
}
.input {
	&_days {
		margin-top: 0.5rem;
		.form-group {
			margin-bottom: 0;
		}
		input {
			&:disabled::placeholder {
				color: #6c757c;
			}
			&::placeholder {
				color: #fff;
			}
		}
	}
	&_hours {
		margin-top: 0.5rem;
		input {
			&:disabled::placeholder {
				color: #6c757c;
			}
			&::placeholder {
				color: #fff;
			}
		}
	}
}
.endDate {
	input::placeholder {
		color: #cad1d7;
		font-weight: normal;
	}
	.input-group-text {
		padding: 6px 0 6px 6px !important;
		color: #cad1d7 !important;
	}
}
.alert_left {
	padding: 0px;
}
.ma-30 {
	margin-bottom: 30px;
}

.padding-left-15 {
	padding-left: 15px;
}
.position-auction-token-absolute {
	top: 50px;
	right: 210px;
	position: absolute;
}
.btn-custom {
	padding: 12px 40px;
	background: rgb(240, 74, 39);
	background: linear-gradient(
		90deg,
		rgba(240, 74, 39, 1) 0%,
		rgba(246, 116, 64, 1) 50%,
		rgba(236, 68, 34, 1) 100%
	);
	box-shadow: none;
	border-width: 1px;
	border: none;
	&_white {
		border: 1px solid #ffffff;
	}
}
.bottom-45 {
	padding-bottom: 45px;
}
.el-icon-bottom-right {
	font-size: 16px;
}
.max_raise {
	width: 128px;
	border-radius: 10px;
	background: rgba(246, 102, 69, 0.4);
}
</style>
