<template>
	<card>
		<h3 slot="header" class="mb-0">Create Farm</h3>
		<el-steps :active="activeStep" finish-status="success" align-center>
			<el-step title="Create Factory"></el-step>
			<el-step title="Deployment"></el-step>
			<el-step title="Result"></el-step>
		</el-steps>
		<div class="mt-5">
			<validation-observer v-if="activeStep === 0" v-slot="{ handleSubmit }">
				<form class="needs-validation" @submit.prevent="handleSubmit(createFarm)">
					<div class="form-row justify-content-md-center">
						<div class="col-lg-6 mr-1">
							<base-input
								v-model="farmFactoryDetailsForm.rewardsAddress"
								label="Rewards Address"
								name="rewards address"
								placeholder="rewards address"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="farmFactoryDetailsForm.rewardsAmountPerBlock"
								label="Rewards Amount Per Block"
								name="rewards amount per block"
								placeholder="Rewards Amount Per Block"
								type="number"
								:rules="`required|min_value:0`"
							></base-input>
							<base-input
								v-model="farmFactoryDetailsForm.startBlock"
								label="Start Block"
								name="start block"
								placeholder="Start Block"
								type="number"
								:rules="`required|min_value:0`"
							></base-input>
							<base-input
								v-model="farmFactoryDetailsForm.devaddr"
								label="Devaddr"
								name="devaddr"
								placeholder="Devaddr"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="farmFactoryDetailsForm.accessControls"
								label="Access Controls"
								name="access controls"
								placeholder="Access Controls"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="farmFactoryDetailsForm.templateId"
								label="Template Id"
								name="template id"
								placeholder="Template Id"
								type="number"
								:rules="`required|min_value:0`"
							></base-input>
							<base-input
								v-model="farmFactoryDetailsForm.integratorFeeAccount"
								label="Transfer To"
								name="transfer to"
								placeholder="Transfer To"
								type="text"
								:rules="`required`"
							></base-input>
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
								<span class="h6 surtitle text-muted">Farm Value</span>
								<span class="d-block h4">
									{{ farmFactoryDetailsForm.createFarm }}
								</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Rewards Address</span>
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
								<span class="h6 surtitle text-muted">Developer Address</span>
								<span class="d-block h4">
									{{ farmFactoryDetailsForm.devaddr }}
								</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Access Controls</span>
								<span class="d-block h4">
									{{ farmFactoryDetailsForm.accessControls }}
								</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Template Id</span>
								<span class="d-block h4">
									{{ farmFactoryDetailsForm.templateId }}
								</span>
							</div>
						</card>
					</div>
					<div class="col-md-6">
						<card>
							<div slot="header" class="row">
								<div class="col">
									<h6 class="text-uppercase text-muted ls-1 mb-1">Transaction</h6>
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
		</div>
	</card>
</template>

<script>
import { Step, Steps } from 'element-ui'
import { mapGetters } from 'vuex'
import {
	sendTransaction as farmFactoryCreate,
	subscribeToFarmCreatedEvent,
} from '@/services/web3/farmFactory'
import { ValidationObserver } from 'vee-validate'

export default {
	name: 'BaseFarmFactoryValidation',
	components: {
		[Steps.name]: Steps,
		[Step.name]: Step,
		ValidationObserver,
	},
	data() {
		return {
			waitingForConfirmation: false,
			activeStep: 0,
			transactionHash: null,
			farmAddress: null,
			farmFactoryDetailsForm: {
				rewardsAddress: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
				rewardsAmountPerBlock: 0,
				startBlock: 0,
				devaddr: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
				accessControls: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
				templateId: 1,
				integratorFeeAccount: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
			},
			farmCreatedEventSubscribtion: null,
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
		this.subscribeToFarmCreatedEvent()
	},
	beforeDestroy() {
		this.unsubscribeFromFarmCreatedEvent()
	},
	methods: {
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
				this.farmFactoryDetailsForm = {
					rewardsAddress: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
					rewardsAmountPerBlock: 0,
					startBlock: 0,
					devaddr: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
					accessControls: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
					templateId: 1,
				}
				this.activeStep = 0
			} else {
				this.activeStep++
			}
		},
		subscribeToFarmCreatedEvent() {
			this.farmCreatedEventSubscribtion = subscribeToFarmCreatedEvent()
				.on('data', async (event) => {
					if (this.transactionHash) {
						if (this.transactionHash.toLowerCase() === event.transactionHash) {
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
		unsubscribeFromFarmCreatedEvent() {
			if (this.farmCreatedEventSubscribtion) {
				this.farmCreatedEventSubscribtion.unsubscribe()
			}
		},
		redirect(url) {
			this.$router.push(url)
		},
	},
}
</script>

<style>
.el-step__head.is-process .el-step__icon.is-text {
	color: #fff;
	background-color: var(--primary);
	border-color: var(--primary);
}
.el-step__head.is-success {
	color: var(--primary);
	border-color: var(--primary);
}
.el-step__head.is-success .el-step__line {
	color: var(--primary);
	border-color: var(--primary);
	background-color: var(--primary);
}
.el-step__title.is-success {
	color: var(--primary);
}
</style>
