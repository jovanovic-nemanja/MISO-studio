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
									@focus="focusInputCrowdsale('walletAddress')"
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
									Crowdsale Settings*
								</span>
							</div>
							<div class="row">
								<div class="col-md-6 form-group">
									<span class="font-weight-bold fs-4">PRICE PER TOKEN</span>

									<currency-input
										v-model="model.tokenPrice"
										:disabled="!tokensApproved"
										name="price per token"
										class="form-control font-weight-bold text-bg-white mt-2"
										placeholder="0"
										:currency="{
											suffix: ' ' + model.paymentCurrency.symbol || 'ETH',
										}"
										locale="en"
										:precision="Number(model.paymentCurrency.decimals)"
										:allow-negative="false"
										@focus="focusInputCrowdsale('tokenPrice')"
									/>
								</div>

								<div class="col-md-6 form-group">
									<div class="d-flex flex-column">
										<div
											class="
												text-capitalize
												font-weight-bold
												d-flex
												justify-content-between
											"
										>
											<span>MINIMUM TARGET</span>
											<span>{{ model.goal }} %</span>
										</div>
										<client-only>
											<vue-slider
												v-model="model.goal"
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
												class="vue-slider mt-4"
												@focus="focusInputCrowdsale('tokenPrice')"
											></vue-slider>
										</client-only>
									</div>
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
										:picker-options="{
											start: '00:00',
											step: '00:15',
											end: '23:59',
										}"
										format="MMMM dd, yyyy HH:mm:ss"
										placeholder="Select a start date for your auction"
										@focus="focusInputCrowdsale('startend')"
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
										:picker-options="{
											start: '00:00',
											step: '00:15',
											end: '23:59',
										}"
										placeholder="Select a end date for your auction"
										@focus="focusInputCrowdsale('startend')"
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
import { makeBatchCall } from '@/services/web3/base'
import { divNumbers, multiplyNumbers, toDecimalPlaces, toDecimals } from '@/util'
import { NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'
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
			crowdsaleitems: {
				tokenAddress: false,
				tokenAmount: false,
				payment_currency: false,
				walletAddress: false,
				tokenPrice: false,
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
			if (!this.model.allowance) return 0
			return toDecimals(this.model.allowance)
		},
		userHasToken() {
			return this.user.tokenBalance > 0
		},
		tokensApproved() {
			return (
				parseFloat(this.model.tokenSupply) !== 0 &&
				parseFloat(this.formatedAllowance) >= parseFloat(this.model.tokenSupply)
			)
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
			if (this.model.tokenPrice > 0 && this.model.tokenSupply > 0) {
				return (
					toDecimalPlaces(
						multiplyNumbers(this.model.tokenSupply, this.model.tokenPrice),
						this.model.paymentCurrency.decimals
					) +
					' ' +
					this.model.paymentCurrency.symbol
				)
			}
			return 0
		},
		minRaise() {
			if (this.maxRaise) {
				const med = this.maxRaise.split(' ')

				if (this.model.goal > 0 && med[0] > 0) {
					return (
						toDecimalPlaces(
							divNumbers(multiplyNumbers(med[0], this.model.goal), 100),
							this.model.paymentCurrency.decimals
						) +
						' ' +
						this.model.paymentCurrency.symbol
					)
				}
			}

			return 0
		},
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
			this.crowdsaleitems.walletAddress = false
			this.crowdsaleitems.tokenPrice = false
			this.crowdsaleitems.startend = false
			this.model.paymentCurrency = currency
			this.crowdsaleitems.payment_currency = true
			this.$emit('active-focus-crowdsale', this.crowdsaleitems, 1)
		},
		focusInputCrowdsale(val) {
			for (const key in this.crowdsaleitems) {
				if (val === key) {
					this.crowdsaleitems[key] = true
				} else {
					this.crowdsaleitems[key] = false
				}
			}
			this.$emit('active-focus-crowdsale', this.crowdsaleitems, 1)
		},
	},
}
</script>
<style></style>
