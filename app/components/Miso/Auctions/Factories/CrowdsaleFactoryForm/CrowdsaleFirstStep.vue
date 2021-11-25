<template>
	<div>
		<validation-observer ref="observer">
			<div class="row">
				<div class="col-12 ma-30">
					<div class="justify-content-between row align-items-center">
						<!-- Token input -->
						<div
							v-if="model.token.name"
							class="d-flex align-items-center col-lg-12 padding-left-15"
						>
							<autocomplete
								v-if="model.token.name"
								v-model="model.token.address"
								class="label-underline"
								label="Token"
								name="token"
								placeholder="Type to search (name, symbol, address)"
								rules="required|isAddress"
								:suggestions="tokens"
								:loading="tokensLoading"
								:no-data="'No Tokens'"
								:style="{ flex: 1 }"
								@input="fetchTokens"
								@focus="focusInputCrowdsale('tokenAddress')"
								@complete="handleTokenComplete"
							></autocomplete>

							<div class="text-right ml-4 mt-4">
								<base-button
									class="text-capitalize btn btn-customs btn-disabled btn-default"
								>
									{{ model.token.name }} ({{ model.token.symbol }})
								</base-button>
							</div>
						</div>

						<autocomplete
							v-else
							v-model="model.token.address"
							class="label-underline col-lg-12 padding-left-15"
							label="Token"
							name="token"
							placeholder="Type to search (name, symbol, address)"
							rules="required|isAddress"
							:suggestions="tokens"
							:loading="tokensLoading"
							:no-data="'No Tokens'"
							@focus="focusInputCrowdsale('tokenAddress')"
							@input="fetchTokens"
							@complete="handleTokenComplete"
						></autocomplete>

						<div class="fs-2 pl-3">
							Don't have a token?
							<nuxt-link
								v-slot="{ navigate }"
								custom
								to="/factory/token"
								class="font-weight-bold text-white underline"
							>
								<span class="cursor-pointer" role="link" @click="navigate">
									<u>Create it now!</u>
								</span>
							</nuxt-link>
						</div>
					</div>
				</div>

				<!-- Alert -->
				<div class="col-12">
					<base-alert v-if="!coinbase" type="danger">
						<strong>Error</strong>
						<span class="alert-inner--text">
							Account is not connected. Please connect wallet to be able to proceed
						</span>
					</base-alert>
					<base-alert v-else-if="userHasToken" type="secondary">
						<div class="text-primary">
							<span class="alert-inner--text text-primary">
								<strong>Note:</strong>
								Your
								<strong>token balance</strong>
								must be higher than or equal to
								<strong>allowance</strong>
								.
								<strong>Token amount</strong>
								must be lower or equal to
								<strong>allowance</strong>
								, otherwise you can approve the new allowance in any amount.
							</span>
						</div>
					</base-alert>
					<base-alert v-else-if="model.token.symbol && !userLoading" type="danger">
						<span class="alert-inner--text">
							You don't have any {{ model.token.symbol }}
						</span>
					</base-alert>
				</div>

				<!-- Approve -->
				<div class="col-12">
					<div class="d-flex justify-content-between">
						<div class="d-flex flex-column">
							<span class="font-weight-bold">YOUR TOKEN BALANCE</span>
							<span class="font-weight-bold text-white">
								{{ formatedTokenBalance }} {{ model.token.symbol }}
							</span>
						</div>
						<div
							v-if="model.token.address && coinbase"
							class="d-flex flex-column step"
						>
							<base-button class="btn" :loading="userLoading" @click="updateUserInfo">
								refresh
							</base-button>
						</div>
						<div class="d-flex flex-column">
							<span class="font-weight-bold">YOUR TOKEN ALLOWANCE</span>
							<span class="font-weight-bold text-white">
								{{ formatedAllowance }} {{ model.token.symbol }}
							</span>
						</div>
					</div>
					<div class="mt-5">
						<base-input
							v-model="model.tokenSupply"
							:disabled="!userHasToken"
							name="token amount"
							placeholder="Token amount"
							type="number"
							:rules="`required|decimal|max_value:${formatedTokenBalance}`"
							@focus="focusInputCrowdsale('tokenAmount')"
						>
							<template #label>
								<span class="font-weight-bold">TOKEN AMOUNT</span>
							</template>
						</base-input>
					</div>
					<div v-if="!tokensApproved && model.tokenSupply > 0" class="mt-5">
						<base-button class="btn" :loading="approveLoading" @click="approve()">
							Approve
						</base-button>
					</div>
				</div>

				<div class="col-12">
					<div class="line-divider my-5"></div>
				</div>
			</div>
		</validation-observer>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BaseAlert } from '@/components'
import { DatePicker, TimeSelect } from 'element-ui'
import { getContractInstance as erc20Contract } from '@/services/web3/erc20Token'
import { misoMarket as misoMarketConfig } from '@/constants/contracts'
import { makeBatchCall, sendTransactionAndWait } from '@/services/web3/base'
import { toDecimals, to18Decimals } from '@/util'
import { duration } from '@/mixins/duration.js'
import Autocomplete from '@/components/Inputs/Autocomplete'

export default {
	components: {
		[DatePicker.name]: DatePicker,
		[TimeSelect.name]: TimeSelect,
		Autocomplete,
		BaseAlert,
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
			goalPercentage: 0,
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
		...mapGetters({
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
			coinbase: 'ethereum/coinbase',
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
				return parseFloat(this.model.tokenSupply) * parseFloat(this.model.tokenPrice)
			}
			return 0
		},
		minRaise() {
			if (this.maxRaise) {
				const med = this.maxRaise.split(' ')

				if (this.model.goal > 0 && med[0] > 0) {
					return (
						(parseFloat(med[0]) * parseFloat(this.model.goal)) / 100 +
						' ' +
						this.model.paymentCurrency.symbol
					)
				}
			}

			return 0
		},
	},
	watch: {
		goalPercentage() {
			this.model.goal = this.minRaise
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
				this.model.allowance = this.user.allowance
				this.model.allowanceformatted = toDecimals(this.user.allowance)
			}
			this.userLoading = false
		},
		approve() {
			if (!this.tokensApproved) {
				this.approveLoading = true
				const method = erc20Contract(this.model.token.address).methods.approve(
					this.misoMarketAddress,
					to18Decimals(this.model.tokenSupply)
				)

				sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
					if (receipt.status) {
						this.user.allowance = receipt.events.Approval.returnValues[2]
						this.model.allowance = this.user.allowance
						this.model.allowanceformatted = toDecimals(this.user.allowance)
					}
					this.approveLoading = false
				})
			}
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
			this.model.paymentCurrency = currency
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

<style lang="scss">
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
	left: 10px;
}
.el-date-picker .el-picker-panel__footer .el-button:first-child {
	display: none;
}
.btn-disabled {
	cursor: default !important;
}
.btn-customs {
	// padding: 12px 40px;
	border-radius: unset;
	height: 38px;
}
.dropdown-menu.show {
	min-width: calc(100% - 30px);
	margin-left: 15px;
}
</style>
