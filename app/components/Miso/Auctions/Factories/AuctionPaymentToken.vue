<template>
	<div class="row">
		<div class="col-md-12">
			<div
				class="
					border border-2
					d-flex
					justify-content-between
					align-items-baseline
					my-2
					px-3
					py-2
					cursor-pointer
				"
				:class="{ 'bg-primary': tokenType === nativeCurrency.symbol }"
				@click="onCurrencyChanged(nativeCurrency.symbol)"
			>
				<span
					:disabled="!tokensApproved"
					inline
					:name="nativeCurrency.symbol"
					class="m-0 p-0 font-weight-bold"
					:class="{ 'text-white': tokenType === nativeCurrency.symbol }"
				>
					<i
						v-if="tokenType == nativeCurrency.symbol"
						class="far fa-circle fa-white-circle text-white"
					></i>
					<i v-else class="far fa-circle text-transparent"></i>
					{{ nativeCurrency.name }}
					<svg-icon
						v-if="tokenType == 'ETH'"
						icon="ethereum"
						height="24"
						width="20"
					/>
				</span>
				<span :class="{ 'text-white': tokenType === 'ETH' }">Most Common</span>
			</div>
		</div>
		<div class="col-md-12 d-flex">
			<div class="col-md-3 p-0">
				<div
					class="
						border border-2
						d-flex
						justify-content-between
						align-items-baseline
						my-2
						px-3
						py-2
						cursor-pointer
					"
					:class="{ 'bg-primary': tokenType === 'DAI' }"
					@click="onCurrencyChanged('DAI')"
				>
					<span
						:disabled="!tokensApproved"
						inline
						:class="{ 'text-white': tokenType === 'DAI' }"
						name="DAI"
						class="m-0 p-0 font-weight-bold"
					>
						<i
							v-if="tokenType == 'DAI'"
							class="far fa-circle fa-white-circle text-white"
						></i>
						<i v-else class="far fa-circle text-transparent"></i>
						DAI
					</span>
				</div>
			</div>
			<div class="col-md-3">
				<div
					class="
						border border-2
						d-flex
						justify-content-between
						align-items-baseline
						my-2
						px-3
						py-2
						cursor-pointer
					"
					:class="{ 'bg-primary': tokenType === 'USDC' }"
					@click="onCurrencyChanged('USDC')"
				>
					<span
						:disabled="!tokensApproved"
						inline
						:class="{ 'text-white': tokenType === 'USDC' }"
						name="USDC"
						class="m-0 p-0 font-weight-bold"
					>
						<i
							v-if="tokenType == 'USDC'"
							class="far fa-circle fa-white-circle text-white"
						></i>
						<i v-else class="far fa-circle text-transparent"></i>
						USDC
					</span>
				</div>
			</div>
			<div class="col-md-3 p-0">
				<div
					class="
						border border-2
						d-flex
						justify-content-between
						align-items-baseline
						my-2
						px-3
						py-2
						cursor-pointer
					"
					:class="{ 'bg-primary': tokenType === 'TETHER' }"
					@click="onCurrencyChanged('TETHER')"
				>
					<span
						:disabled="!tokensApproved"
						inline
						:class="{ 'text-white': tokenType === 'TETHER' }"
						name="TETHER"
						class="m-0 p-0 font-weight-bold"
					>
						<i
							v-if="tokenType == 'TETHER'"
							class="far fa-circle fa-white-circle text-white"
						></i>
						<i v-else class="far fa-circle text-transparent"></i>
						TETHER (USDT)
					</span>
				</div>
			</div>
			<div class="col-md-3 pr-0 d-flex align-items-center justify-content-center">
				<span
					:class="{
						'text-white':
							tokenType === 'DAI' || tokenType === 'USDC' || tokenType === 'TETHER',
					}"
				>
					Stablecoins
				</span>
			</div>
		</div>
		<div class="col-md-12 d-flex">
			<div class="col-md-3 p-0">
				<div
					class="
						border border-2
						d-flex
						justify-content-between
						align-items-baseline
						my-2
						px-3
						py-2
						cursor-pointer
					"
					:class="{ 'bg-primary': tokenType === 'CUSTOM' }"
					@click="onCurrencyChanged('CUSTOM')"
				>
					<span
						:disabled="!tokensApproved"
						inline
						:class="{ 'text-white': tokenType === 'CUSTOM' }"
						name="CUSTOM"
						class="m-0 p-0 font-weight-bold"
					>
						<i
							v-if="tokenType == 'CUSTOM'"
							class="far fa-circle fa-white-circle text-white"
						></i>
						<i v-else class="far fa-circle text-transparent"></i>
						CUSTOM
					</span>
				</div>
			</div>
			<div class="col-md-9 p-0 pt-2">
				<base-input
					v-model="customToken"
					name="Custom Token Address"
					:disabled="loading"
					:rules="tokenType === 'CUSTOM' ? 'required|isAddress' : ''"
					placeholder="Search by token name, token symbol, or Enter an ERC-20 token address"
					class="custom"
				>
					<template slot="success">
						<div v-if="success" class="valid-feedback" style="display: block">
							{{ paymentCurrency.name }} ({{ paymentCurrency.symbol }})
						</div>
					</template>
					<template slot="error">
						<div v-if="errorMessage" class="invalid-feedback" style="display: block">
							{{ errorMessage }}
						</div>
					</template>
				</base-input>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isErc20Token } from '@/services/web3/erc20Token'
