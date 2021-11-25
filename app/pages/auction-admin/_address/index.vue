<template>
	<div>
		<div class="row d-flex justify-content-center">
			<div class="col-md-11 mt-6">
				<div v-if="!loading">
					<!---- Details !---->
					<div
						class="hero-section mt-4 pt-3 pb-2 border-bottom-after position-relative"
					>
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
							Auction Details
						</span>
						<p class="mt-4">
							Only the Auction admin and approved operators for this auction are able
							to edit any of the details below.
						</p>
						<p>Do not waste your gas.</p>
					</div>
					<hr />
					<div class="px-md-5">
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(0)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-5 mt-3">
										<base-input
											v-model="document.website"
											label="Website"
											name="website"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-5">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<!-- Icon !-->
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(1)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-5 mt-3">
										<base-input
											v-model="document.icon"
											label="Icon"
											name="icon"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
										<div class="warning-info">* must be 256 * 256</div>
									</div>
									<div class="col-md-* mt-5">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<!-- Icon !-->
						<!-- Desktop Banner !-->
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(12)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-5 mt-3">
										<base-input
											v-model="document.desktopBanner"
											label="Desktop Banner"
											name="desktop banner"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
										<div class="warning-info">* must be 478 * 678</div>
									</div>
									<div class="col-md-* mt-5">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<!-- Desktop Banner !-->
						<!-- Mobile Banner !-->
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(13)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-5 mt-3">
										<base-input
											v-model="document.mobileBanner"
											label="Mobile Banner"
											name="mobile banner"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
										<div class="warning-info">* must be 360 * 104</div>
									</div>
									<div class="col-md-* mt-5">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<!-- Mobile Banner !-->
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(2)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-5 mt-3">
										<div class="mb-3">Description</div>
										<base-input
											:rules="`required|text:${document.description}`"
											name="description"
										>
											<textarea
												v-model="document.description"
												class="form-control font-weight-bold text-bg-white p-2"
												maxlength="300"
												type="text"
												rules="required|text"
											/>
										</base-input>

										<div class="warning-info">* max 300 letters</div>
									</div>
									<div class="col-md-* mt-5">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<!-- <validation-observer v-slot="{ invalid }">
							<form
								class="needs-validation"
								@submit.prevent="updateDocument(2)"
							>
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-5 mt-3">
										<div class="mb-3">Description</div>
										<textarea
											v-model="document.description"
											class="form-control font-weight-bold text-bg-white p-2"
											maxlength="300"
											type="text"
											rule="required|text"
										/>
										<div class="warning-info">* max 300 letters</div>
									</div>
									<div class="col-md-* mt-5">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer> -->
					</div>

					<!---- Social Info !---->
					<hr />
					<div
						class="hero-section mt-4 pt-3 pb-2 border-bottom-after position-relative"
					>
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
							Socials
						</span>
					</div>
					<hr />
					<div class="px-md-5">
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(3)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-2 mt-4">
										<i class="fa fa-file" />
										Whitepaper
									</div>
									<div class="col-md-3 mt-3">
										<base-input
											v-model="document.whitepaper"
											name="whitepaper"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(4)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-2 mt-4">
										<i class="fab fa-github" />
										Github
									</div>
									<div class="col-md-3 mt-3">
										<base-input
											v-model="document.github"
											name="github"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(5)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-2 mt-4">
										<i class="fab fa-telegram" />
										Telegram
									</div>
									<div class="col-md-3 mt-3">
										<base-input
											v-model="document.telegram"
											name="telegram"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(6)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-2 mt-4">
										<i class="fab fa-weixin" />
										Wechat
									</div>
									<div class="col-md-3 mt-3">
										<base-input
											v-model="document.wechat"
											name="wechat"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(7)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-2 mt-4">
										<i class="fab fa-discord" />
										Discord
									</div>
									<div class="col-md-3 mt-3">
										<base-input
											v-model="document.discord"
											name="discord"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(8)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-2 mt-4">
										<i class="fab fa-medium" />
										Medium
									</div>
									<div class="col-md-3 mt-3">
										<base-input
											v-model="document.medium"
											name="medium"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(9)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-2 mt-4">
										<i class="fab fa-reddit" />
										Reddit
									</div>
									<div class="col-md-3 mt-3">
										<base-input
											v-model="document.reddit"
											name="reddit"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(10)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-2 mt-4">
										<i class="fab fa-twitter" />
										Twitter
									</div>
									<div class="col-md-3 mt-3">
										<base-input
											v-model="document.twitter"
											name="twitter"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateDocument(11)">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-2 mt-4">
										<i class="fa fa-book" />
										Docs
									</div>
									<div class="col-md-3 mt-3">
										<base-input
											v-model="document.docs"
											name="docs"
											placeholder=""
											type="text"
											rules="required|website"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
					</div>

					<!---- Auction Wallet !---->
					<hr />
					<div class="hero-section mt-4 pt-3 pb-2 position-relative">
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
							Auction Wallet
						</span>
						<p class="mt-4">The auction funds raised will be sent to this address.</p>
					</div>
					<div class="px-md-5">
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateAuctionWallet">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-5 mt-3">
										<base-input
											v-model="wallet"
											name="Auction Wallet Address"
											placeholder=""
											type="text"
											rules="required|isAddress"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
											:loading="waitingForWallet"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
					</div>
					<div class="hero-section pt-3 pb-2 position-relative">
						<p>Or you can set up the liquidity launcher.</p>
					</div>
					<div class="row px-md-5 col-md-12">
						<div class="col-md-2" />
						<div class="col-md-5 mt-3">
							<base-button
								class="float-center"
								type="primary"
								@click="setupLiquidityPool"
							>
								Set up Liquidity Pool
							</base-button>
						</div>
					</div>

					<!---- Permission List !---->
					<hr />
					<div
						class="hero-section mt-4 pt-3 pb-2 border-bottom-after position-relative"
					>
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
							Permission List
						</span>
						<p class="mt-4">
							Auctions are open by default. You can add a smart contract with approval
							logic to your auction. This will restrict users participating in your
							auction if enabled. Please refer to our developer documentation and
							sample list in our Github Repo.
						</p>
					</div>
					<hr />
					<div class="px-md-5">
						<validation-observer v-slot="{ invalid }">
							<form class="needs-validation" @submit.prevent="updateList">
								<div class="row">
									<div class="col-md-2" />
									<div class="col-md-5 mt-3">
										<base-input
											v-model="list.address"
											name="list"
											placeholder=""
											type="text"
											rules="required|isAddress"
										></base-input>
									</div>
									<div class="col-md-* mt-2">
										<base-button
											class="float-right"
											type="primary"
											native-type="submit"
											:disabled="invalid"
										>
											Update
										</base-button>
									</div>
								</div>
							</form>
						</validation-observer>
						<form class="needs-validation mb-3" @submit.prevent="updateListStatus">
							<div class="row">
								<div class="col-md-3" />
								<label
									class="form-control-label font-weight-bolder col-md-4 mt-4"
									style="text-align: right"
								>
									status: {{ list.status ? 'active' : 'inactive' }}
								</label>
								<div class="col-md-* mt-2">
									<base-button
										class="float-right"
										type="primary"
										native-type="submit"
										:disabled="invalid"
									>
										{{ list.status ? 'disable' : 'enable' }}
									</base-button>
								</div>
							</div>
						</form>
						<span
							v-if="isValidListAddress"
							class="
								text-uppercase text-secondary
								font-weight-bold
								border-bottom
								pb-2
								fs-4
								h-100
							"
						>
							Point List
						</span>
						<validation-observer v-slot="{ invalid }">
							<form
								v-if="isValidListAddress"
								class="needs-validation"
								@submit.prevent="updatePointList"
							>
								<div class="form-row justify-content-center mt-4">
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

									<base-button
										class="mt-4 ml-5"
										type="primary"
										:disabled="!pointsListModel.points.length || invalid"
										native-type="submit"
									>
										Update
									</base-button>
								</div>
							</form>
						</validation-observer>
					</div>

					<!---- Cancel Auction !---->
					<hr />
					<div
						class="hero-section mt-4 pt-3 pb-2 border-bottom-after position-relative"
					>
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
							Cancel Auction
						</span>
						<p class="mt-4">
							The Auction can only be cancelled by the admin before the start date.
						</p>
					</div>
					<div class="px-md-5">
						<base-button class="float-left" type="primary" @click="cancelAuction">
							Cancel
						</base-button>
					</div>
				</div>

				<loader v-else width="80" height="80" y="250" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
