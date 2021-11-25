<template>
	<validation-observer ref="observer">
		<div>
			<div class="row mb-4 bottom-100">
				<div class="col-md-6">
					<div class="col-12 mb-4">
						<div class="mb-2 fs-2">
							<span class="font-weight-bold fs-4 border-bottom">Auction Type*</span>
						</div>
						<div class="">
							<span class="font-weight-bold text-secondary white_txt fs-2">
								Dutch Auction
							</span>
						</div>
					</div>
					<div class="col-12 mb-4">
						<div class="mb-2 fs-2">
							<span class="font-weight-bold fs-4 border-bottom">Auction Token*</span>
						</div>
						<div class="">
							<span class="font-weight-bold text-secondary white_txt fs-2 mb-4">
								{{ model.token.address }}
							</span>
							<br />
							<span
								class="font-weight-bold text-secondary white_txt fs-2 text-uppercase"
							>
								{{ model.token.name }} ({{ model.token.symbol }})
							</span>
						</div>
					</div>
					<div class="col-12 mb-4">
						<div class="mb-2 fs-2">
							<span class="font-weight-bold fs-4 border-bottom">
								Auction Token Allowance*
							</span>
						</div>
						<div class="">
							<span
								class="
									font-weight-bold
									text-secondary
									white_txt
									fs-2
									mb-4
									text-uppercase
								"
							>
								{{ model.allowanceformatted }} {{ model.token.symbol }}
							</span>
						</div>
					</div>
					<div class="col-12 mb-4">
						<div class="mb-2 fs-2">
							<span class="font-weight-bold fs-4 border-bottom">
								Auction Token Amount*
							</span>
						</div>
						<div class="">
							<span
								class="
									font-weight-bold
									text-secondary
									white_txt
									fs-2
									mb-4
									text-uppercase
								"
							>
								{{ model.tokenSupply }} {{ model.token.symbol }}
							</span>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="col-12 mb-4">
						<div class="mb-2 fs-2">
							<span class="font-weight-bold fs-4 border-bottom">
								Payment Currency*
							</span>
						</div>
						<div class="">
							<span
								class="
									font-weight-bold
									text-secondary
									white_txt
									fs-2
									mb-4
									text-capitalize
								"
							>
								{{ model.paymentCurrency.name }} ({{ model.paymentCurrency.symbol }})
							</span>
						</div>
					</div>
					<div class="col-12 mb-5">
						<div class="mb-2 fs-2">
							<span class="font-weight-bold fs-4 border-bottom">Fund Wallet*</span>
						</div>
						<div class="">
							<span class="font-weight-bold text-secondary white_txt fs-2 mb-4">
								{{ model.fundWallet }}
							</span>
						</div>
					</div>
					<div class="col-12 mb-4">
						<div class="mb-2 fs-2">
							<span class="font-weight-bold fs-4 border-bottom">Price Settings*</span>
						</div>
						<div class="d-flex justify-content-between align-items-center mb-3">
							<div class="item">
								<span class="font-weight-bold text-secondary white_txt fs-2 mb-4">
									STARTING PRICE
								</span>
								<br />
								<span class="font-weight-bold text-secondary white_txt fs-2 mb-4">
									{{ model.startPrice }} {{ model.paymentCurrency.symbol }}
								</span>
							</div>
							<div class="item">
								<i class="el-icon-bottom-right"></i>
								<span class="font-weight-bold text-secondary white_txt fs-2 mb-4">
									MAXIMUM RAISED
								</span>
								<br />
								<div class="mt-2 max_raise text-center">{{ maxRaise }}</div>
							</div>
						</div>
						<div class="d-flex justify-content-between align-items-center">
							<div class="item">
								<span class="font-weight-bold text-secondary white_txt fs-2 mb-4">
									ENDING PRICE
								</span>
								<br />
								<span class="font-weight-bold text-secondary white_txt fs-2 mb-4">
									{{ model.minPrice }} {{ model.paymentCurrency.symbol }}
								</span>
							</div>
							<div class="item">
								<i class="el-icon-bottom-right"></i>
								<span class="font-weight-bold text-secondary white_txt fs-2 mb-4">
									MINIMUM RAISED
								</span>
								<br />
								<div class="mt-2 max_raise text-center">{{ minRaise }}</div>
							</div>
						</div>
					</div>
					<div class="col-12 mb-4">
						<div class="mb-2 fs-2">
							<span class="font-weight-bold fs-4 border-bottom">
								Auction Start & End*
							</span>
						</div>
						<div class="">
							<span
								class="
									font-weight-bold
									text-secondary
									white_txt
									fs-2
									mb-4
									text-uppercase
								"
							>
								{{ model.startDate }}
								<br />
								{{ model.endDate }}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="col-12 mt-6">
				<div class="line-divider"></div>
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

export default {
	components: {
		[DatePicker.name]: DatePicker,
		[TimeSelect.name]: TimeSelect,
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
			this.model.paymentCurrency = currency
		},
	},
}
</script>

<style lang="scss" scoped>
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
.bottom-100 {
	padding-bottom: 10%;
}
</style>
