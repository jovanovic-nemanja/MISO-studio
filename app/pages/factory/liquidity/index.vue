<template>
	<div class="row">
		<div
			v-if="tabIndex === 0 || tabIndex === 1 || tabIndex === 2"
			class="col-12 col-lg-9 col-xl-8 order-1 order-lg-0"
		>
			<div class="d-flex align-items-center mt-4 px-5">
				<svg-icon icon="liquid-luncher" height="70" width="70" />
				<h2 class="mb-0 pl-3 text-white font-weight-bold fs-10">
					Liquidity Launcher
				</h2>
				<h2 v-if="tabIndex === 3" class="mb-0 pl-3 text-white font-weight-bold fs-10">
					Confirm Your Launch
				</h2>
			</div>
			<div class="row px-5">
				<div class="col-12">
					<div>
						<client-only>
							<liquid-launcher-wizard
								ref="lastWizard0"
								:start-index="tabIndex"
								:next-button-text="nextBtnText"
								:next-btn-loading="nextBtnLoading"
								@update:startIndex="onTabChanged"
							>
								<wizard-tab :before-change="() => validateStep('step-1')">
									<template slot="label">
										<span class="fs-4 font-weight-bold">1</span>
										<p>INITIAL SETUP</p>
									</template>
									<first-step
										ref="step-1"
										:data="model"
										@active-input="firstStepInputs($event)"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
								<wizard-tab :before-change="() => validateStep('step-2')">
									<template slot="label">
										<span class="fs-4 font-weight-bold">2</span>
										<p>LIQUIDITY OPTIONS</p>
									</template>
									<second-step
										ref="step-2"
										:data="model"
										@active-input="secondStepInputs($event)"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
								<wizard-tab :before-change="() => validateStep('step-3')">
									<template slot="label">
										<span class="fs-4 font-weight-bold">3</span>
										<p>LAUNCH SETTINGS</p>
									</template>
									<third-step
										ref="step-3"
										:data="model"
										@active-input="thirdStepInputs($event)"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
								<wizard-tab :before-change="() => deploy()">
									<final-step
										ref="step-4"
										:data="model"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
								<wizard-tab :before-change="() => setAuctionWallet()">
									<final-wallet-step
										ref="step-5"
										:data="model"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
							</liquid-launcher-wizard>
						</client-only>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="col-12 col-lg-12 order-1 order-lg-0">
			<div class="d-flex align-items-center mt-4 px-5">
				<svg-icon icon="liquid-luncher" height="70" width="70" />
				<h2 v-if="tabIndex === 3" class="mb-0 pl-3 text-white font-weight-bold fs-10">
					Confirm Your Launch
				</h2>
				<h2 v-else class="mb-0 pl-3 text-white font-weight-bold fs-10">
					Transaction Confirmed
				</h2>
			</div>
			<div class="row px-5">
				<div class="col-12">
					<div>
						<client-only>
							<liquid-launcher-wizard
								ref="lastWizard1"
								:start-index="tabIndex"
								:next-button-text="nextBtnText"
								:next-btn-loading="nextBtnLoading"
								@update:startIndex="onTabChanged"
							>
								<wizard-tab :before-change="() => validateStep('step-1')">
									<template slot="label">
										<span class="fs-4 font-weight-bold">1</span>
										<p>INITIAL SETUP</p>
									</template>
									<first-step
										ref="step-1"
										:data="model"
										@active-input="firstStepInputs($event)"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
								<wizard-tab :before-change="() => validateStep('step-2')">
									<template slot="label">
										<span class="fs-4 font-weight-bold">2</span>
										<p>LIQUIDITY OPTIONS</p>
									</template>
									<second-step
										ref="step-2"
										:data="model"
										@active-input="secondStepInputs($event)"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
								<wizard-tab :before-change="() => validateStep('step-3')">
									<template slot="label">
										<span class="fs-4 font-weight-bold">3</span>
										<p>LAUNCH SETTINGS</p>
									</template>
									<third-step
										ref="step-3"
										:data="model"
										@active-input="thirdStepInputs($event)"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
								<wizard-tab :before-change="() => deploy()">
									<final-step
										ref="step-4"
										:data="model"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
								<wizard-tab :before-change="() => setAuctionWallet()">
									<final-wallet-step
										ref="step-5"
										:data="model"
										@on-validated="onStepValidated"
									/>
									<base-divider class="py-4 mt-5" />
								</wizard-tab>
							</liquid-launcher-wizard>
						</client-only>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="tabIndex === 0 || tabIndex === 1 || tabIndex === 2"
			class="
				col-12 col-lg-3 col-xl-4
				bg-dark
				mb-sm-5 mb-md-0
				darker-side
				order-0
				position-relative
			"
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
				<template v-for="(item, index) in firstSteps">
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
			<div v-if="tabIndex === 1">
				<template v-for="(item, index) in SecondStep">
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
			<div v-if="tabIndex === 2">
				<template v-for="(item, index) in ThirdStep">
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
import Notificatoin from '@/components/Miso/Factory/Liquidity/sidebarNotification'
import { LiquidLauncherWizard, WizardTab, BaseDivider } from '@/components'
import FirstStep from '@/components/Miso/Factory/Liquidity/FirstStep'
import SecondStep from '@/components/Miso/Factory/Liquidity/SecondtStep'
import ThirdStep from '@/components/Miso/Factory/Liquidity/ThirdStep'
import FinalStep from '@/components/Miso/Factory/Liquidity/FinalStep'
import FinalWalletStep from '@/components/Miso/Factory/Liquidity/FinalWalletStep'
import { Vue } from 'vue-property-decorator'
import { ZoomYTransition } from 'vue2-transitions'
import { mapMutations, mapGetters } from 'vuex'
import { sendTransactionAndWait, makeBatchCall } from '@/services/web3/base'
import { to18Decimals } from '@/util'
import { dai, uniswapFactory as uniswapFactoryAddress } from '@/constants/contracts'
import { initContractInstance as misoLauncherContract } from '@/services/web3/liquidityLauncher'
import { getContractInstance as getAuctionContract } from '@/services/web3/auctions/auction'