import { getContractInstance as dutchAuctionContract } from '@/services/web3/auctions/dutch'
import { getContractInstance as crowdsaleContract } from '@/services/web3/auctions/crowdsale'
import { getContractInstance as batchAuctionContract } from '@/services/web3/auctions/batch'
import { getContractInstance as pointListContract } from '@/services/web3/pointList'
import {
	makeBatchCall,
	sendTransaction,
	sendTransactionAndWait,
	toWei,
} from '@/services/web3/base'
import { ZERO_ADDRESS } from '@/constants/networks'
import Swal from 'sweetalert2'

export default {
	name: 'AuctionAdminInfo',
	data() {
		return {
			auctionAddress: this.$route.params.address,
			document: {
				website: '',
				icon: '',
				description: '',
				whitepaper: '',
				github: '',
				telegram: '',
				wechat: '',
				discord: '',
				medium: '',
				reddit: '',
				twitter: '',
				docs: '',
				desktopBanner: '',
				mobileBanner: '',
			},
			list: {
				address: '',
				status: false,
			},
			contractInstance: null,
			loading: true,
			subscription: null,
			fileinput: '',
			pointsListModel: {
				listOwner: '',
				points: [],
			},
			wallet: '',
			waitingForWallet: false,
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
		}),
		isValidListAddress() {
			return (
				this.list.address !== ZERO_ADDRESS && web3.utils.isAddress(this.list.address)
			)
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
	async mounted() {
		// Contract
		await this.getTemplateId()
		switch (parseInt(this.marketTemplateId)) {
			case 1:
				this.contractInstance = crowdsaleContract(this.auctionAddress)
				break
			case 2:
				this.contractInstance = dutchAuctionContract(this.auctionAddress)
				break
			case 3:
				this.contractInstance = batchAuctionContract(this.auctionAddress)
				break
			default:
				break
		}

		// Documents
		const methods = [{ methodName: 'getDocuments', args: [this.auctionAddress] }]
		const [documents] = await makeBatchCall(misoHelperContract(), methods)

		documents.forEach((document) => {
			const name = document['0']
			const data = document['1']
			if (name && data) {
				this.document[name] = data
			}
		})

		// Wallet
		const walletMethod = [{ methodName: 'wallet' }]
		const [wallet] = await makeBatchCall(this.contractInstance, walletMethod)
		this.wallet = wallet

		// PointList
		const pointListMethod = [{ methodName: 'pointList' }]
		const [pointList] = await makeBatchCall(this.contractInstance, pointListMethod)
		this.list.address = pointList

		// PointList Status
		const marketStatusMethod = [{ methodName: 'marketStatus' }]
		const [marketStatus] = await makeBatchCall(
			this.contractInstance,
			marketStatusMethod
		)
		this.list.status = marketStatus.usePointList

		this.loading = false
	},
	methods: {
		async getTemplateId() {
			const methods = [{ methodName: 'marketTemplate' }]
			const [marketTemplate] = await makeBatchCall(
				dutchAuctionContract(this.auctionAddress),
				methods
			)
			this.marketTemplateId = marketTemplate
		},
		async updateDocument(index) {
			const name = Object.keys(this.document)[index]
			const data = this.document[name]
			const method = this.contractInstance.methods.setDocument(name, data)

			if (name === 'icon' || name === 'desktopBanner' || name === 'mobileBanner') {
				const width = name === 'icon' ? 256 : name === 'desktopBanner' ? 478 : 360
				const height = name === 'icon' ? 256 : name === 'desktopBanner' ? 678 : 104
				const img = new Image()
				img.onload = async () => {
					if (img.width === width && img.height === height) {
						await sendTransaction(method, { from: this.coinbase })
					} else {
						Swal.fire({
							icon: 'error',
							title: 'Oops!',
							html: `The ${
								name === 'icon'
									? 'icon'
									: name === 'desktopBanner'
									? 'desktop banner'
									: 'mobile banner'
							} must be ${width} X ${height}`,
							buttonsStyling: false,
							showCancelButton: false,
							confirmButtonText: 'Close',
							confirmButtonClass: 'btn btn-fill',
						})
					}
				}
				img.src = data
			} else {
				await sendTransaction(method, { from: this.coinbase })
			}
		},
		async updateList() {
			const method = this.contractInstance.methods.setList(this.list.address)
			await sendTransaction(method, { from: this.coinbase })
		},
		async updateListStatus() {
			const method = this.contractInstance.methods.enableList(!this.list.status)
			await sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
				if (receipt.status) {
					this.list.status = !this.list.status
				}
			})
		},
		async updatePointList() {
			console.log(this.pointsListModel.points)
			const method = pointListContract(this.list.address).methods.setPoints(
				this.pointsListModel.points.map((point) => point.account),
				this.pointsListModel.points.map((point) => toWei(point.amount))
			)
			console.log(pointListContract(this.list.address), method)
			await sendTransaction(method, { from: this.coinbase })

			this.pointsListModel.points = []
		},
		async cancelAuction() {
			const method = this.contractInstance.methods.cancelAuction()
			await sendTransaction(method, { from: this.coinbase })
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
		addPoint() {
			this.pointsListModel.points.push({ account: '', amount: 0 })
		},
		removePoint(index) {
			this.pointsListModel.points.splice(index, 1)
		},
		updateAuctionWallet() {
			this.waitingForWallet = true

			const method = this.contractInstance.methods.setAuctionWallet(this.wallet)

			sendTransactionAndWait(method, { from: this.coinbase }, (_) => {
				this.waitingForWallet = false
			})
		},
		setupLiquidityPool() {
			window.open(`/factory/liquidity?auction=${this.auctionAddress}`, '_self')
		},
	},
}
</script>

<style lang="scss" scoped>
.warning-info {
	width: 100%;
	margin-top: 0.25rem;
	font-size: 80%;
	color: #ba54f5;
}
textarea.form-control {
	height: 150px;
	line-height: 1.5;
	border: 1px solid lighten(#222a42, 5%);
	&:focus,
	&:active {
		border: 1px solid #f46e41;
	}
}
</style>
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
