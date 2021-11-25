<template>
	<div>
		<div class="row">
			<div class="col-12 col-lg-9 col-xl-8 order-1 order-lg-0 pl-5 pr-5">
				<div class="hero-section mt-4 border-bottom-after position-relative px-2">
					<span class="text-secondary white-txt font-weight-bold pb-2 fs-10 h-100">
						New Permission List
					</span>
				</div>
				<client-only>
					<pointlist-wizard
						ref="allsteps"
						:next-button-text="nextBtnText"
						:next-btn-loading="nextBtnLoading"
						:next-button-disabled="nextBtnDisabled"
						@update:startIndex="onTabChanged"
					>
						<wizard-tab :before-change="() => deployPermissionList('step1')">
							<template slot="label">
								<span class="fs-5">1</span>
								<p>INITIAL SETUP</p>
							</template>
							<first-step
								ref="step1"
								:init-model="model"
								@on-validated="onStepValidated"
								@active-focus="allStepInputs"
							></first-step>
							<base-divider class="my-5" />
						</wizard-tab>
						<wizard-tab :before-change="() => validateStep('step2')">
							<template slot="label">
								<span class="fs-5">2</span>
								<p>SET PERMISSIONS</p>
							</template>
							<second-step
								v-if="model"
								ref="step2"
								:init-model="model"
								@on-validated="onStepValidated"
								@active-focus="allStepInputs"
							></second-step>
							<base-divider class="my-5" />
						</wizard-tab>
						<wizard-tab :before-change="() => deployPermissionList('step3')">
							<template slot="label">
								<span class="fs-5">3</span>
								<p>REVIEW & DEPLOY</p>
							</template>
							<third-step
								v-if="model"
								ref="step3"
								:init-model="model"
								@on-validated="onStepValidated"
							></third-step>
							<base-divider class="my-5" />
						</wizard-tab>
					</pointlist-wizard>
				</client-only>
			</div>
			<div
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
				<div v-if="tabIndex === 0 || tabIndex === 1">
					<template v-for="(item, index) in allSteps">
						<zoom-y-transition :key="index" :duration="300">
							<notificatoin
								:active="item.active"
								:title="item.title"
								:description="item.desctiption"
								:type="item.type ? item.type : ''"
								:top="item.top"
							/>
						</zoom-y-transition>
					</template>
				</div>
				<div v-else>
					<div class="col-12 d-flex mt-5 pt-5">
						<span
							class="justify-content-center text-center py-2 fs-4 font-bold"
							style="
								border-radius: 50%;
								height: 40px;
								width: 40px;
								color: #050f39;
								background-color: #fff;
								min-width: 40px;
							"
						>
							1
						</span>
						<div class="ml-2 pt-2">
							<span class="text-white font-bold fs-4">CONFIRM DETAILS*</span>
						</div>
					</div>
					<div class="col-12 d-flex mt-2">
						<span class="fs-2 text-white ml-5 opacity-7">
							Make sure the wallet owner/admin address and the name are set correctly
							to your liking.
						</span>
					</div>

					<div class="col-12 d-flex mt-4">
						<span
							class="justify-content-center text-center py-2 fs-4 font-bold"
							style="
								border-radius: 50%;
								height: 40px;
								width: 40px;
								color: #050f39;
								background-color: #fff;
								min-width: 40px;
							"
						>
							2
						</span>
						<div class="ml-2 pt-2">
							<span class="text-white font-bold fs-4">
								CONFIRM ADDRESSES & AMOUNTS*
							</span>
						</div>
					</div>
					<div class="col-12 d-flex mt-2">
						<span class="fs-2 text-white ml-5 opacity-7">
							Double-check your entries by downloading the .csv file to review. Click
							‘PREVIOUS’ button and re-upload the file if you would like to make any
							changes.
						</span>
					</div>
				</div>
			</div>
		</div>

		<modal :show.sync="showModal" v-bind="modalProps">
			<div class="bg-dark-900 h-full p-6 rounded">
				<h3 class="fs-6 font-bold text-white">List Contract Address</h3>
				<base-input
					v-model="model.pointListAddress"
					name="List Owner"
					:input-classes="'text-white'"
					placeholder="List Owner Address"
					type="text"
					:disabled="true"
				>
					<template slot="infoBlock">
						<svg-icon
							class="cursor-pointer copy-icon"
							icon="copy"
							height="20"
							width="20"
							color="#F46E41"
							:fill="false"
							@click="copyToClipboard(model.pointListAddress)"
						/>
					</template>
				</base-input>
				<div class="d-flex">
					<a
						class="d-block font-weight-bold cursor-pointer text-white"
						:href="`${explorer.root}${explorer.tx}${transactionHash}`"
						style="color: rgba(255, 255, 255, 0.5); text-decoration: underline"
						target="blank"
					>
						View On Etherscan
					</a>
				</div>
				<base-divider class="mt-5 mb-3" />
				<div>
					<h4>Note</h4>
					<span class="text-light">
						In order to enable this list, Go to your auction, click ‘Edit’, and then
						copy and paste this address in the permission list input field.
					</span>
				</div>
				<div class="text-center">
					<base-button
						round
						tag="nuxt-link"
						:to="{
							path: `/`,
						}"
						class="btn btn-default bg-transparent border-2"
						type="default"
					>
						Go To Marketplace
					</base-button>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BaseDivider, PointlistWizard, WizardTab, Modal } from '@/components'
