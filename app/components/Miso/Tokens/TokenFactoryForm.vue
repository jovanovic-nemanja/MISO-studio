<template>
	<div>
		<div class="hero-section mt-4 pt-3 pb-2 border-bottom-after position-relative">
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
				TOKEN FACTORY
			</span>
		</div>
		<div class="px-md-5">
			<client-only>
				<simple-wizard :active-tab-index="activeStep">
					<wizard-tab :before-change="() => validateStep('step1')">
						<template slot="label">
							<span class="fs-5">1</span>
							<p>Token Details</p>
						</template>
						<validation-observer v-slot="{ handleSubmit }">
							<form
								v-if="activeStep === 0"
								class="needs-validation"
								@submit.prevent="handleSubmit(createToken)"
							>
								<div class="form-row justify-content-center mb-4">
									<div class="col-lg-12 col-md-8 m-auto">
										<label class="form-control-label font-weight-bolder mb-4 fs-3">
											Token type
										</label>
										<div class="row">
											<div class="col-12">
												<div class="d-flex justify-content-between">
													<div
														v-for="token in tokenTypes"
														:key="token.name"
														class="d-flex flex-column"
														@click="focuseColor('tokenType')"
													>
														<svg-icon
															:icon="token.icon"
															width="60"
															height="60"
															:color="computedIconColor"
														/>
														<base-radio
															v-model="tokenModel.templateType"
															:name="token.name"
															class="mb-3 text-capitalize"
														>
															{{ token.displayName }}
														</base-radio>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="form-row justify-content-md-center">
									<div class="col-md-12 mr-1">
										<base-input
											v-model="tokenModel.name"
											label="Token Name"
											name="token name"
											placeholder="Miso Token"
											type="text"
											rules="required"
											@focus="focuseColor('tokenName')"
										></base-input>
									</div>
									<div class="col-md-12 mr-1">
										<base-input
											v-model="tokenModel.symbol"
											label="Token Symbol"
											name="token symbol"
											placeholder="MISO"
											type="text"
											rules="required"
											@focus="focuseColor('tokenSymbol')"
										></base-input>
									</div>
									<div class="col-md-12 mr-1">
										<base-input
											v-if="tokenModel.templateType == '1'"
											v-model="tokenModel.totalSupply"
											placeholder="1000"
											label="Total Supply"
											name="total supply"
											type="number"
											min="0"
											rules="required|numeric|min_value:1"
											@focus="focuseColor('totalSupply')"
										></base-input>
										<base-input
											v-else
											v-model="tokenModel.totalSupply"
											placeholder="1000"
											label="Initial Supply"
											name="initial supply"
											type="number"
											min="0"
											rules="required|numeric|min_value:1"
											@focus="focuseColor('initialSupply')"
										></base-input>
									</div>
								</div>
								<hr />
								<base-alert v-if="!coinbase" type="danger">
									<span class="alert-inner--text">
										Account is not connected. Please connect wallet to be able to
										proceed
									</span>
								</base-alert>
								<base-button
									v-if="!hideNextBtn && coinbase"
									:loading="waitingForConfirmation"
									class="float-right"
									type="primary"
									:round="true"
									native-type="submit"
								>
									Deploy
								</base-button>
							</form>
						</validation-observer>
					</wizard-tab>
					<wizard-tab :before-change="() => validateStep('step2')">
						<template slot="label">
							<span class="fs-5">2</span>
							<p>Deployment</p>
						</template>
						<div v-if="activeStep === 1" class="row">
							<div class="col-md-6">
								<card>
									<div slot="header" class="row">
										<div class="col">
											<h6 class="text-uppercase text-muted ls-1 mb-1 fs-3">Token</h6>
										</div>
									</div>
									<div class="col-sm-12 col-md-12">
										<span class="h6 surtitle text-muted fs-3">Name</span>
										<span class="d-block h4 text-white fs-2">
											{{ tokenModel.name }}
										</span>
									</div>
									<div class="col-sm-12 col-md-12">
										<span class="h6 surtitle text-muted fs-3">Symbol</span>
										<span class="d-block h4 text-white fs-2">
											{{ tokenModel.symbol }}
										</span>
									</div>
									<div class="col-sm-12 col-md-12">
										<span class="h6 surtitle text-muted fs-3">Total Supply</span>
										<span class="d-block h4 text-white fs-2">
											{{ tokenModel.totalSupply }}
										</span>
									</div>
								</card>
							</div>
							<div class="col-md-6">
								<card>
									<div slot="header" class="row">
										<div class="col">
											<h6 class="text-uppercase text-muted ls-1 mb-1 fs-3">
												Transaction
											</h6>
										</div>
									</div>
									<div class="col-sm-12 col-md-12">
										<span class="h6 surtitle text-muted fs-3">Transaction Hash</span>
										<a
											class="d-block h4 text-primary"
											:href="`${explorer.root}${explorer.tx}${transactionHash}`"
											target="blank"
										>
											{{ transactionHash }}
										</a>
									</div>
									<div class="col-sm-12 col-md-12">
										<span class="h6 surtitle text-muted fs-3">Status</span>
										<span class="d-block h4 text-white fs-2">
											Pending
											<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>
										</span>
									</div>
								</card>
							</div>
						</div>
					</wizard-tab>
					<wizard-tab :before-change="() => validateStep('step3')">
						<template slot="label">
							<span class="fs-5">3</span>
							<p>Result</p>
						</template>

						<div v-if="activeStep === 2">
							<div class="row justify-content-md-center">
								<div class="col-sm-12 col-md-8">
									<card>
										<div slot="header" class="row">
											<div class="col">
												<h6 class="text-uppercase text-muted ls-1 mb-1">
													Transaction Confirmed
												</h6>
											</div>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Transaction Hash</span>
											<a
												class="d-block h4 text-primary"
												:href="`${explorer.root}${explorer.tx}${transactionHash}`"
												target="blank"
											>
												{{ transactionHash }}
											</a>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Token</span>
											<!-- <span class="d-block h4">
												<nuxt-link :to="`/tokens/${tokenAddress}`">
													{{ tokenAddress }}
												</nuxt-link>
											</span> -->
											<a
												class="d-block h4 text-primary"
												:href="`${explorer.root}${explorer.address}${tokenAddress}`"
												target="blank"
											>
												{{ tokenAddress }}
											</a>
										</div>
									</card>
								</div>
							</div>
							<hr />
							<n-link :to="'/factory/auctions/new?token=' + tokenAddress">
								<base-button outline type="primary" class="float-right" :round="true">
									Create Auction
								</base-button>
							</n-link>
						</div>
					</wizard-tab>
				</simple-wizard>
			</client-only>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { Steps, Step } from 'element-ui'
