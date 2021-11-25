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
				FARM FACTORY
			</span>
		</div>
		<div class="px-5">
			<client-only>
				<simple-wizard :active-tab-index="activeStep">
					<wizard-tab :before-change="() => validateStep('step1')">
						<template slot="label">
							<span class="fs-5">1</span>
							<p>Farm Details</p>
						</template>
						<validation-observer v-slot="{ handleSubmit }">
							<form
								v-if="activeStep === 0"
								class="needs-validation"
								@submit.prevent="handleSubmit(createFarm)"
							>
								<div class="form-row justify-content-md-center">
									<div class="col-lg-12 mr-1">
										<div class="form-row mb-4">
											<div class="col-md-6">
												<label
													class="form-control-label font-weight-bolder mb-3 fs-3"
												>
													Farm type
												</label>
												<div class="row">
													<div class="col-12">
														<div class="d-flex justify-content-between">
															<div
																class="d-flex flex-column align-items-center"
																@click="focuseColor('farmType')"
															>
																<svg-icon
																	icon="masterchif"
																	width="60"
																	height="60"
																	:color="computedIconColor"
																/>
																<base-radio
																	v-model="farmFactoryDetailsForm.templateId"
																	name="1"
																	class="mb-3"
																>
																	Master Chef
																</base-radio>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<autocomplete
											v-model="farmFactoryDetailsForm.rewardsAddress"
											label="Rewards Token"
											name="rewards address"
											placeholder="Token address"
											rules="required|isAddress"
											:suggestions="tokens"
											:loading="tokensLoading"
											@input="fetchTokens"
											@complete="handleTokenComplete"
											@focus="focuseColor('rewardsTokenaddress')"
										></autocomplete>
										<base-input
											v-model="farmFactoryDetailsForm.rewardsAmountPerBlock"
											label="Rewards Amount Per Block"
											name="rewards amount per block"
											placeholder="Rewards Amount Per Block"
											type="number"
											:rules="`required|min_value:0`"
											@focus="focuseColor('rewardsAmount')"
										></base-input>
										<base-input
											v-model="farmFactoryDetailsForm.startBlock"
											label="Start Block"
											name="start block"
											placeholder="Start Block"
											type="number"
											:rules="`required|min_value:${farmFactoryDetailsForm.lowerBlock}|max_value:${farmFactoryDetailsForm.upperBlock}`"
											@focus="focuseColor('startBlock')"
										></base-input>
										<base-input
											v-model="farmFactoryDetailsForm.devaddr"
											label="Wallet"
											name="wallet"
											placeholder="Wallet"
											type="text"
											rules="required|isAddress"
											@focus="focuseColor('wallet')"
										></base-input>
										<base-input
											v-model="farmFactoryDetailsForm.accessControls"
											label="Owner"
											name="owner"
											placeholder="Owner"
											type="text"
											rules="required|isAddress"
											@focus="focuseColor('owner')"
										></base-input>
										<div class="row">
											<base-input
												v-model="farmFactoryDetailsForm.integratorFeeAccount"
												class="col"
												name="address"
												placeholder="Ethereum Address"
												rules="required|isAddress"
												@focus="focuseColor('fundwalletAddress')"
											>
												<template #prepend>
													<svg-icon
														class="svg-icon-left"
														icon="ethereum"
														height="24"
														width="20"
													/>
												</template>
												<template #label>
													<span class="font-weight-bold">FUND WALLET</span>
													- Where the funds will go
												</template>
											</base-input>
										</div>
										<p
											class="font-weight-bold cursor-pointer"
											@click="selectCurrentAccount"
										>
											Send to my account
										</p>
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
												<h6 class="text-uppercase text-muted ls-1 mb-1">Farm</h6>
											</div>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Type</span>
											<span class="d-block h4">
												{{
													farmFactoryDetailsForm.templateId === 1 ? 'Master Chef' : ''
												}}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Rewards Token</span>
											<span class="d-block h4">
												{{ farmFactoryDetailsForm.rewardsAddress }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Rewards Per Block</span>
											<span class="d-block h4">
												{{ farmFactoryDetailsForm.rewardsAmountPerBlock }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Start Block</span>
											<span class="d-block h4">
												{{ farmFactoryDetailsForm.startBlock }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Wallet</span>
											<span class="d-block h4">
												{{ farmFactoryDetailsForm.devaddr }}
											</span>
										</div>
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Owner</span>
											<span class="d-block h4">
												{{ farmFactoryDetailsForm.accessControls }}
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
										<div class="col-sm-12 col-md-12">
											<span class="h6 surtitle text-muted">Farm</span>
											<a
												class="d-block h4 text-primary"
												:href="`${explorer.root}${explorer.address}${farmAddress}`"
												target="blank"
											>
												{{ farmAddress }}
											</a>
										</div>
									</card>
								</div>
							</div>
							<hr />

							<base-button
								tag="nuxt-link"
								:to="{
									path: `/farms/${farmAddress}`,
								}"
								class="float-right"
								type="primary"
							>
								View Farm
							</base-button>
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
	sendTransaction as farmFactoryCreate,
	subscribeToFarmCreatedEvent,
} from '@/services/web3/farmFactory'
import { ValidationObserver } from 'vee-validate'
import SimpleWizard from '@/components/Miso/Farms/FarmsFactoryForm/Wizard'
import WizardTab from '@/components/Miso/Farms/FarmsFactoryForm/WizardTab'
import Autocomplete from '@/components/Inputs/Autocomplete'
import { theme } from '@/mixins/theme'
// import BigNumber from "bignumber.js"

export default {
	name: 'FarmFactoryForm',
	components: {
		[Steps.name]: Steps,
		[Step.name]: Step,
		ValidationObserver,
		SimpleWizard,
		WizardTab,
		Autocomplete,
	},
	mixins: [theme],
	data() {
		return {
			waitingForConfirmation: false,
			activeStep: 0,
			transactionHash: null,
			farmAddress: null,
			farmFactoryDetailsForm: {
				rewardsAddress: '',
				rewardsAmountPerBlock: 0,
				lowerBlock: 0,
				startBlock: 0,
				upperBlock: 200000,
				devaddr: '',
				accessControls: '',
				templateId: 1,
				integratorFeeAccount: '',
			},
			farmCreatedEventSubscribtion: null,
			tokensLoading: false,
			items: {
				farmType: false,
				rewardsTokenaddress: false,
				rewardsAmount: false,
				startBlock: false,
				wallet: false,
				owner: false,
				fundwalletAddress: false,
			},
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			explorer: 'ethereum/explorer',
			tokens: 'tokens/list',
		}),
		hideNextBtn() {
			return this.activeStep === 1
		},
	},
	mounted() {
		this.subscribeToFarmCreatedEvent()
		this.getStartBlock()
	},
	beforeDestroy() {
		this.unsubscribeFromFarmCreatedEvent()
	},
	methods: {
		...mapActions({
			getTokens: 'tokens/getTokens',
		}),
		selectCurrentAccount() {
			this.farmFactoryDetailsForm.integratorFeeAccount = this.coinbase
		},
		validateStep(ref) {
			return this.$refs[ref].validate()
		},
		onStepValidated(validated) {
			this.wizardModel = validated
			this.nextTab()
		},
		async getStartBlock() {
			const blockNumber = await web3.eth.getBlockNumber()
			const currentBlock = await web3.eth.getBlock(blockNumber)
			const pastBlock = await web3.eth.getBlock(blockNumber - 1000)
			const averageBlockTime = (currentBlock.timestamp - pastBlock.timestamp) / 1000
			this.farmFactoryDetailsForm.lowerBlock = blockNumber
			this.farmFactoryDetailsForm.startBlock =
				blockNumber + Math.ceil(86400 / averageBlockTime)
			this.farmFactoryDetailsForm.upperBlock =
				blockNumber + Math.ceil(31622400 / averageBlockTime)
		},
		async fetchTokens() {
			if (!this.tokensLoading) {
				this.tokensLoading = true
				if (this.tokens.length === 0) {
					await this.getTokens()
				}
				this.tokensLoading = false
			}
		},
		handleTokenComplete(token) {
			// TODO - change to rewardsAddress
			this.farmFactoryDetailsForm.rewardsAddress = token.addr
		},
		async createFarm() {
			this.waitingForConfirmation = true
			// if (isEthConnectionOk) {
			const dataParams = [
				this.farmFactoryDetailsForm.rewardsAddress,
				this.farmFactoryDetailsForm.rewardsAmountPerBlock,
				this.farmFactoryDetailsForm.startBlock,
				this.farmFactoryDetailsForm.devaddr,
				this.farmFactoryDetailsForm.accessControls,
			]
			const data = web3.eth.abi.encodeParameters(
				['address', 'uint256', 'uint256', 'address', 'address'],
				dataParams
			)
			const args = [
				this.farmFactoryDetailsForm.templateId,
				this.farmFactoryDetailsForm.integratorFeeAccount,
				data,
			]
			const txHash = await farmFactoryCreate('createFarm', args, {
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
				this.farmFactoryDetailsForm.startBlock = this.farmFactoryDetailsForm = {
					rewardsAddress: '',
					rewardsAmountPerBlock: 0,
					lowerBlock: 0,
					startBlock: 0,
					upperBlock: 200000,
					devaddr: '',
					accessControls: '',
					templateId: 1,
				}
				this.activeStep = 0
				this.getStartBlock()
			} else {
				this.activeStep++
			}

			this.$emit('active-step', this.activeStep)
		},
		subscribeToFarmCreatedEvent() {
			this.farmCreatedEventSubscribtion = subscribeToFarmCreatedEvent()
				.on('data', (event) => {
					if (this.transactionHash) {
						if (this.transactionHash.toLowerCase() === event.transactionHash) {
							this.farmAddress = event.returnValues.addr
							this.changeStep()
						}
					}
				})
				.on('error', (error) => {
					console.log('event error:', error)
				})
		},
		unsubscribeFromFarmCreatedEvent() {
			if (this.farmCreatedEventSubscribtion) {
				this.farmCreatedEventSubscribtion.unsubscribe()
			}
		},
		redirect(url) {
			this.$router.push(url)
		},
		focuseColor(val) {
			for (const key in this.items) {
				if (val === key) {
					this.items[key] = true
				} else {
					this.items[key] = false
				}
			}
			this.$emit('active-focus', this.items)
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
.step {
	.btn {
		background: transparent !important;
		border: 2px solid #23306b;
		border-radius: 0;
		color: white;
	}
}
</style>