import { tokenFactory } from '@/constants/contracts'
import { NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'
import { Vue } from 'vue-property-decorator'
import { ZoomYTransition } from 'vue2-transitions'

import Notificatoin from '@/components/Miso/Factory/Liquidity/sidebarNotification'
import FirstStep from '@/components/Miso/PointsList/FirstStep'
import SecondStep from '@/components/Miso/PointsList/SecondStep.vue'
import ThirdStep from '@/components/Miso/PointsList/ThirdStep.vue'
import { getContractInstance } from '@/services/web3/listFactory'
import { sendTransactionAndWait } from '@/services/web3/base'

const tokenFactoryAddress = tokenFactory.address

export default {
	components: {
		Notificatoin,
		ZoomYTransition,
		BaseDivider,
		PointlistWizard,
		WizardTab,
		FirstStep,
		SecondStep,
		ThirdStep,
		Modal,
	},
	layout: 'DashboardLayout',
	data() {
		return {
			contractAddress: '',
			deploymentFee: 0.1,
			tabIndex: 0,
			transactionHash: null,
			model: {
				listOwner: '',
				pointListAddress: null,
				points: [],
				auction: {
					payment_currency: {
						address: NATIVE_CURRENCY_ADDRESS,
						name: 'Ethereum',
						symbol: 'ETH',
						decimals: 18,
					},
					customAuctionAddress: '',
				},
			},
			nextBtnLoading: false,
			sidebarTitles: ['Initial Setup', 'Set Permissions', 'Review & Deploy'],
			allSteps: [
				{
					active: false,
					top: 25,
					title: 'LIST OWNER ADDRESS*',
					desctiption:
						'Enter the wallet address of the owner or administrator of this list.  If that person is you, then enter your wallet address you most commonly use to manage actions on MISO.                   ',
				},
				{
					active: false,
					top: 50,
					title: 'AUCTION PAYMENT TOKEN*',
					desctiption:
						'Select the currency you accept as payment during the auction.  If you don’t see the ERC-20 token you are looking for, input by pasting the address in the custom field.',
				},
				{
					active: false,
					top: 25,
					title: 'IMPORT LIST',
					type: 'html',
					desctiption:
						'Autofill your list by uploading a .csv file with instructed format below, or enter list manually in the next step. \n\n CSV Formatting \n\n <ul><li>In your spreadsheet application, enter the name of your list as the filename and format the following: </li><li>The word “Address” in column 1A </li><li>The word “Amount” in column 1B </li><li>Addresses and amounts in subsequent A & B columns, respectively </li><li>Export from your spreadsheet application as a .CSV file and upload here</ul>',
				},
				{
					active: false,
					top: 25,
					title: 'IMPORT LIST',
					type: 'html',
					desctiption:
						'Autofill your list by uploading a .csv file with instructed format below, or enter list manually in the next step. \n\n CSV Formatting \n\n <ul><li>Enter the name of your list as the filename </li><li>The word “Address” in column 1A </li><li>The word “Amount” in column 1B </li><li>Addresses and amounts in subsequent A & B columns, respectively </li><li>Export from your spreadsheet application as a .CSV file and upload here</ul>',
				},
				{
					active: false,
					top: 50,
					title: 'ADDRESSES & PURCHASE CAPS*',
					desctiption:
						'Enter a wallet address, and set an amount (in tokens) this address will be able to purchase.  The criteria for who and how much is completely up to you - this list will act like a “guest list” and prevent people who are not on the list from purchasing, and/or prevent people on the list from buying more than their allotted amount.  You can have as many addresses on this list as you’d like.',
				},
			],
			showModal: false,
			modalProps: {
				gradient: 'primary',
				modalContentClasses: 'rounded',
				bodyClasses: 'p-px',
			},
		}
	},
	computed: {
		...mapGetters({
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
			coinbase: 'ethereum/coinbase',
			explorer: 'ethereum/explorer',
		}),
		nextBtnText() {
			if (this.tabIndex === 0) return 'DEPLOY SETUP'
			if (this.tabIndex === 2) return 'Finish'
			return 'NEXT'
		},
		nextBtnDisabled() {
			if (this.tabIndex === 2) return this.$refs.step3.allAddedToList
			return false
		},
	},
	mounted() {
		this.contractAddress = this.getTokenFactoryAddress()
		this.listFactoryContract = getContractInstance()
	},
	methods: {
		getTokenFactoryAddress() {
			return tokenFactoryAddress[this.currentProvidersNetworkId]
		},
		onTabChanged(newValue) {
			this.tabIndex = newValue

			this.allSteps.forEach((item) => {
				item.active = false
			})
		},
		allStepInputs(event, val) {
			let i = 0
			for (const key in event) {
				Vue.set(this.allSteps[i], 'active', event[key])
				i++
			}
			this.chosenAuctionType = val
		},
		async validateStep(ref) {
			return await this.$refs[ref].validate()
		},
		onStepValidated(validated, model) {
			this.model = { ...this.model, ...model }
		},
		async deployPermissionList(ref) {
			if (this.tabIndex === 2) {
				this.showModal = true
			} else {
				// Validation
				const isValid = await this.$refs[ref].validate()
				if (!isValid) return

				// Deploy PointsList
				this.nextBtnLoading = true
				const methodToSend = this.listFactoryContract.methods.deployPointList(
					this.model.listOwner,
					[],
					[]
				)

				await sendTransactionAndWait(
					methodToSend,
					{ from: this.coinbase },
					(receipt) => {
						if (receipt.status) {
							this.transactionHash = receipt.transactionHash
							this.model.pointListAddress =
								receipt.events.PointListDeployed.returnValues.addr
							this.changeStep()
						}
						this.nextBtnLoading = false
					}
				)
			}
		},
		changeStep() {
			this.$refs.allsteps.activeTabIndex++
		},
		resetAllvariable() {
			this.model = {
				listOwner: '',
				pointListAddress: null,
				points: [],
				auction: {
					payment_currency: {
						address: NATIVE_CURRENCY_ADDRESS,
						name: 'Ethereum',
						symbol: 'ETH',
						decimals: 18,
					},
					customAuctionAddress: '',
				},
			}
			this.contractAddress = ''
			this.tabIndex = 0
			this.transactionHash = null
		},
		moveToFirst() {
			this.$refs.step2.successFileLoad = 'ready'
			this.$refs.allsteps.navigateToTab(0)
		},
	},
}
</script>
<style scoped>
.copy-icon {
	position: absolute;
	right: 10px;
	top: 10px;
}
</style>
<style>
.bg-transparent {
	background: transparent !important;
}
</style>
