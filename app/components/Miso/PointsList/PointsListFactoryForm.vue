<template>
	<div>
		<div class="hero-section mt-4 pt-3 pb-2 border-bottom-after position-relative">
			<span class="text-secondary font-weight-bold px-5 pb-2 fs-10 h-100">
				New Permission List
			</span>
		</div>
		<div class="px-5">
			<client-only>
				<simple-wizard :active-tab-index="activeStep">
					<wizard-tab :before-change="() => validateStep('step1')">
						<template slot="label">
							<span class="fs-5">1</span>
							<p>INITIAL SETUP</p>
						</template>
						<validation-observer ref="observer" v-slot="{ handleSubmit }">
							<form
								v-if="activeStep === 0"
								class="needs-validation"
								@submit.prevent="handleSubmit(deployPointsList)"
							>
								<div class="form-row justify-content-center mb-4">
									<div class="col-md-6">
										<base-input
											v-model="pointsListModel.listOwner"
											label="List Owner"
											name="List Owner"
											placeholder="List Owner Address"
											type="text"
											rules="required|isAddress"
										></base-input>

										<p class="font-weight-bold" @click="selectCurrentAccount">
											Use my account
										</p>
									</div>
								</div>

								<div class="form-row justify-content-center">
									<div
										v-for="(point, index) in pointsListModel.points"
										:key="index"
										class="col-12 d-flex justify-content-center"
									>
										<div class="col-md-5">
											<base-input
												v-model="point.account"
												:label="`Account ${index + 1}`"
												name="Account"
												placeholder="Account Address"
												type="text"
												rules="required|isAddress"
											></base-input>
										</div>
										<div class="col-md-5">
											<base-input
												v-model="point.amount"
												:label="`Amount ${index + 1}`"
												name="Amount"
												placeholder="Amount"
												type="number"
												step="0.00001"
												min="0"
												rules="required|min_value:0"
											></base-input>
										</div>
										<div class="col-md-1 mt-4">
											<base-button
												type="primary"
												:min-width="50"
												@click.prevent="removePoint(index)"
											>
												-
											</base-button>
										</div>
									</div>
									<base-button
										class="mt-4"
										type="primary"
										:round="true"
										@click.prevent="addPoint"
									>
										Add to List
									</base-button>

									<div class="justify-content-center mt-4 pl-3">
										<div class="input-file-container">
											<input
												id="importCSV"
												type="file"
												class="mt-4 input-file"
												@change="onFileChange"
											/>
											<label
												tabindex="0"
												for="my-file"
												class="input-file-trigger is-rounded"
											>
												Import the CSV
											</label>
										</div>
									</div>
								</div>
								<hr />
								<base-button
									v-if="!hideNextBtn"
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
							<p>SET PERMISSIONS</p>
						</template>
						<div v-if="activeStep === 1" class="row">
							<div class="col-md-6">
								<card>
									<div slot="header" class="row">
										<div class="col">
											<h6 class="text-uppercase text-muted ls-1 mb-1">List</h6>
										</div>
									</div>
									<div class="col-sm-12 col-md-12">
										<span class="h6 surtitle text-muted">List Owner</span>
										<span class="d-block h4">
											{{ pointsListModel.listOwner }}
										</span>
									</div>
									<div
										v-if="pointsListModel.points.length > 0"
										class="col-sm-12 col-md-12"
									>
										<span class="h6 surtitle text-muted">Accounts & Amounts</span>
										<span
											v-for="(point, index) in pointsListModel.points"
											:key="index"
											class="d-block h4"
										>
											{{ point.account }} & {{ point.amount }}
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
											class="d-block h4 text-primary"
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
					</wizard-tab>
					<wizard-tab :before-change="() => validateStep('step3')">
						<template slot="label">
							<span class="fs-5">3</span>
							<p>REVIEW & DEPLOY</p>
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
											<span class="h6 surtitle text-muted">Points List</span>
											<span class="d-block h4">
												<nuxt-link :to="`/points-list/${pointListAddress}`">
													{{ pointListAddress }}
												</nuxt-link>
											</span>
										</div>
									</card>
								</div>
							</div>
							<hr />
							<base-button
								class="float-right"
								type="primary"
								@click="redirect(`/points-list/${pointListAddress}`)"
							>
								View List Info
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
import { Steps, Step } from 'element-ui'
import {
	subscribeToPointListDeployedEvent,
	getContractInstance,
} from '@/services/web3/listFactory'
import { sendTransaction, toWei } from '@/services/web3/base'
import SimpleWizard from '@/components/Miso/PointsList/PointsListFactoryForm/Wizard'
import WizardTab from '@/components/Miso/PointsList/PointsListFactoryForm/WizardTab'
import { BaseButton } from '~/components'