export default {
	name: 'LiquidityFactoory',
	components: {
		LiquidLauncherWizard,
		WizardTab,
		BaseDivider,
		Notificatoin,
		ZoomYTransition,
		FirstStep,
		SecondStep,
		ThirdStep,
		FinalStep,
		FinalWalletStep,
	},
	data() {
		return {
			breackpoint: null,
			nextBtnLoading: false,
			tabIndex: 0,
			model: {
				wallet: '',
				token: {
					address: '',
					name: '',
					symbol: '',
				},
				auctionAddress: '',
				auction: {
					address: '',
					payment_currency: '',
					payment_currency_name: '',
				},
				type: 'ETH',
				amount: '',
				percent: '',
				vaultAddr: '',
				endTime: '',
				allowance: '',
				tokenbalance: '',
				tokenSupply: '',
				customDays: '180',
				inputDays: null,
				deployedLauncher: {
					address: '',
					txHash: '',
				},
			},
			chosenLauncherType: 3,
			firstSteps: [
				{
					active: false,
					top: 22.5,
					title: 'ADMIN ADDRESS*',
					desctiption:
						'Enter the wallet address used to create this token on MISO. This enables you to proceed with launching liquidity on SUSHI, and is needed for administrative actions like defining access/permission lists and setting token distribution percentages and lockup timelines.',
				},
				{
					active: false,
					top: 42.5,
					title: 'AUCTION ADDRESS*',
					desctiption:
						'Enter the address of the auction held for this token. \n\n This enables us to import data from the auction to facilitate the launching process. This is not required, if you did not have an auction, leave this field blank.',
				},
			],
			SecondStep: [
				{
					active: false,
					top: 55,
					title: 'SUSHI LIQUIDITY PROVISIONING*',
					desctiption:
						'Select the amount of your custom token and it’s pair token to be allocated for it’s upcoming liquidity pool on SushiSwap.',
				},
			],
			ThirdStep: [
				{
					active: false,
					top: 22.5,
					title: 'VAULT ADDRESS*',
					desctiption:
						'Enter the wallet address that will hold the created SLP tokens as well as any remaining base pair tokens.  Can be the admin address, or any other wallet address you have access to.',
				},
				{
					active: false,
					top: 60.5,
					title: 'LIQUIDITY LOCKUP TIMELINE*',
					desctiption:
						'Set a timeline during which SLP tokens cannot be withdrawn from your liquidity pool on SushiSwap.  Industry standard lockup times are from 90 to 180 days to prevent rugpulling, but you can set a custom timeline as you see fit.',
				},
			],
			sidebarTitles: ['Initial Setup', 'Liquidity Options', 'Launch Settings'],
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
		}),
		stepTitle() {
			return ''
		},
		nextBtnText() {
			if (this.tabIndex === 2) return 'Review'
			if (this.tabIndex === 3) return 'Deploy'
			if (this.tabIndex === 4) return 'Set Auction Wallet'
			return 'Next'
		},
	},
	watch: {
		'$screen.breakpoint'(val) {
			this.breackpoint = val
		},
		tabIndex() {
			this.firstSteps.forEach((el) => {
				el.active = false
			})
		},
	},

	mounted() {
		this.breackpoint = this.$screen.breakpoint
	},
	methods: {
		...mapMutations({ modelUpdate: 'factory/UPDATE_MODEL' }),
		firstStepInputs(event) {
			let i = 0
			for (const key in event) {
				Vue.set(this.firstSteps[i], 'active', event[key])
				i++
			}
		},
		secondStepInputs(event) {
			let i = 0
			for (const key in event) {
				Vue.set(this.SecondStep[i], 'active', event[key])
				i++
			}
		},
		thirdStepInputs(event) {
			let i = 0
			for (const key in event) {
				Vue.set(this.ThirdStep[i], 'active', event[key])
				i++
			}
		},
		async validateStep(ref) {
			return await this.$refs[ref].validate()
		},
		async deploy() {
			this.nextBtnLoading = true
			await this.waitDeploy()
			this.nextBtnLoading = false
			if (this.model.deployedLauncher.txHash) {
				return true
			} else {
				return false
			}
		},
		async waitDeploy() {
			// Launcher Template Id
			const methods = [
				{ methodName: 'currentTemplateId', args: [this.chosenLauncherType] },
			]
			const [launcherTemplateId] = await makeBatchCall(
				misoLauncherContract(),
				methods
			)

			return new Promise((resolve) => {
				// Data Param
				let data
				switch (this.chosenLauncherType) {
					case 3:
						data = this.getdataParams()
						break
					default:
						data = this.getdataParams()
						break
				}

				// Create Launcher
				const method = misoLauncherContract().methods.createLauncher(
					launcherTemplateId,
					this.model.token.address,
					to18Decimals(this.model.amount),
					dai.misoFeeAcct,
					data
				)

				sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
					this.nextBtnLoading = false
					if (receipt) {
						this.model.deployedLauncher.txHash = receipt.transactionHash
						this.model.deployedLauncher.address =
							receipt.events.LauncherCreated.returnValues[1]
					}
					resolve(receipt.status)
				})
			})
		},
		onTabChanged(newValue) {
			this.tabIndex = newValue
			if (this.tabIndex === 0) {
				this.firstSteps.forEach((item) => {
					item.active = false
				})
			}
			if (this.tabIndex === 1) {
				this.SecondStep.forEach((item) => {
					item.active = false
				})
			}
			if (this.tabIndex === 2) {
				this.ThirdStep.forEach((item) => {
					item.active = false
				})
			}
		},
		onStepValidated(validated, model) {
			if (this.model === null) {
				this.model = model
			} else {
				Object.assign(this.model, model)
			}
			this.modelUpdate(model)
		},
		getdataParams() {
			const factory = uniswapFactoryAddress.address[this.currentProvidersNetworkId]
			const percent = (this.model.percent * 100).toFixed()
			const lockTime =
				(this.model.inputDays === null
					? this.model.customDays
					: this.model.inputDays) *
				3600 *
				24

			const dataParams = [
				this.model.auctionAddress,
				factory,
				this.model.wallet,
				this.model.vaultAddr,
				percent,
				lockTime,
			]

			return web3.eth.abi.encodeParameters(
				['address', 'address', 'address', 'address', 'uint256', 'uint256'],
				dataParams
			)
		},
		setAuctionWallet() {
			this.nextBtnLoading = true
			this.waitAuctionWallet()
			return false
		},
		waitAuctionWallet() {
			return new Promise((resolve) => {
				this.nextBtnLoading = true

				const contract = getAuctionContract(this.model.auctionAddress)
				const method = contract.methods.setAuctionWallet(
					this.model.deployedLauncher.address
				)

				sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
					this.nextBtnLoading = false
					if (receipt) {
						this.nextBtnLoading = false
						this.resetDataModel()
					}
					resolve(receipt.status)
				})
			})
		},
		resetDataModel() {
			this.model = {
				wallet: '',
				token: {
					address: '',
					name: '',
					symbol: '',
				},
				auctionAddress: '',
				auction: {
					address: '',
					payment_currency: '',
					payment_currency_name: '',
				},
				type: 'ETH',
				amount: '',
				percent: '',
				vaultAddr: '',
				endTime: '',
				allowance: '',
				tokenbalance: '',
				tokenSupply: '',
				customDays: '180',
				inputDays: null,
				deployedLauncher: {
					address: '',
					txHash: '',
				},
			}
			this.$refs['step-1'].resetAuctionAddress()
			this.$refs.lastWizard1.navigateToTab(0)
			this.$refs.lastWizard1.activeTab()
		},
	},
}
</script>

<style lang="scss" scoped></style>
