<template>
	<div class="row">
		<div
			v-if="tabIndex === 1 || tabIndex === 0 || tabIndex === 2"
			class="col-12 col-lg-9 col-xl-8 order-1 order-lg-0"
		>
			<div class="hero-section mt-4 border-bottom-after position-relative px-5">
				<span
					v-if="tabIndex === 1 || tabIndex === 0 || tabIndex === 2"
					class="
						text-uppercase text-secondary
						white-txt
						font-weight-bold
						pb-2
						fs-10
						h-100
					"
				>
					Create Auction
				</span>
				<span
					v-else-if="tabIndex === 3"
					class="
						text-uppercase text-secondary
						white-txt
						font-weight-bold
						pb-2
						fs-10
						h-100
					"
				>
					Confirm Your Auction Setup
				</span>
				<span
					v-else
					class="
						text-uppercase text-secondary
						white-txt
						font-weight-bold
						pb-2
						fs-10
						h-100
					"
				>
					Your Auction Result
				</span>
			</div>
			<div :class="{ 'px-5': breackpoint !== 'sm' }">
				<client-only>
					<simpleauction-wizard
						:next-button-text="nextBtnText"
						:next-btn-loading="nextBtnLoading"
						@update:startIndex="onTabChanged"
					>
						<wizard-tab>
							<template slot="label">
								<span class="fs-5">1</span>
								<p>Auction</p>
							</template>

							<div class="row mb-5">
								<div class="col-12 bottom-45">
									<span
										class="
											font-weight-bold
											fs-4
											text-secondary
											white-txt
											border-bottom
										"
									>
										Auction Type*
									</span>
								</div>
								<auction-type-form
									:auction-types="auctionTypes"
									@active-focus="allStepInputs"
								></auction-type-form>
							</div>
							<base-divider class="my-5" />
						</wizard-tab>
						<wizard-tab :before-change="() => deployAuction('step1')">
							<template slot="label">
								<span class="fs-5">2</span>
								<p>SETUP</p>
							</template>
							<template v-if="chosenAuctionType === 2">
								<dutch-first-step
									ref="step1"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus="allStepInputs"
								></dutch-first-step>
							</template>
							<template v-else-if="chosenAuctionType === 1">
								<crowdsale-first-step
									ref="step1"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus-crowdsale="allCrowdsaleInputs"
								></crowdsale-first-step>
							</template>
							<template v-else-if="chosenAuctionType === 3">
								<batch-first-step
									ref="step1"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus-batch="allBatchStepInputs"
								></batch-first-step>
							</template>
						</wizard-tab>
						<wizard-tab :before-change="() => deployAuction('step2')">
							<template slot="label">
								<span class="fs-5">3</span>
								<p>SALE</p>
							</template>
							<template v-if="chosenAuctionType === 2">
								<dutch-second-step
									v-if="model"
									ref="step2"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus="allStepInputs"
								></dutch-second-step>
							</template>
							<template v-if="chosenAuctionType === 1">
								<crowdsale-second-step
									v-if="model"
									ref="step2"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus-crowdsale="allCrowdsaleInputs"
								></crowdsale-second-step>
							</template>
							<template v-if="chosenAuctionType === 3">
								<batch-second-step
									v-if="model"
									ref="step2"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus-batch="allBatchStepInputs"
								></batch-second-step>
							</template>
						</wizard-tab>
						<wizard-tab :before-change="() => validateStep('step3')">
							<template v-if="chosenAuctionType === 2">
								<dutch-third-step
									v-if="model"
									ref="step3"
									:init-model="model"
									@on-validated="onStepValidated"
								></dutch-third-step>
							</template>
							<template v-if="chosenAuctionType === 1">
								<crowdsale-third-step
									v-if="model"
									ref="step3"
									:init-model="model"
									@on-validated="onStepValidated"
								></crowdsale-third-step>
							</template>
							<template v-if="chosenAuctionType === 3">
								<batch-third-step
									v-if="model"
									ref="step3"
									:init-model="model"
									@on-validated="onStepValidated"
								></batch-third-step>
							</template>
						</wizard-tab>
						<wizard-tab>
							<third-step
								v-if="deployedMarket"
								:market="deployedMarket"
								@on-validated="onStepValidated"
							></third-step>
						</wizard-tab>
					</simpleauction-wizard>
				</client-only>
			</div>
		</div>
		<div v-else class="col-12 col-lg-9 col-xl-12 order-1 order-lg-0">
			<div class="hero-section mt-4 border-bottom-after position-relative px-5">
				<span
					v-if="tabIndex === 1 || tabIndex === 0 || tabIndex === 2"
					class="
						text-uppercase text-secondary
						white-txt
						font-weight-bold
						pb-2
						fs-10
						h-100
					"
				>
					Create Auction
				</span>
				<span
					v-else-if="tabIndex === 3"
					class="
						text-uppercase text-secondary
						white-txt
						font-weight-bold
						pb-2
						fs-10
						h-100
					"
				>
					Confirm Your Auction Setup
				</span>
				<span
					v-else
					class="
						text-uppercase text-secondary
						white-txt
						font-weight-bold
						pb-2
						fs-10
						h-100
					"
				>
					Your Auction Result
				</span>
			</div>
			<div :class="{ 'px-5': breackpoint !== 'sm' }">
				<client-only>
					<simpleauction-wizard
						:next-button-text="nextBtnText"
						:next-btn-loading="nextBtnLoading"
						@update:startIndex="onTabChanged"
					>
						<wizard-tab>
							<template slot="label">
								<span class="fs-5">1</span>
								<p>Auction</p>
							</template>

							<div class="row mb-5">
								<div class="col-12 bottom-45">
									<span
										class="
											font-weight-bold
											fs-4
											text-secondary
											white-txt
											border-bottom
										"
									>
										Auction Type*
									</span>
								</div>
								<auction-type-form
									:auction-types="auctionTypes"
									@active-focus="allStepInputs"
								></auction-type-form>
							</div>
							<base-divider class="my-5" />
						</wizard-tab>
						<wizard-tab :before-change="() => deployAuction('step1')">
							<template slot="label">
								<span class="fs-5">2</span>
								<p>SETUP</p>
							</template>
							<template v-if="chosenAuctionType === 2">
								<dutch-first-step
									ref="step1"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus="allStepInputs"
								></dutch-first-step>
							</template>
							<template v-else-if="chosenAuctionType === 1">
								<crowdsale-first-step
									ref="step1"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus-crowdsale="allCrowdsaleInputs"
								></crowdsale-first-step>
							</template>
							<template v-else-if="chosenAuctionType === 3">
								<batch-first-step
									ref="step1"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus-batch="allBatchStepInputs"
								></batch-first-step>
							</template>
						</wizard-tab>
						<wizard-tab :before-change="() => deployAuction('step2')">
							<template slot="label">
								<span class="fs-5">3</span>
								<p>SALE</p>
							</template>
							<template v-if="chosenAuctionType === 2">
								<dutch-second-step
									v-if="model"
									ref="step2"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus="allStepInputs"
								></dutch-second-step>
							</template>
							<template v-if="chosenAuctionType === 1">
								<crowdsale-second-step
									v-if="model"
									ref="step2"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus-crowdsale="allCrowdsaleInputs"
								></crowdsale-second-step>
							</template>
							<template v-if="chosenAuctionType === 3">
								<batch-second-step
									v-if="model"
									ref="step2"
									:init-model="model"
									@on-validated="onStepValidated"
									@active-focus-batch="allBatchStepInputs"
								></batch-second-step>
							</template>
						</wizard-tab>
						<wizard-tab :before-change="() => validateStep('step3')">
							<template v-if="chosenAuctionType === 2">
								<dutch-third-step
									v-if="model"
									ref="step3"
									:init-model="model"
									@on-validated="onStepValidated"
								></dutch-third-step>
							</template>
							<template v-if="chosenAuctionType === 1">
								<crowdsale-third-step
									v-if="model"
									ref="step3"
									:init-model="model"
									@on-validated="onStepValidated"
								></crowdsale-third-step>
							</template>
							<template v-if="chosenAuctionType === 3">
								<batch-third-step
									v-if="model"
									ref="step3"
									:init-model="model"
									@on-validated="onStepValidated"
								></batch-third-step>
							</template>
						</wizard-tab>
						<wizard-tab>
							<third-step
								v-if="deployedMarket"
								:market="deployedMarket"
								@on-validated="onStepValidated"
							></third-step>
						</wizard-tab>
					</simpleauction-wizard>
				</client-only>
			</div>
		</div>
		<div
			v-if="tabIndex === 1 || tabIndex === 0 || tabIndex === 2"
			class="col-12 col-lg-3 col-xl-4 bg-dark mb-sm-5 mb-md-0 darker-side order-0"
		>
			<div class="d-flex align-items-center mt-5 mb-2 pl-3">
				<div class="text-white fs-7 text-capitalize font-weight-bold pr-3">
					{{ sidebarTitles[tabIndex] }}
				</div>
				<p
					class="
						bg-brown
						fs-3
						py-1
						px-3
						mb-0
						d-flex
						align-items-center
						radius-lg
						text-white
						font-weight-bold
					"
				>
					Step {{ tabIndex + 1 }} of 3
				</p>
			</div>
			<div class="pl-3">* indicates required step</div>
			<div v-if="tabIndex === 0">
				<template v-for="(item, index) in allSteps">
					<zoom-y-transition :key="index" :duration="300">
						<notificatoin
							:active="item.active"
							:title="item.title"
							:description="item.desctiption"
							:top="item.top"
						/>
					</zoom-y-transition>
				</template>
			</div>
			<div v-else-if="tabIndex === 1 || tabIndex === 2">
				<template v-for="(item, index) in notificationSteps">
					<zoom-y-transition :key="index" :duration="300">
						<notificatoin
							:active="item.active"
							:title="item.title"
							:description="item.desctiption"
							:top="item.top"
						/>
					</zoom-y-transition>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { BaseDivider, SimpleauctionWizard, WizardTab } from '@/components'