import { dai, usdc, tether } from '@/constants/contracts'
import { NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'

export default {
	props: {
		tokensApproved: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			paymentCurrency: {
				address: NATIVE_CURRENCY_ADDRESS,
				name: 'Ethereum',
				symbol: 'ETH',
				decimals: 18,
			},
			customToken: '',
			loading: false,
			success: false,
			errorMessage: null,
		}
	},
	computed: {
		...mapGetters({
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
			nativeCurrency: 'ethereum/nativeCurrency',
		}),
		tokenType() {
			if (this.customToken.length > 0) return 'CUSTOM'

			switch (this.paymentCurrency.address) {
				case NATIVE_CURRENCY_ADDRESS:
					return this.nativeCurrency.symbol
				case usdc.address[this.currentProvidersNetworkId]:
					return 'USDC'
				case tether.address[this.currentProvidersNetworkId]:
					return 'TETHER'
				case dai.address[this.currentProvidersNetworkId]:
					return 'DAI'
				default:
					return 'CUSTOM'
			}
		},
	},
	watch: {
		customToken(newValue) {
			if (newValue !== '') {
				this.paymentCurrency.symbol = ''
				this.updateCustomCurrency(newValue)
			}
		},
	},
	mounted() {
		this.paymentCurrency.name = this.nativeCurrency.name
		this.paymentCurrency.symbol = this.nativeCurrency.symbol
		this.paymentCurrency.decimals = this.nativeCurrency.decimals
	},
	methods: {
		async updateCustomCurrency(currency) {
			this.loading = true
			this.customToken = currency

			const isValidAddress = web3.utils.isAddress(currency)
			if (isValidAddress) {
				const erc20Info = await isErc20Token(currency)
				if (!erc20Info) {
					this.errorMessage = 'Address is not ERC20'
					this.success = false
				} else {
					this.paymentCurrency.address = currency
					this.paymentCurrency.name = erc20Info.name
					this.paymentCurrency.symbol = erc20Info.symbol
					this.paymentCurrency.decimals = erc20Info.decimals
					this.errorMessage = null
					this.success = true
				}
			} else {
				this.errorMessage = 'Invalid Address'
				this.success = false
			}

			if (!this.success) {
				this.resetPaymentCurrency()
			}
			this.loading = false
			this.$emit('currency-updated', this.paymentCurrency)
		},

		onCurrencyChanged(currency) {
			this.customToken = ''
			this.errorMessage = null
			this.success = false

			if (currency === this.nativeCurrency.symbol) {
				this.paymentCurrency.address = NATIVE_CURRENCY_ADDRESS
				this.paymentCurrency.name = this.nativeCurrency.name
				this.paymentCurrency.symbol = this.nativeCurrency.symbol
				this.paymentCurrency.decimals = this.nativeCurrency.decimals
			} else if (currency === 'USDC') {
				this.paymentCurrency.address = usdc.address[this.currentProvidersNetworkId]
				this.paymentCurrency.name = 'USD Coin'
				this.paymentCurrency.symbol = 'USDC'
				this.paymentCurrency.decimals = 6
			} else if (currency === 'TETHER') {
				this.paymentCurrency.address = tether.address[this.currentProvidersNetworkId]
				this.paymentCurrency.name = 'Tether'
				this.paymentCurrency.symbol = 'USDT'
				this.paymentCurrency.decimals = 6
			} else if (currency === 'DAI') {
				this.paymentCurrency.address = dai.address[this.currentProvidersNetworkId]
				this.paymentCurrency.name = 'Dai'
				this.paymentCurrency.symbol = 'DAI'
				this.paymentCurrency.decimals = 18
			} else {
				this.resetPaymentCurrency()
			}

			this.$emit('currency-updated', this.paymentCurrency)
		},

		resetPaymentCurrency() {
			this.paymentCurrency = {
				address: '',
				name: '',
				symbol: '',
				decimals: 0,
			}
		},
	},
}
</script>

<style lang="scss">
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
.fa-white-circle {
	background-color: white;
	border-radius: 50px;
}
</style>