import {
	// sendTransaction as tokenFactorySend,
	getContractInstance,
	subscribeToTokenCreatedEvent,
} from '@/services/web3/tokenFactory'
import { sendTransaction, makeBatchCall, toWei } from '@/services/web3/base'
import SimpleWizard from '@/components/Miso/Tokens/TokensFactoryForm/Wizard'
import WizardTab from '@/components/Miso/Tokens/TokensFactoryForm/WizardTab'

import { theme } from '@/mixins/theme'
// import { waitForReceipt } from "@/services/web3/base"

export default {
	components: {
		[Steps.name]: Steps,
		[Step.name]: Step,
		SimpleWizard,
		WizardTab,
	},
	mixins: [theme],
	data() {
		return {
			activeStep: 0,
			wizardModel: null,
			prevBtnDisabled: true,
			steps: [
				{
					title: 'Token Details',
					needsValidation: true,
					refName: 'tokenDetails',
				},
				{
					title: 'Deployment',
					needsValidation: false,
				},
				{
					title: 'Result',
					needsValidation: false,
				},
			],
			tokenTypes: [
				{
					displayName: 'fixed',
					name: '1',
					icon: 'mintable-boxes',
				},
				{
					displayName: 'mintable',
					name: '2',
					icon: 'mintable-2',
				},
				{
					displayName: 'sushi',
					name: '3',
					icon: 'sushi',
				},
			],
			tokenModel: {
				name: '',
				symbol: '',
				totalSupply: null,
				templateType: '2',
			},
			waitingForConfirmation: false,
			transactionHash: null,
			tokenAddress: null,
			tokenCreatedEventSubscribtion: null,
			colors: {
				tokenType: false,
				tokenName: false,
				tokenSymbol: false,
				initialSupply: false,
				totalSupply: false,
			},
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			explorer: 'ethereum/explorer',
		}),
		nextBtnText() {
			let text = ''
			switch (this.activeStep) {
				case 0:
					text = 'Deploy'
					break
				case 2:
					text = 'Start Over'
					break
			}
			return text
		},
		hideNextBtn() {
			return this.activeStep === 1
		},
	},
	mounted() {
		this.subscribeToTokenCreatedEvent()
		this.tokenFactoryContract = getContractInstance()
	},
	beforeDestroy() {
		this.unsubscribeFromTokenCreatedEvent()
	},
	methods: {
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
			this.$emit('active-focus', this.colors)
		},
		validateStep(ref) {
			return this.$refs[ref].validate()
		},
		onStepValidated(validated) {
			this.wizardModel = validated
			this.nextTab()
		},
		changeStep() {
			if (this.activeStep === 2) {
				this.tokenModel = {
					name: '',
					symbol: '',
					totalSupply: 0,
					templateType: '2',
					deploymentFee: 0.1,
				}
				this.activeStep = 0
			} else {
				this.activeStep++
			}
			this.$emit('active-step', this.activeStep)
		},
		async createToken() {
			this.waitingForConfirmation = true

			// Token Template Id
			const methods = [
				{ methodName: 'currentTemplateId', args: [this.tokenModel.templateType] },
			]
			const [tokenTemplateId] = await makeBatchCall(
				this.tokenFactoryContract,
				methods
			)

			// Data Param
			const tokenData = [
				this.tokenModel.name,
				this.tokenModel.symbol,
				this.coinbase,
				toWei(this.tokenModel.totalSupply),
			]

			const data = web3.eth.abi.encodeParameters(
				['string', 'string', 'address', 'uint256'],
				tokenData
			)

			// Create Token
			const methodToSend = this.tokenFactoryContract.methods.createToken(
				tokenTemplateId,
				this.coinbase,
				data
			)

			const txHash = await sendTransaction(methodToSend, {
				from: this.coinbase,
			})

			console.log('txHash:', txHash)

			if (txHash) {
				this.transactionHash = txHash
				this.changeStep()
			}
			this.waitingForConfirmation = false
		},
		subscribeToTokenCreatedEvent() {
			this.tokenCreatedEventSubscribtion = subscribeToTokenCreatedEvent()
				.on('data', (event) => {
					if (this.transactionHash) {
						if (this.transactionHash.toLowerCase() === event.transactionHash) {
							this.tokenAddress = event.returnValues.addr
							this.changeStep()
							this.getTokens()
						}
					}
				})
				.on('error', (error) => {
					console.log('event error:', error)
				})
		},
		unsubscribeFromTokenCreatedEvent() {
			if (this.tokenCreatedEventSubscribtion) {
				this.tokenCreatedEventSubscribtion.unsubscribe()
			}
		},
		redirect(url) {
			this.$router.push(url)
		},
	},
}
</script>
<style lang="scss" scoped>
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
</style>