import { theme } from '@/mixins/theme'
import { makeBatchCall, sendTransactionAndWait } from '@/services/web3/base'
import { to18Decimals, toNDecimals } from '@/util'
import { dai } from '@/constants/contracts'
import { getContractInstance as misoMarketContract } from '@/services/web3/misoMarket'
import { NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'

import DutchFirstStep from '@/components/Miso/Auctions/Factories/DutchFactoryForm/DutchFirstStep'
import DutchSecondStep from '@/components/Miso/Auctions/Factories/DutchFactoryForm/DutchSecondStep.vue'
import DutchThirdStep from '@/components/Miso/Auctions/Factories/DutchThirdStep.vue'

import CrowdsaleFirstStep from '@/components/Miso/Auctions/Factories/CrowdsaleFactoryForm/CrowdsaleFirstStep'
import CrowdsaleSecondStep from '@/components/Miso/Auctions/Factories/CrowdsaleFactoryForm/CrowdsaleSecondStep'
import CrowdsaleThirdStep from '@/components/Miso/Auctions/Factories/CrowdsaleThirdStep'

import BatchFirstStep from '@/components/Miso/Auctions/Factories/BatchFactoryForm/BatchFirstStep'
import BatchSecondStep from '@/components/Miso/Auctions/Factories/BatchFactoryForm/BatchSecondStep'
import BatchThirdStep from '@/components/Miso/Auctions/Factories/BatchThirdStep'

import { Vue } from 'vue-property-decorator'
import { ZoomYTransition } from 'vue2-transitions'
import Notificatoin from '@/components/Miso/Factory/Liquidity/sidebarNotification'
import AuctionTypeForm from './AuctionTypeForm.vue'
import ThirdStep from '~/components/Miso/Auctions/Factories/ThirdStep.vue'

export default {
	name: 'WizardForm',
	components: {
		BaseDivider,
		SimpleauctionWizard,
		WizardTab,
		DutchFirstStep,
		DutchSecondStep,
		DutchThirdStep,
		CrowdsaleFirstStep,
		CrowdsaleSecondStep,
		CrowdsaleThirdStep,
		BatchFirstStep,
		BatchSecondStep,
		BatchThirdStep,
		ThirdStep,
		AuctionTypeForm,
		Notificatoin,
		ZoomYTransition,
	},
	mixins: [theme],
	data() {
		return {
			model: {
				token: {
					address: this.$route.query.token,
					name: '',
					symbol: '',
					decimals: 0,
				},
				chosenAuctionType: 2,
				paymentCurrency: {
					address: NATIVE_CURRENCY_ADDRESS,
					name: 'Ethereum',
					symbol: 'ETH',
					decimals: 18,
				},
				startPrice: 0,
				minPrice: 0,
				startDate: '',
				endDate: '',
				fundWallet: '',
				tokenSupply: '',
				allowanceformatted: '',
				tokenPrice: 0,
				goal: '',
				allowance: '',
				minimumCommitmentAmount: 0,
			},
			marketFactoryAddress: null,
			tabIndex: 0,
			chosenAuctionType: 2,
			auctionTypes: [
				{
					title: 'Dutch Auction',
					id: 2,
					disabled: false,
					icon: 'dutch',
					content:
						'The price is set at a higher value per token than expected and descends over time.',
					description:
						'Great for finding the true market value of a completely novel item',
				},
				{
					title: 'Crowdsale',
					id: 1,
					disabled: false,
					icon: 'crowdsale',
					content: 'A fixed price and a fixed set of tokens.',
					description:
						'Great when the token price is already known or has been decided on previously',
				},
				{
					title: 'Batch Auction',
					id: 3,
					disabled: false,
					icon: 'batch',
					content:
						'A set amount of tokens are divided amongst all the contributors to the Market event, weighted according to their contribution to the pool.',
					description:
						'Great for projects looking to ensure that everyone taking part is rewarded',
				},
			],
			allSteps: [
				{
					active: false,
					top: 32,
					title: 'SELECT AUCTION TYPE*',
					desctiption:
						'Choose which type of auction you’d like to hold.  Each of the three types has their own unique characteristics, so choose the one you think is most appropriate for your project.  Need more information on what these mean, and which is best for you? Read our documentation here.',
				},
				{
					active: false,
					top: 22,
					title: 'AUCTION TOKEN*',
					desctiption:
						'Enter the token you’re looking to create an auction for.  Either search by name or symbol, or paste in the token’s contract address.',
				},
				{
					active: false,
					top: 38,
					title: 'AUCTION TOKEN ALLOWANCE*',
					desctiption:
						'Miso needs an allowance of tokens to be approved so it can create your auction contract',
				},
				{
					active: false,
					top: 57,
					title: 'AUCTION TOKEN AMOUNT*',
					desctiption:
						'This will be the number of tokens you will put into the auction contract. Please consider this carefully.',
				},
				{
					active: false,
					top: 22,
					title: 'PAYMENT CURRENCY*',
					desctiption:
						'Select the currency you want to accept as payment during the auction.  ETH is the most common, but some also prefer to use stablecoins like DAI or USDC.  However, you can also accept any ERC-20 you like by providing it’s address in the custom field.',
				},
				{
					active: false,
					top: 35,
					title: 'FUND WALLET*',
					desctiption:
						'Enter the wallet address where the funds raised from this auction will be deposited. Can be the admin address, or another one for you’ve designated for storing funds.',
				},
				{
					active: false,
					top: 57,
					title: 'DUTCH AUCTION SETTINGS*',
					desctiption:
						'Set the start and end price for your Dutch Auction.  This will auto-calculate the maximum and minimum amounts you could raise with your selected price range. ',
				},
				{
					active: false,
					top: 76,
					title: 'AUCTION START & END*',
					desctiption:
						'Select the dates for when your auction will be hold.  Most common duration is two weeks, but it can be whatever you like.',
				},
			],
			allCrowdsaleSteps: [
				{
					active: false,
					top: 22,
					title: 'AUCTION TOKEN*',
					desctiption:
						'Enter the token you’re looking to create an auction for.  Either search by name or symbol, or paste in the token’s contract address.',
				},
				{
					active: false,
					top: 57,
					title: 'AUCTION TOKEN AMOUNT*',
					desctiption:
						'Enter the token you’re looking to create an auction for.  Either search by name or symbol, or paste in the token’s contract address. ',
				},
				{
					active: false,
					top: 22,
					title: 'PAYMENT CURRENCY*',
					desctiption:
						'Select the currency you want to accept as payment during the auction.  ETH is the most common, but some also prefer to use stablecoins like DAI or USDC.  However, you can also accept any ERC-20 you like by providing it’s address in the custom field.',
				},
				{
					active: false,
					top: 35,
					title: 'FUND WALLET*',
					desctiption:
						'Enter the wallet address where the funds raised from this auction will be deposited. Can be the admin address, or another one for you’ve designated for storing funds.',
				},
				{
					active: false,
					top: 57,
					title: 'CROWDSALE SETTINGS*',
					desctiption:
						'Set the PRICE PER TOKEN and MINIMUM TARGET for your Dutch Auction.  This will auto-calculate the maximum and minimum amounts you could raise with your selected price range. ',
				},
				{
					active: false,
					top: 76,
					title: 'AUCTION START & END*',
					desctiption:
						'Select the dates for when your auction will be hold.  Most common duration is two weeks, but it can be whatever you like.',
				},
			],
			allBatchSteps: [
				{
					active: false,
					top: 22,
					title: 'AUCTION TOKEN*',
					desctiption:
						'Enter the token you’re looking to create an auction for.  Either search by name or symbol, or paste in the token’s contract address.',
				},
				{
					active: false,
					top: 57,
					title: 'AUCTION TOKEN AMOUNT*',
					desctiption:
						'Enter the token you’re looking to create an auction for.  Either search by name or symbol, or paste in the token’s contract address. ',
				},
				{
					active: false,
					top: 22,
					title: 'PAYMENT CURRENCY*',
					desctiption:
						'Select the currency you want to accept as payment during the auction.  ETH is the most common, but some also prefer to use stablecoins like DAI or USDC.  However, you can also accept any ERC-20 you like by providing it’s address in the custom field.',
				},
				{
					active: false,
					top: 39,
					title: 'FUND WALLET*',
					desctiption:
						'Enter the wallet address where the funds raised from this auction will be deposited. Can be the admin address, or another one for you’ve designated for storing funds.',
				},
				{
					active: false,
					top: 57,
					title: 'BATCH AUCTION SETTINGS*',
					desctiption:
						'Set the PRICE PER TOKEN and MINIMUM TARGET for your Dutch Auction.  This will auto-calculate the maximum and minimum amounts you could raise with your selected price range. ',
				},
				{
					active: false,
					top: 76,
					title: 'AUCTION START & END*',
					desctiption:
						'Select the dates for when your auction will be hold.  Most common duration is two weeks, but it can be whatever you like.',
				},
			],
			nextBtnLoading: false,
			deployedMarket: {
				address: '',
				txHash: '',
			},
			breackpoint: null,

			sidebarTitles: ['Auction Type', 'Auction Setup', 'Sale Settings'],
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			nativeCurrency: 'ethereum/nativeCurrency',
		}),
		notificationSteps() {
			if (this.chosenAuctionType === 2) return this.allSteps
			if (this.chosenAuctionType === 1) return this.allCrowdsaleSteps
			return this.allBatchSteps
		},
		nextBtnText() {
			if (this.tabIndex === 2) return 'Review'
			else if (this.tabIndex === 3) return 'DEPLOY'
			return 'Next'
		},
	},
	watch: {
		'$screen.breakpoint'(val) {
			this.breackpoint = val
		},
	},
	mounted() {
		this.breackpoint = this.$screen.breakpoint
		this.marketFactoryAddress = misoMarketContract().options.address
		this.model.paymentCurrency.name = this.nativeCurrency.name
		this.model.paymentCurrency.symbol = this.nativeCurrency.symbol
		this.model.paymentCurrency.decimals = this.nativeCurrency.decimals
	},
	methods: {
		async deployAuction(ref) {
			return await this.$refs[ref].validate()
		},
		onStepValidated(validated, model) {
			this.model = { ...this.model, ...model }
		},
		async validateStep(ref) {
			if (!(await this.$refs[ref].validate())) return false

			// Auction Template Id
			const methods = [
				{ methodName: 'currentTemplateId', args: [this.chosenAuctionType] },
			]
			const [auctionTemplateId] = await makeBatchCall(misoMarketContract(), methods)

			return new Promise((resolve) => {
				this.nextBtnLoading = true
				const model = this.model

				try {
					// Data Param
					let data
					switch (this.chosenAuctionType) {
						case 2:
							data = this.getDutchData()
							break
						case 1:
							data = this.getCrowdsaleData()
							break
						case 3:
							data = this.getBatchData()
							break
					}

					// Create Market
					const method = misoMarketContract().methods.createMarket(
						auctionTemplateId,
						model.token.address,
						to18Decimals(model.tokenSupply),
						dai.misoFeeAcct,
						data
					)
					sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
						this.nextBtnLoading = false
						if (receipt) {
							this.deployedMarket.txHash = receipt.transactionHash
							this.deployedMarket.address =
								receipt.events.MarketCreated.returnValues[1]
						}
						resolve(receipt.status)
					})
				} catch (error) {
					console.log('error occurred : ', error)
				}
			})
		},
		getDutchData() {
			const model = this.model
			const startDate = new Date(model.startDate).getTime() / 1000
			const endDate = new Date(model.endDate).getTime() / 1000

			const pointList = '0x0000000000000000000000000000000000000000'
			const operator = this.coinbase
			const dataParams = [
				this.marketFactoryAddress,
				model.token.address,
				to18Decimals(model.tokenSupply),
				startDate,
				endDate,
				model.paymentCurrency.address,
				toNDecimals(model.startPrice, model.paymentCurrency.decimals),
				toNDecimals(model.minPrice, model.paymentCurrency.decimals),
				operator,
				pointList,
				model.fundWallet,
			]

			return web3.eth.abi.encodeParameters(
				[
					'address',
					'address',
					'uint256',
					'uint256',
					'uint256',
					'address',
					'uint256',
					'uint256',
					'address',
					'address',
					'address',
				],
				dataParams
			)
		},
		getCrowdsaleData() {
			const model = this.model
			const startDate = new Date(model.startDate).getTime() / 1000
			const endDate = new Date(model.endDate).getTime() / 1000

			const pointList = '0x0000000000000000000000000000000000000000'
			const operator = this.coinbase
			const rate = toNDecimals(
				this.model.tokenPrice,
				this.model.paymentCurrency.decimals
			)
			const goal = toNDecimals(
				(this.model.tokenSupply * this.model.tokenPrice * this.model.goal) / 100,
				this.model.paymentCurrency.decimals
			)
			const dataParams = [
				this.marketFactoryAddress,
				model.token.address,
				model.paymentCurrency.address,
				to18Decimals(this.model.tokenSupply),
				startDate,
				endDate,
				rate,
				goal,
				operator,
				pointList,
				model.fundWallet,
			]

			return web3.eth.abi.encodeParameters(
				[
					'address',
					'address',
					'address',
					'uint256',
					'uint256',
					'uint256',
					'uint256',
					'uint256',
					'address',
					'address',
					'address',
				],
				dataParams
			)
		},
		getBatchData() {
			const model = this.model
			const startDate = new Date(model.startDate).getTime() / 1000
			const endDate = new Date(model.endDate).getTime() / 1000

			const pointList = '0x0000000000000000000000000000000000000000'
			const operator = this.coinbase
			const dataParams = [
				this.marketFactoryAddress,
				model.token.address,
				to18Decimals(model.tokenSupply),
				startDate,
				endDate,
				model.paymentCurrency.address,
				toNDecimals(model.minimumCommitmentAmount, model.paymentCurrency.decimals),
				operator,
				pointList,
				model.fundWallet,
			]

			return web3.eth.abi.encodeParameters(
				[
					'address',
					'address',
					'uint256',
					'uint256',
					'uint256',
					'address',
					'uint256',
					'address',
					'address',
					'address',
				],
				dataParams
			)
		},
		onTabChanged(newValue) {
			this.tabIndex = newValue

			if (this.tabIndex === 0) {
				this.allSteps.forEach((item) => {
					item.active = false
				})
			} else {
				this.notificationSteps.forEach((item) => {
					item.active = false
				})
			}
		},
		allStepInputs(event, val) {
			let i = 0
			for (const key in event) {
				Vue.set(this.allSteps[i], 'active', event[key])
				i++
			}
			this.chosenAuctionType = val
		},
		allCrowdsaleInputs(eventcrowd, valcrowd) {
			let i = 0
			for (const key in eventcrowd) {
				Vue.set(this.allCrowdsaleSteps[i], 'active', eventcrowd[key])
				i++
			}
			this.chosenAuctionType = valcrowd
		},
		allBatchStepInputs(eventbatch, valbatch) {
			let i = 0
			for (const key in eventbatch) {
				Vue.set(this.allBatchSteps[i], 'active', eventbatch[key])
				i++
			}
			this.chosenAuctionType = valbatch
		},
	},
}
</script>

<style scoped>
.card-wizard .disabled {
	display: block;
}
.white-txt {
	color: #ffffff;
}
.wid_90 {
	width: 90%;
}
.bottom-45 {
	padding-bottom: 45px;
}
</style>
