<template>
	<card>
		<h3 slot="header" class="mb-0">Create Recipe02</h3>
		<el-steps :active="activeStep" finish-status="success" align-center>
			<el-step title="Create Recipe02"></el-step>
			<el-step title="Deployment"></el-step>
			<el-step title="Result"></el-step>
		</el-steps>
		<div class="mt-5">
			<validation-observer v-if="activeStep === 0" v-slot="{ handleSubmit }">
				<form class="needs-validation" @submit.prevent="handleSubmit(createRecipe02)">
					<div class="form-row justify-content-md-center">
						<div class="col-lg-6 mr-1">
							<base-input
								v-model="recipe02FromDetails.name"
								label="Name"
								name="name"
								placeholder="name"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.symbol"
								label="Symbols"
								name="symbol"
								placeholder="symbol"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.accessControl"
								label="Access Control"
								name="accessControl"
								placeholder="accessControl"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.tokensToMint"
								label="Tokens To Mint"
								name="tokensToMint"
								placeholder="tokensToMint"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.tokensToMarket"
								label="Tokens To Market"
								name="tokensToMarket"
								placeholder="tokensToMarket"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.paymentCurrency"
								label="Payment Currency"
								name="paymentCurrency"
								placeholder="paymentCurrency"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.startTime"
								label="Start Time"
								name="startTime"
								placeholder="startTime"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.endTime"
								label="End Time"
								name="EndTime"
								placeholder="EndTime"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.marketRate"
								label="Market Rate"
								name="marketRate"
								placeholder="marketRate"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.marketGoal"
								label="Market Goal"
								name="marketGoal"
								placeholder="marketGoal"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.wallet"
								label="Wallet"
								name="wallet"
								placeholder="wallet"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.operator"
								label="Operator"
								name="operator"
								placeholder="operator"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.deadline"
								label="Deadline"
								name="deadline"
								placeholder="deadline"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.launchwindow"
								label="Launch Window"
								name="launchwindow"
								placeholder="launchwindow"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.locktime"
								label="Locktime"
								name="locktime"
								placeholder="locktime"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.tokensToLiquidity"
								label="Tokens To Liquidity"
								name="tokensToLiquidity"
								placeholder="tokensToLiquidity"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.rewardsPerBlock"
								label="Rewards Per Block"
								name="rewardsPerBlock"
								placeholder="rewardsPerBlock"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.startBlock"
								label="Start Block"
								name="startBlock"
								placeholder="startBlock"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.devAddr"
								label="Dev Addr"
								name="devAddr"
								placeholder="devAddr"
								type="text"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.tokensToFarm"
								label="Tokens To Farm"
								name="tokensToFarm"
								placeholder="tokensToFarm"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.allocPoint"
								label="Alloc Point"
								name="allocPoint"
								placeholder="allocPoint"
								type="number"
								:rules="`required`"
							></base-input>
							<base-input
								v-model="recipe02FromDetails.integratorFeeAccount"
								label="Integrator Fee Account"
								name="integratorFeeAccount"
								placeholder="integratorFeeAccount"
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
									<h6 class="text-uppercase text-muted ls-1 mb-1">Miso Market</h6>
								</div>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Funder</span>
								<span class="d-block h4">
									{{ misoMarketDetailsForm.funder }}
								</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Token</span>
								<span class="d-block h4">
									{{ misoMarketDetailsForm.token }}
								</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Payment Currency</span>
								<span class="d-block h4">
									{{ misoMarketDetailsForm.paymentCurrency }}
								</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Total Tokens</span>
								<span class="d-block h4">
									{{ misoMarketDetailsForm.totalTokens }}
								</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Start Time</span>
								<span class="d-block h4">
									{{ misoMarketDetailsForm.startTime }}
								</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">End Time</span>
								<span class="d-block h4">
									{{ misoMarketDetailsForm.endTime }}
								</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Rate</span>
								<span class="d-block h4">{{ misoMarketDetailsForm.rate }}</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Goal</span>
								<span class="d-block h4">{{ misoMarketDetailsForm.goal }}</span>
							</div>
							<div class="col-sm-12 col-md-12">
								<span class="h6 surtitle text-muted">Wallet</span>
								<span class="d-block h4">
									{{ misoMarketDetailsForm.wallet }}
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
import { ValidationObserver } from 'vee-validate'
import * as _moment from 'moment'
import { sendTransaction as createRecipe02 } from '@/services/web3/recipes/recipe02'
import { NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'

const moment = _moment
export default {
	name: 'Recipe02',
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
			recipe02FromDetails: {
				name: 'Token',
				symbol: 'TKN',
				accessControl: '0x385fA2EF73433c6A4F4A5aF62700184390a6E232',
				tokensToMint: 1000000000000000,
				tokensToMarket: 2000000000000000,
				paymentCurrency: NATIVE_CURRENCY_ADDRESS,
				startTime: moment().format('YYYY-MM-DD HH:mm'),
				endTime: moment(this.startTime).add(1, 'days').format('YYYY-MM-DD HH:mm'),
				marketRate: 100,
				marketGoal: 200,
				wallet: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
				operator: '0x2A40019ABd4A61d71aBB73968BaB068ab389a636',
				deadline: 200,
				launchwindow: 259200,
				locktime: 100,
				tokensToLiquidity: 1000000000000000,
				rewardsPerBlock: 1000000000000000,
				startBlock: 1,
				devAddr: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
				tokensToFarm: 1000000000000000,
				allocPoint: 10,
				integratorFeeAccount: '0x8031EE7A32e9296e636428AF0Beea74Ae7BbEb52',
			},
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
	methods: {
		async createRecipe02() {
			const startDate = new Date(this.recipe02FromDetails.startTime).getTime() / 1000
			const endDate = new Date(this.recipe02FromDetails.endTime).getTime() / 1000

			const args = [
				this.recipe02FromDetails.name,
				this.recipe02FromDetails.symbol,
				this.recipe02FromDetails.accessControl,
				this.recipe02FromDetails.tokensToMint,
				this.recipe02FromDetails.tokensToMarket,
				this.recipe02FromDetails.paymentCurrency,
				startDate,
				endDate,
				this.recipe02FromDetails.marketRate,
				this.recipe02FromDetails.marketGoal,
				this.recipe02FromDetails.wallet,
				this.recipe02FromDetails.operator,
				this.recipe02FromDetails.deadline,
				this.recipe02FromDetails.launchwindow,
				this.recipe02FromDetails.locktime,
				this.recipe02FromDetails.tokensToLiquidity,
				this.recipe02FromDetails.rewardsPerBlock,
				this.recipe02FromDetails.startBlock,
				this.recipe02FromDetails.devAddr,
				this.recipe02FromDetails.tokensToFarm,
				this.recipe02FromDetails.allocPoint,
				this.recipe02FromDetails.integratorFeeAccount,
			]

			console.log(args)

			const txHash = await createRecipe02('prepareMiso', args, {
				from: this.coinbase,
			})
			console.log(txHash)
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
