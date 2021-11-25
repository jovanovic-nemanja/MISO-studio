<template>
	<card>
		<h3 slot="header" class="mb-0 text-center">Liquidity Launcher</h3>
		<el-steps :active="activeStep" finish-status="success" align-center>
			<el-step title="Create Liquidity Launcher"></el-step>
			<el-step title="Deployment"></el-step>
			<el-step title="Result"></el-step>
		</el-steps>
		<div class="mt-5">
			<validation-observer v-if="activeStep === 0" v-slot="{ handleSubmit }">
				<form
					class="needs-validation"
					@submit.prevent="handleSubmit(createLiquidityLauncher)"
				>
					<div class="form-row justify-content-md-center">
						<div class="col-lg-6 mr-1">
							<base-input
								v-model="liquidityDetailsForm.templateId"
								label="TemplateId"
								name="TemplateId"
								placeholder="TemplateId"
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
									<h6 class="text-uppercase text-muted ls-1 mb-1">
										Liquidity Launcher
									</h6>
								</div>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">TemplateId</span>
								<span class="d-block h4">{{ liquidityDetailsForm.templateId }}</span>
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
	sendTransaction as misoLauncherCreate,
	subscribeToMisoLauncherCreatedEvent,
} from '@/services/web3/misoLauncher'
import { ValidationObserver } from 'vee-validate'
export default {
	name: 'BaseLiquidityLauncherValidation',
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
			liquidityDetailsForm: {
				templateId: 1,
			},
			misoLauncherCreatedEventSubscription: null,
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
		this.subscribeToMisoLauncherCreatedEvent()
	},
	beforeDestroy() {
		this.unsubscribeFromLiquidityLauncherCreatedEvent()
	},
	methods: {
		async createLiquidityLauncher() {
			this.waitingForConfirmation = true
			const args = [this.liquidityDetailsForm.templateId]
			console.log(this.liquidityDetailsForm.templateId)
			const txHash = await misoLauncherCreate('createLiquidityLauncher', args, {
				from: this.coinbase,
			})
			console.log(txHash)
		},
		subscribeToMisoLauncherCreatedEvent() {
			this.misoLauncherCreatedEventSubscription =
				subscribeToMisoLauncherCreatedEvent()
					.on('data', async (event) => {
						if (this.transactionHash) {
							if (this.transactionHash.toLowerCase() === event.transactionHash) {
								console.log('from event', event)
								// console.log(event.returnValues, 'token');
								// this.farmAddress = event.returnValues.token;
								// this.changeStep();
							}
						}
					})
					.on('error', (error) => {
						console.log('event error:', error)
					})
		},
		unsubscribeFromLiquidityLauncherCreatedEvent() {
			if (this.misoLauncherCreatedEventSubscription) {
				this.misoLauncherCreatedEventSubscription.unsubscribe()
			}
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
