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
				INIT POOL LIQUIDITY
			</span>
		</div>
		<div class="px-5">
			<client-only>
				<simple-wizard :active-tab-index="activeStep">
					<wizard-tab :before-change="() => validateStep('step1')">
						<template slot="label">
							<span class="fs-5">1</span>
							<p>Init Pool Liquidity</p>
						</template>
						<validation-observer v-slot="{ handleSubmit }">
							<form
								v-if="activeStep === 0"
								class="needs-validation"
								@submit.prevent="handleSubmit(initPoolLiquidity)"
							>
								<div class="form-row justify-content-md-center">
									<div class="col-lg-6 mr-1">
										<base-input
											v-model="poolLiquidityDetailsForm.accessControls"
											label="Access Controls"
											name="accessControls"
											placeholder="accessControls"
											type="text"
											:rules="`required`"
										></base-input>
										<base-input
											v-model="poolLiquidityDetailsForm.token1"
											label="Token1"
											name="token1"
											placeholder="token1"
											type="text"
											:rules="`required`"
										></base-input>
										<base-input
											v-model="poolLiquidityDetailsForm.token2"
											label="Token2"
											name="token2"
											placeholder="token2"
											type="text"
											:rules="`required`"
										></base-input>
										<base-input
											v-model="poolLiquidityDetailsForm.factory"
											label="Factory"
											name="factory"
											placeholder="factory"
											type="text"
											:rules="`required`"
										></base-input>
										<base-input
											v-model="poolLiquidityDetailsForm.owner"
											label="Owner"
											name="owner"
											placeholder="owner"
											type="text"
											:rules="`required`"
										></base-input>
										<base-input
											v-model="poolLiquidityDetailsForm.wallet"
											label="Wallet"
											name="wallet"
											placeholder="wallet"
											type="text"
											:rules="`required`"
										></base-input>
										<base-input
											v-model="poolLiquidityDetailsForm.liquidityPercent"
											label="Liquidity Percent"
											name="liquidity percent"
											placeholder="liquidity percent (0.00 ~ 100.00%)"
											type="number"
											step="0.01"
											rules="required|min_value:0|max_value:100"
										></base-input>
										<base-input
											v-model="poolLiquidityDetailsForm.deadline"
											label="Deadline"
											name="deadline"
											placeholder="deadline"
											type="number"
											:rules="`required`"
										></base-input>
										<base-input
											v-model="poolLiquidityDetailsForm.launchwindow"
											label="Launch Window"
											name="launchwindow"
											placeholder="launchwindow"
											type="number"
											:rules="`required`"
										></base-input>
										<base-input
											v-model="poolLiquidityDetailsForm.locktime"
											label="Locktime"
											name="locktime"
											placeholder="locktime"
											type="number"
											:rules="`required`"
										></base-input>
										<label class="form-control-label font-weight-medium">
											Is Token 1 WETH
										</label>
										<div class="row">
											<div class="col-2">
												<base-radio
													v-model="poolLiquidityDetailsForm.isToken1WETH"
													name="true"
												>
													Yes
												</base-radio>
											</div>
											<div class="col-2">
												<base-radio
													v-model="poolLiquidityDetailsForm.isToken1WETH"
													name="false"
												>
													No
												</base-radio>
											</div>
										</div>
									</div>
								</div>
								<hr />
								<base-button
									v-if="!hideNextBtn"
									class="float-right"
									:loading="waitingForConfirmation"
									type="primary"
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
						<div v-if="activeStep === 1">
							<div class="row">
								<div class="col-md-6">
									<card>
										<div slot="header" class="row">
											<div class="col">
												<h6 class="text-uppercase text-muted ls-1 mb-1">
													Init Pool Liquidity
												</h6>
											</div>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Access Controls</span>
											<span class="d-block h4">
												{{ poolLiquidityDetailsForm.accessControls }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Token1</span>
											<span class="d-block h4">
												{{ poolLiquidityDetailsForm.token1 }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Token2</span>
											<span class="d-block h4">
												{{ poolLiquidityDetailsForm.token2 }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Factory</span>
											<span class="d-block h4">
												{{ poolLiquidityDetailsForm.factory }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Owner</span>
											<span class="d-block h4">
												{{ poolLiquidityDetailsForm.owner }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Wallet</span>
											<span class="d-block h4">
												{{ poolLiquidityDetailsForm.wallet }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Liquidity Percent</span>
											<span class="d-block h4">
												{{ poolLiquidityDetailsForm.liquidityPercent }}%
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Deadline</span>
											<span class="d-block h4">
												{{ poolLiquidityDetailsForm.deadline }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Is Token 1 WETH</span>
											<span class="d-block h4">
												{{ poolLiquidityDetailsForm.isToken1WETH ? 'Yes' : 'No' }}
											</span>
										</div>
									</card>
								</div>
								<div class="col-md-6">
									<card>
										<div slot="header" class="row">
											<div class="col">
												<h6 class="text-uppercase text-muted ls-1 mb-1">
													Transaction
												</h6>
											</div>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Transaction Hash</span>
											<a
												class="d-block"
												:href="`${explorer.root}${explorer.tx}${transactionHash}`"
												target="blank"
											>
												{{ transactionHash }}
											</a>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Status</span>
											<span class="d-block h4">
												Pending
												<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>
											</span>
										</div>
									</card>
								</div>
							</div>
							<hr />
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
										<!--              <div class="col-sm-12 col-md-12">-->
										<!--                <span class="h6 surtitle text-muted">Factory</span>-->
										<!--                <span class="d-block h4">-->
										<!--                <nuxt-link :to="`/tokens/${tokenAddress}`">{{tokenAddress}}</nuxt-link>-->
										<!--              </span>-->
										<!--                <n-link :to="'/factory/auction?token='+tokenAddress">-->
										<!--                  <base-button outline type="primary">Create Auction</base-button>-->
										<!--                </n-link>-->
										<!--              </div>-->
									</card>
								</div>
							</div>
							<hr />

							<!--        @click="redirect(`/tokens/${tokenAddress}`)"-->
							<base-button class="float-right" type="primary">
								View FarmFactory Info
							</base-button>
						</div>
					</wizard-tab>
				</simple-wizard>
			</client-only>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Step, Steps } from 'element-ui'
import * as _moment from 'moment'
import {
	sendTransaction as poolLiquidityInit,
	subscribeToLiquidityAddedEvent,
} from '@/services/web3/templates/poolLiquidityTemplate'
import { ValidationObserver } from 'vee-validate'
import SimpleWizard from '@/components/Miso/Liquiditys/LiquidityPoolForm/Wizard'
import WizardTab from '@/components/Miso/Liquiditys/LiquidityPoolForm/WizardTab'
import BigNumber from 'bignumber.js'

const moment = _moment

export default {
	name: 'BasePoolLiquidityValidation',
	components: {
		[Steps.name]: Steps,
		[Step.name]: Step,
		ValidationObserver,
		SimpleWizard,
		WizardTab,
	},
	data() {
		return {
			waitingForConfirmation: false,
			activeStep: 0,
			transactionHash: null,
			poolLiquidityDetailsForm: {
				accessControls: '0x62cAfEc8Fe3f5C2026B4b0F776575e6D4c3f5393',
				token1: '0x0b5C52054636540b739FD846dc70D3c0c8a9D05F',
				token2: '0xa686341b11c868FcAd6B83d73660423217d86433',
				factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
				owner: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
				wallet: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
				liquidityPercent: '50.00',
				deadline: moment().add(2, 'days').valueOf(),
				launchwindow: 173000,
				locktime: moment().utc().seconds(),
				isToken1WETH: true,
			},
			subscribeToLiquidityAddedEventSubscription: null,
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			explorer: 'ethereum/explorer',
		}),
		hideNextBtn() {
			return this.activeStep === 1
		},
	},
	mounted() {
		this.subscribeToLiquidityAddedEvent()
	},
	beforeDestroy() {
		this.unsubscribeFromLiquidityAddedEvent()
	},
	methods: {
		validateStep(ref) {
			return this.$refs[ref].validate()
		},
		onStepValidated(validated) {
			this.wizardModel = validated
			this.nextTab()
		},
		async initPoolLiquidity() {
			this.waitingForConfirmation = true
			const args = [
				this.poolLiquidityDetailsForm.accessControls,
				this.poolLiquidityDetailsForm.token1,
				this.poolLiquidityDetailsForm.token2,
				this.poolLiquidityDetailsForm.factory,
				this.poolLiquidityDetailsForm.owner,
				this.poolLiquidityDetailsForm.wallet,
				BigNumber(this.poolLiquidityDetailsForm.liquidityPercent)
					.multipliedBy(100)
					.toFixed(),
				this.poolLiquidityDetailsForm.deadline,
				this.poolLiquidityDetailsForm.launchwindow,
				this.poolLiquidityDetailsForm.locktime,
				this.poolLiquidityDetailsForm.isToken1WETH,
			]
			const txHash = await poolLiquidityInit('initPoolLiquidity', args, {
				from: this.coinbase,
			})
			console.log(txHash, 'txHash')
			if (txHash) {
				this.transactionHash = txHash
				this.changeStep()
			}
			this.waitingForConfirmation = false
		},
		changeStep() {
			if (this.activeStep === 2) {
				this.poolLiquidityDetailsForm = {
					accessControls: '0x62cAfEc8Fe3f5C2026B4b0F776575e6D4c3f5393',
					token1: '0x0b5C52054636540b739FD846dc70D3c0c8a9D05F',
					token2: '0xa686341b11c868FcAd6B83d73660423217d86433',
					factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
					owner: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
					wallet: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
					deadline: moment().add(2, 'days').valueOf(),
					launchwindow: 173000,
					locktime: moment().utc().seconds(),
				}
				this.activeStep = 0
			} else {
				this.activeStep++
			}
		},
		subscribeToLiquidityAddedEvent() {
			this.subscribeToLiquidityAddedEventSubscription =
				subscribeToLiquidityAddedEvent()
					.on('data', (event) => {
						if (this.transactionHash) {
							if (this.transactionHash.toLowerCase() === event.transactionHash) {
								console.log('from event', event)
								// console.log(event.returnValues, 'token');
								// this.farmAddress = event.returnValues.token;
								this.changeStep()
							}
						}
					})
					.on('error', (error) => {
						console.log('event error:', error)
					})
		},
		unsubscribeFromLiquidityAddedEvent() {
			if (this.subscribeToLiquidityAddedEventSubscription) {
				this.subscribeToLiquidityAddedEventSubscription.unsubscribe()
			}
		},
		redirect(url) {
			this.$router.push(url)
		},
	},
}
</script>