// import { waitForReceipt } from "@/services/web3/base"

export default {
	components: {
		[Steps.name]: Steps,
		[Step.name]: Step,
		SimpleWizard,
		WizardTab,
		BaseButton,
	},
	data() {
		return {
			activeStep: 0,
			wizardModel: null,
			prevBtnDisabled: true,
			steps: [
				{
					title: 'Points List',
					needsValidation: true,
					refName: 'pointsListDetail',
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
			pointsListModel: {
				listOwner: '',
				points: [],
			},
			waitingForConfirmation: false,
			transactionHash: null,
			pointListAddress: null,
			pointListDeployedEventSubscribtion: null,
			fileinput: '',
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
	watch: {
		fileinput() {
			const arr = this.fileinput.split('\r\n')
			const points = arr
				.filter((elm) => elm !== '')
				.map((elm) => {
					const childArray = elm.split(',')
					return {
						account: childArray[0],
						amount: childArray[childArray.length - 1],
					}
				})
			this.pointsListModel.points = points
		},
	},
	mounted() {
		this.subscribeToPointListDeployedEvent()
		this.listFactoryContract = getContractInstance()
	},
	beforeDestroy() {
		this.unsubscribeFromPointListDeployedEvent()
	},
	methods: {
		validateStep(ref) {
			return this.$refs[ref].validate()
		},
		onStepValidated(validated) {
			this.wizardModel = validated
			this.nextTab()
		},
		changeStep() {
			if (this.activeStep === 2) {
				this.pointsListModel = {
					listOwner: '',
					points: [
						{
							account: '',
							amount: 0,
						},
					],
				}
				this.activeStep = 0
			} else {
				this.activeStep++
			}
		},
		selectCurrentAccount() {
			this.pointsListModel.listOwner = this.coinbase
		},
		addPoint() {
			this.pointsListModel.points.push({ account: '', amount: 0 })
		},
		onFileChange(e) {
			const files = e.target.files || e.dataTransfer.files
			if (!files.length) return
			this.createInput(files[0])
		},
		createInput(file) {
			const reader = new FileReader()
			const vm = this
			reader.onload = (e) => {
				vm.fileinput = reader.result
			}
			reader.readAsText(file)
		},
		removePoint(index) {
			this.pointsListModel.points.splice(index, 1)
		},
		async deployPointsList() {
			// Validation
			const isValid = await this.$refs.observer.validate()
			if (!isValid) return

			// Deploy PointsList
			const methodToSend = this.listFactoryContract.methods.deployPointList(
				this.pointsListModel.listOwner,
				this.pointsListModel.points.map((point) => point.account),
				this.pointsListModel.points.map((point) => toWei(point.amount))
			)

			const txHash = await sendTransaction(methodToSend, {
				from: this.coinbase,
			})

			if (txHash) {
				this.transactionHash = txHash
				this.changeStep()
			}
			this.waitingForConfirmation = false
		},
		subscribeToPointListDeployedEvent() {
			this.pointListDeployedEventSubscribtion = subscribeToPointListDeployedEvent()
				.on('data', (event) => {
					if (this.transactionHash) {
						if (this.transactionHash.toLowerCase() === event.transactionHash) {
							this.pointListAddress = event.returnValues.pointList
							this.changeStep()
						}
					}
				})
				.on('error', (error) => {
					console.log('event error:', error)
				})
		},
		unsubscribeFromPointListDeployedEvent() {
			if (this.pointListDeployedEventSubscribtion) {
				this.pointListDeployedEventSubscribtion.unsubscribe()
			}
		},
		redirect(url) {
			this.$router.push(url)
		},
	},
}
</script>

<style lang="scss">
.input-file-container {
	position: relative;
}
.input-file-trigger {
	display: block;
	padding: 14px 45px;
	background: #f46e41;
	background-image: linear-gradient(to bottom left, #f46e41, #ba54f5, #f46e41);
	background-size: 210% 210%;
	background-position: top right;
	background-color: #f46e41;
	transition: all 0.15s ease;
	box-shadow: none;
	color: #ffffff;
	font-size: 1rem !important;
	font-weight: bolder;
	cursor: pointer;
}
.input-file {
	position: absolute;
	top: 0;
	left: 0;
	width: 225px;
	opacity: 0;
	padding: 14px 0;
	cursor: pointer;
}
.input-file:hover + .input-file-trigger,
.input-file:focus + .input-file-trigger,
.input-file-trigger:hover,
.input-file-trigger:focus {
	background: #f46e41;
	background-image: linear-gradient(to bottom left, #f46e41, #ba54f5, #f46e41);
	background-size: 210% 210%;
	background-position: top right;
	background-color: #f46e41;
	transition: all 0.15s ease;
	box-shadow: none;
	color: #ffffff;
}
</style>
