<template>
	<div>
		<validation-observer>
			<div class="form-row justify-content-center mb-4">
				<div class="col-md-12">
					<div class="pb-3 d-line d-flex">
						<h5
							class="
								fs-4
								font-weight-bold
								text-uppercase
								mb-0
								border-bottom
								text-white
							"
						>
							Permission List Address:
						</h5>
					</div>
					<div class="pb-4 d-flex align-items-center">
						<p class="font-weight-bold text-white text-uppercase fs-3 mb-0">
							{{ model.pointListAddress | truncate(6) }}
						</p>
						<div class="copy-box d-flex align-items-center ml-2">
							<div class="copy-box_icon">
								<svg-icon
									class="cursor-pointer"
									icon="copy"
									height="20"
									width="20"
									color="#F46E41"
									:fill="false"
									@click="copyToClipboard(model.pointListAddress)"
								/>
							</div>
							<span class="font-weight-bolder text-white fs-2 pl-1">copy</span>
						</div>
					</div>

					<div class="d-flex">
						<div class="d-inline border-bottom mb-2">
							<div
								class="font-weight-bold fs-4 mb-0"
								:class="{ 'text-white': items.importList }"
							>
								IMPORT OR CREATE LIST*
							</div>
						</div>
					</div>
					<p class="mb-4">
						Autofill your list by uploading a .csv file below, or create one manually.
					</p>
					<div class="import_create_list row d-flex" rules="required">
						<div class="col-md-6">
							<div class="justify-content-center">
								<div
									v-if="successFileLoad === 'ready'"
									class="input-file-container ready-state"
								>
									<i class="el-icon el-icon-upload"></i>
									<input
										type="file"
										class="input-file"
										accept=".csv"
										rules="required"
										@change="onFileChange"
									/>
									<div class="upload__text mb-3">
										<p class="p-0">Choose or Drop a .csv</p>
										<p class="p-0">file here to import list.</p>
									</div>
								</div>
								<div
									v-if="successFileLoad === 'success'"
									class="input-file-container"
								>
									<i class="el-icon el-icon-success"></i>
									<div class="upload__text mb-3">
										<p class="p-0">File {{ fileName }} was uploaded successfully.</p>
										<input
											ref="fileUploadSuccess"
											type="file"
											class="input-file d-none"
											accept=".csv"
											@change="onFileChange"
										/>
										<a
											class="file-choose-again"
											@click="$refs.fileUploadSuccess.click()"
										>
											User a different file
										</a>
									</div>
								</div>
								<div v-if="successFileLoad === 'error'" class="input-file-container">
									<i class="el-icon el-icon-error"></i>
									<div class="upload__text mb-3">
										<p class="p-0">Error in processing file {{ fileName }}.</p>
										<input
											ref="fileUploadError"
											type="file"
											class="input-file d-none"
											accept=".csv"
											@change="onFileChange"
										/>
										<a
											class="file-choose-again"
											@click="$refs.fileUploadError.click()"
										>
											User a different file
										</a>
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="justify-content-center">
								<img src="@/assets/svg/VipList.svg" />
							</div>
						</div>
					</div>
					<div class="d-flex mt-4">
						<p
							class="border-bottom font-weight-bold cursor-pointer"
							:class="{ 'text-white': items.importList }"
							style="color: rgba(255, 255, 255, 0.5)"
							@click="showManualInput"
						>
							Create a list manually
						</p>
					</div>
				</div>
			</div>
		</validation-observer>
		<validation-observer v-if="manualInputState" ref="observer">
			<div class="form-row justify-content-center">
				<!-- style="min-height: 500px;display: block;" -->
				<div class="col-12 d-flex">
					<div class="col-md-1"></div>
					<div class="col-md-5">
						<div class="d-flex">
							<div class="d-inline border-bottom mb-4">
								<div class="font-weight-bold fs-4 mb-2 text-white">ADDRESSES</div>
							</div>
						</div>
					</div>
					<div class="col-md-5">
						<div class="d-flex">
							<div class="d-inline border-bottom mb-4">
								<div class="font-weight-bold fs-4 mb-2 text-white">
									PURCHASE AMOUNT CAPS
								</div>
							</div>
						</div>
					</div>
				</div>
				<div
					v-for="(point, index) in model.points"
					:key="index"
					class="col-12 d-flex"
				>
					<div class="col-md-1 mt-2">
						<p
							class="
								bg-gradient-orange
								font-weight-bold
								fs-3
								mb-0
								py-2
								text-center text-white
							"
							style="width: 40px; height: 40px; border-radius: 50%"
						>
							{{ index + 1 }}
						</p>
					</div>
					<div class="col-md-5">
						<base-input
							v-model="point.account"
							name="Account"
							placeholder="Enter an address"
							type="text"
							class="input-points"
							rules="required|isAddress"
							@focus="focusInput('addresses_purchaseCaps')"
						></base-input>
					</div>
					<div class="col-md-5">
						<base-input
							v-model="point.amount"
							name="Amount"
							placeholder="0.00"
							type="number"
							class="input-points"
							step="0.00001"
							min="0"
							rules="required|min_value:0"
							@focus="focusInput('addresses_purchaseCaps')"
						></base-input>
					</div>
					<div class="col-md-1">
						<div
							v-if="index !== 0"
							class="
								cursor-pointer
								font-weight-bold
								fs-3
								mb-0
								py-1
								text-left text-white
							"
							@click.prevent="removePoint(index)"
						>
							X
						</div>
					</div>
				</div>
				<div class="col-12 d-flex mt-3">
					<div class="col-md-1"></div>
					<div class="col-md-10">
						<base-button
							wide
							round
							class="add-another-points"
							:min-width="50"
							@click.prevent="addPoint"
						>
							ADD ANOTHER
						</base-button>
					</div>
				</div>
			</div>
		</validation-observer>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Steps, Step } from 'element-ui'

