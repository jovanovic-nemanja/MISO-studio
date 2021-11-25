<template>
	<div class="step-wrapper container">
		<validation-observer ref="observer">
			<div class="row">
				<div class="col-12">
					<autocomplete
						v-model="model.token.address"
						label="Token"
						name="token"
						placeholder="Type to search (name, symbol, address)"
						rules="required|isAddress"
						:suggestions="suggestions"
						:loading="tokensLoading"
						:no-data="'No Tokens'"
						@input="fetchTokens"
						@complete="handleTokenComplete"
					></autocomplete>

					<div class="fs-2">
						Don't have a token?
						<a href="#" target="_blank" class="font-weight-bold text-white underline">
							Create it now!
						</a>
					</div>
					<base-divider class="my-5" />
				</div>
				<div class="col-10">
					<div class="d-flex justify-content-between">
						<div class="d-flex flex-column">
							<span class="font-weight-bold">YOUR TOKEN BALANCE</span>
							<span class="font-weight-bold text-white">0.1458851576 BYE</span>
						</div>
						<div class="d-flex flex-column">
							<span class="font-weight-bold">YOUR TOKEN BALANCE</span>
							<span class="font-weight-bold text-white">0 BYE</span>
						</div>
					</div>
				</div>
				<div class="col-12">
					<base-divider class="my-5" />
					<div class="mt-3 mb-2 fs-2">
						<span class="font-weight-bold">PAYMENT CURRENCY</span>
						- The currency people will pay during the auction
					</div>
					<!-- this was <form> -->
					<div>
						<div class="d-flex flex-column">
							<div
								class="
									border border-2
									d-flex
									justify-content-between
									align-items-baseline
									my-2
									px-3
									py-2
								"
							>
								<base-radio
									v-model="model.currency"
									inline
									name="ETH"
									class="m-0 p-0 font-weight-bold"
								>
									ETH
								</base-radio>
								<span>Most Common</span>
							</div>
							<div
								class="
									border border-2
									d-flex
									justify-content-between
									align-items-baseline
									my-2
									px-3
									py-2
								"
							>
								<base-radio
									v-model="model.currency"
									inline
									name="DAI"
									class="m-0 p-0 font-weight-bold"
								>
									DAI
								</base-radio>
								<span>Stable Coin</span>
							</div>
							<div
								class="
									border border-2
									d-flex
									justify-content-between
									align-items-baseline
									my-2
									px-3
									py-2
								"
							>
								<base-radio
									v-model="model.currency"
									inline
									name="ERC20"
									class="m-0 p-0 font-weight-bold"
								>
									ERC20 Token
								</base-radio>
								<span>Custom</span>
							</div>
						</div>

						<!-- input line 1 -->
						<div class="row mt-4">
							<base-input
								v-model="model.startPrice"
								name="starting price"
								class="col-md-6"
								type="text"
								placeholder="0"
								:rules="`required|isBigger:${model.minPrice}`"
							>
								<template #label>
									<span class="font-weight-bold">STARTING PRICE</span>
								</template>
							</base-input>
							<base-input
								v-model="model.maxRise"
								name="maxRise"
								class="col-md-6"
								type="text"
								placeholder="0"
							>
								<template #label>
									<span class="font-weight-bold">MAX RAISE</span>
								</template>
							</base-input>
						</div>

						<!-- input line 2 -->
						<div class="row mt-4">
							<base-input
								v-model="model.minPrice"
								name="minPrice"
								class="col-md-6"
								type="text"
								placeholder="0"
								:rules="`required|isLess:${model.startPrice}`"
							>
								<template #label>
									<span class="font-weight-bold">MINIMUM PRICE</span>
								</template>
							</base-input>
							<base-input
								v-model="model.minRise"
								class="col-md-6"
								type="text"
								name="minRise"
								placeholder="0"
							>
								<template #label>
									<span class="font-weight-bold">MIN RAISE</span>
								</template>
							</base-input>
						</div>

						<!-- input line 3 -->
						<div class="row mt-4">
							<base-input
								class="col-md-6 right-icon"
								name="start date"
								type="text"
								:rules="`required|isBefore:${[model.endDate, 'end date']}`"
							>
								<el-date-picker
									v-model="model.startDate"
									type="date"
								></el-date-picker>
								<template #label>
									<span class="font-weight-bold">START DATE</span>
								</template>
							</base-input>
							<base-input
								class="col-md-6 right-icon"
								name="end date"
								:rules="`required|isAfter:${[model.startDate, 'start date']}`"
							>
								<el-date-picker v-model="model.endDate" type="date"></el-date-picker>
								<template #label>
									<span class="font-weight-bold">END DATE</span>
								</template>
							</base-input>
						</div>

						<!-- input line 3 -->
						<div class="row mt-4">
							<base-input
								v-model="model.address"
								class="col"
								name="address"
								placeholder="Ethereum Address"
								rules="required|isAddress"
							>
								<template #svgIcon>
									<svg-icon
										class="svg-rigth"
										icon="ethereum"
										height="11"
										width="11"
										:fill="false"
									/>
								</template>
								<template #label>
									<span class="font-weight-bold">FUND WALLET</span>
									- Where the funds will go
								</template>
							</base-input>
						</div>
					</div>
					<p class="font-weight-bold cursor-pointer">Send to my account</p>
				</div>
				<div class="col-12">
					<base-divider class="my-5" />
					<div class="d-flex justify-content-between step">
						<button class="btn" disabled>previous</button>
						<button class="btn" @click="validate">next</button>
					</div>
				</div>
			</div>
		</validation-observer>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BaseDivider } from '@/components'
import { DatePicker, TimeSelect } from 'element-ui'
import Autocomplete from '@/components/Inputs/Autocomplete'

export default {
	components: {
		BaseDivider,
		[DatePicker.name]: DatePicker,
		[TimeSelect.name]: TimeSelect,
		Autocomplete,
	},
	data() {
		return {
			model: {
				token: '',
				currency: 'ETH',
				startPrice: '',
				minPrice: '',
				maxRise: '',
				minRise: '',
				startDate: '',
				endDate: '',
			},
			suggestions: [],
			tokensLoading: false,
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			explorer: 'ethereum/explorer',
			tokens: 'tokens/list',
		}),
	},
	methods: {
		...mapActions({
			getTokens: 'tokens/getTokens',
		}),
		async validate() {
			const isValid = await this.$refs.observer.validate()
			if (isValid) this.$emit('on-validated', this.model)
		},
		async fetchTokens() {
			if (!this.tokensLoading) {
				if (this.suggestions.length > 0) {
					return
				}
				this.tokensLoading = true
				if (this.tokens.length === 0) {
					await this.getTokens()
				}
				// this.suggestions = []
				this.suggestions = this.tokens
				this.tokensLoading = false
			}
		},
		handleTokenComplete(token) {
			this.model.token = {
				address: token.addr,
				name: token.name,
				symbol: token.symbol,
			}
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
.svg-rigth {
	position: absolute;
	z-index: 10;
	right: 5px;
	top: 50%;
	transform: translateY(-50%);
}
.step {
	.btn {
		background: transparent !important;
		border: 2px solid #23306b;
		border-radius: 0;
		color: white;
	}
}
</style>
