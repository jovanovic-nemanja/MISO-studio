<template>
	<div>
		<validation-observer ref="observer">
			<div class="row">
				<div class="col-12">
					<div class="d-flex">
						<div class="d-inline border-bottom mb-4">
							<div
								class="font-weight-bold fs-4 mb-2"
								:class="{ 'text-white': colors.admin }"
							>
								ADMIN ADDRESS*
							</div>
						</div>
					</div>
					<base-input
						v-model="model.wallet"
						name="admin"
						rules="required|isAddress"
						placeholder="Enter the wallet address of the token creator/administrator"
						@focus="focuseColor('admin')"
					/>
					<p
						class="
							font-weight-bold
							border-bottom
							d-inline
							cursor-pointer
							use_my_account
						"
						@click="selectCurrentAccount"
					>
						Use my account
					</p>
				</div>
				<div class="col-12">
					<div class="d-flex mt-4">
						<div class="d-inline border-bottom mb-4 mt-5">
							<div
								class="font-weight-bold fs-4 mb-2"
								:class="{ 'text-white': colors.auction }"
							>
								AUCTION ADDRESS*
							</div>
						</div>
					</div>
					<base-input
						v-model="auctionAddress"
						name="auction"
						rules="required|isAddress"
						placeholder="Enter the address of the auction you held for your token."
						@focus="focuseColor('auction')"
					/>
				</div>
			</div>
		</validation-observer>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BaseInput } from '@/components'