export default {
	components: {
		[Steps.name]: Steps,
		[Step.name]: Step,
	},
	props: {
		initModel: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			fileinput: '',
			items: {
				listOwnerAddress: false,
				auction_payment_token: false,
				importList: false,
				importListFailur: false,
				addresses_purchaseCaps: false,
			},
			successFileLoad: 'ready',
			fileName: '',
			manualInputState: false,
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			explorer: 'ethereum/explorer',
		}),
		model() {
			return this.initModel
		},
	},
	watch: {
		fileinput(newValue) {
			if (newValue === 'temp') return
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
			if (this.fileValidate(points)) {
				this.focusInput('importList')
				this.successFileLoad = 'success'
				this.model.points = points
			} else {
				this.focusInput('importListFailur')
				this.successFileLoad = 'error'
				this.model.points = []
			}
		},
	},
	methods: {
		selectCurrentAccount() {
			this.model.listOwner = this.coinbase
		},
		showManualInput() {
			this.fileinput = 'temp'
			this.successFileLoad = 'ready'
			this.model.points = []
			this.manualInputState = true
			this.addPoint()
		},
		addPoint() {
			this.model.points.push({ account: '', amount: 0 })
		},
		onFileChange(e) {
			this.items.listOwnerAddress = false
			this.items.addresses_purchaseCaps = false
			this.items.auction_payment_token = false

			const files = e.target.files || e.dataTransfer.files
			if (!files.length) return
			this.createInput(files[0])
			this.fileName = files[0].name

			this.manualInputState = false
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
			this.model.points.splice(index, 1)
		},
		redirect(url) {
			this.$router.push(url)
		},
		validate() {
			if (!this.manualInputState) {
				return this.model.points.length > 0
			}
			return this.$refs.observer.validate().then((res) => {
				this.$emit('on-validated', res, this.model)
				return res
			})
		},
		focusInput(val) {
			for (const key in this.items) {
				if (val === key) {
					this.items[key] = true
				} else {
					this.items[key] = false
				}
			}
			this.$emit('active-focus', this.items)
		},
		fileValidate(points) {
			return (
				points.length > 0 &&
				points[0].account.slice(0, 2) === '0x' &&
				!isNaN(Number(points[0].amount))
			)
		},
		// copy data to clipboard on click & display message
		copyToClipboard(value) {
			navigator.clipboard.writeText(value).then(() => {
				this.$notify({
					type: 'success',
					verticalAlign: 'bottom',
					horizontalAlign: 'right',
					message: 'successfully copied to clipboard!',
				})
			})
		},
	},
}
</script>

<style lang="scss">
.input-file-container {
	position: relative;
	background-color: transparent;
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	box-sizing: border-box;
	width: 100% !important;
	height: 100% !important;
	text-align: center;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.input-file-container .el-icon {
	font-size: 50px;
	margin: 40px 0 16px;
	line-height: 50px;
}
.input-file-container .el-icon-upload {
	color: #c0c4cc;
}
.input-file-container .el-icon-success {
	color: #169c00;
}
.input-file-container .el-icon-error {
	color: #f5333b;
}
.input-file-container .upload__text {
	color: #606266;
	font-size: 14px;
	text-align: center;
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
.input-file-container.ready-state .input-file {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
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
.input-file-container .upload__text .file-choose-again {
	text-decoration: underline;
}
.add-another-points {
	border: 2px solid #ffffff50;
	background: transparent;
}
.input-points input {
	border: none;
	padding-top: 1.8rem !important;
	padding-bottom: 1.8rem !important;
}
.copy-box {
	padding: 4px 6px;
	position: relative;
	span {
		z-index: 2;
		opacity: 0;
		transition: all 0.3s ease-in;
	}
	svg {
		position: relative;
		z-index: 2;
	}
	&_icon::after {
		position: absolute;
		border-radius: 2px;
		content: '';
		transition: all 0.3s ease-in;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: transparent;
	}
	&_icon:hover {
		& ~ span {
			opacity: 1;
			transition: all 0.3s ease-in;
		}
		&:after {
			content: '';
			opacity: 1;
			background: #111b47;
			transition: all 0.3s ease-in;
		}
	}
}
</style>