import { getContractInstance as dutchAuctionContract } from '@/services/web3/auctions/dutch'
import { getContractInstance as crowdsaleContract } from '@/services/web3/auctions/crowdsale'
import { getContractInstance as batchAuctionContract } from '@/services/web3/auctions/batch'
import { makeBatchCall } from '@/services/web3/base'
import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
import { toDecimals } from '@/util'
import { getContractInstance as erc20Contract } from '@/services/web3/erc20Token'
import { misoLauncher as misoLauncherAddress } from '@/constants/contracts'
import { NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'

export default {
	name: 'LiquidityStepOne',
	components: {
		BaseInput,
	},
	props: {
		data: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			colors: {
				admin: false,
				auction: false,
			},
			auctionAddress: '',
			tokensLoading: false,
			marketInfo: {
				startTime: 0,
				endTime: 0,
				currentPrice: 0,
				totalTokensCommitted: 0,
				paymentCurrency: {
					addr: null,
					name: '',
					symbol: '',
					decimals: 0,
				},
				tokenInfo: {
					address: '',
					name: '',
					symbol: '',
				},
				hasPointList: false,
				totalTokens: 0,
				commitmentsTotal: 0,
				finalized: 0,
			},
			user: {
				tokenBalance: 0,
				allowance: '',
			},
		}
	},
	computed: {
		model() {
			return this.data
		},
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			tokens: 'tokens/list',
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
			nativeCurrency: 'ethereum/nativeCurrency',
		}),
	},
	watch: {
		async auctionAddress(val) {
			if (val) {
				await this.getTemplateId(val)
				// let finishAuction
				switch (parseInt(this.marketTemplateId)) {
					case 1:
						this.contractInstance = crowdsaleContract(val)
						await this.setCrowdsaleData(val)
						break
					case 2:
						this.contractInstance = dutchAuctionContract(val)
						await this.setDutchAuctionData(val)
						break
					case 3:
						this.contractInstance = batchAuctionContract(val)
						await this.setBatchData(val)
						break
					case 4:
						break
					default:
						break
				}
				this.model.auctionAddress = val
				this.model.auction.address = this.marketInfo.paymentCurrency.addr
				this.model.auction.payment_currency = this.marketInfo.paymentCurrency.symbol
				this.model.auction.payment_currency_name =
					this.marketInfo.paymentCurrency.name

				this.model.token = {
					address: this.marketInfo.tokenInfo.addr,
					name: this.marketInfo.tokenInfo.name,
					symbol: this.marketInfo.tokenInfo.symbol,
				}

				await this.updateUserInfo()
			}
		},
	},
	created() {
		if (this.data) {
			Object.assign(this.model, this.data)
		}
	},
	mounted() {
		if (this.$route.query.auction) {
			this.auctionAddress = this.$route.query.auction
		}
	},
	methods: {
		async getTemplateId(val) {
			try {
				const methods = [{ methodName: 'marketTemplate' }]
				const [marketTemplate] = await makeBatchCall(
					dutchAuctionContract(val),
					methods
				)
				this.marketTemplateId = marketTemplate
			} catch {
				this.marketTemplateId = 0
			}
		},
		async setDutchAuctionData(val) {
			const methods = [{ methodName: 'getDutchAuctionInfo', args: [val] }]
			const [data] = await makeBatchCall(misoHelperContract(), methods)

			if (data.paymentCurrencyInfo.addr === NATIVE_CURRENCY_ADDRESS) {
				this.marketInfo.paymentCurrency = {
					addr: NATIVE_CURRENCY_ADDRESS,
					...this.nativeCurrency,
				}
			} else {
				this.marketInfo.paymentCurrency = data.paymentCurrencyInfo
			}
			this.marketInfo.tokenInfo.addr = data.tokenInfo.addr
			this.marketInfo.tokenInfo.name = data.tokenInfo.name
			this.marketInfo.tokenInfo.symbol = data.tokenInfo.symbol
			this.model.tokenSupply = toDecimals(data.totalTokens)
		},

		async setCrowdsaleData(val) {
			const methods = [{ methodName: 'getCrowdsaleInfo', args: [val] }]
			const [data] = await makeBatchCall(misoHelperContract(), methods)

			if (data.paymentCurrencyInfo.addr === NATIVE_CURRENCY_ADDRESS) {
				this.marketInfo.paymentCurrency = {
					addr: NATIVE_CURRENCY_ADDRESS,
					...this.nativeCurrency,
				}
			} else {
				this.marketInfo.paymentCurrency = data.paymentCurrencyInfo
			}
			this.marketInfo.tokenInfo.addr = data.tokenInfo.addr
			this.marketInfo.tokenInfo.name = data.tokenInfo.name
			this.marketInfo.tokenInfo.symbol = data.tokenInfo.symbol
			this.model.tokenSupply = toDecimals(data.totalTokens)
		},

		async setBatchData(val) {
			const methods = [{ methodName: 'getBatchAuctionInfo', args: [val] }]
			const [data] = await makeBatchCall(misoHelperContract(), methods)

			if (data.paymentCurrencyInfo.addr === NATIVE_CURRENCY_ADDRESS) {
				this.marketInfo.paymentCurrency = {
					addr: NATIVE_CURRENCY_ADDRESS,
					...this.nativeCurrency,
				}
			} else {
				this.marketInfo.paymentCurrency = data.paymentCurrencyInfo
			}
			this.marketInfo.tokenInfo.addr = data.tokenInfo.addr
			this.marketInfo.tokenInfo.name = data.tokenInfo.name
			this.marketInfo.tokenInfo.symbol = data.tokenInfo.symbol
			this.model.tokenSupply = toDecimals(data.totalTokens)
		},
		...mapActions({
			getTokens: 'tokens/getTokens',
		}),
		focuseColor(val) {
			for (const key in this.colors) {
				if (val === key) {
					this.colors[key] = true
				} else {
					this.colors[key] = false
				}
			}
			this.$emit('active-input', this.colors)
		},
		validate() {
			return this.$refs.observer.validate().then((res) => {
				this.$emit('on-validated', res, this.model)
				return res
			})
		},
		selectCurrentAccount() {
			this.focuseColor('admin')
			this.model.wallet = this.coinbase
		},
		async updateUserInfo() {
			const methods = [
				{
					methodName: 'allowance',
					args: [
						this.coinbase,
						misoLauncherAddress.address[this.currentProvidersNetworkId],
					],
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
				this.model.allowance = toDecimals(this.user.allowance)
				this.model.tokenbalance = toDecimals(this.user.tokenBalance)
			}
		},
		resetAuctionAddress() {
			this.auctionAddress = ''
		},
	},
}
</script>

<style lang="scss">
.use_my_account:hover {
	color: #f66645;
}
.btn-customs {
	border-radius: unset;
	height: 38px;
}
.dropdown-menu.show {
	min-width: calc(100%);
}
</style>
