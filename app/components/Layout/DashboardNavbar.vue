<template>
	<base-nav
		v-model="showMenu"
		class="navbar-absolute top-navbar"
		:class="[
			slideBar ? 'inactive-bar' : 'active-bar',
			!darkMode ? 'nav_bg' : 'divider',
		]"
		:transparent="true"
	>
		<div slot="brand" class="navbar-wrapper">
			<div
				class="navbar-toggle d-inline"
				:class="{ toggled: $sidebar.showSidebar }"
				@click="showSideBar = !showSideBar"
			>
				<button type="button" class="navbar-toggler" @click="toggleSidebar">
					<span class="navbar-toggler-bar bar1"></span>
					<span class="navbar-toggler-bar bar2"></span>
					<span class="navbar-toggler-bar bar3"></span>
				</button>
			</div>
			<span
				v-if="darkMode && !notDesktopSize"
				class="text-white"
				:class="[slideBar ? 'pl-4 ml-1' : 'pl-2']"
			>
				MISO v1.0.4.4
			</span>
		</div>
		<div v-if="notDesktopSize" slot="logo" class="d-flex justify-content-center">
			<zoom-x-transition :duration="500">
				<nuxt-link to="/">
					<svg-icon
						v-show="!showSideBar"
						icon="miso"
						:height="logoHeight"
						width="150"
						color="#ffffff"
					/>
				</nuxt-link>
			</zoom-x-transition>
		</div>
		<ul class="navbar-nav ml-auto">
			<div class="d-flex justify-content-center">
				<div class="d-flex align-items-center pr-2">
					<svg-icon
						class="mr-2"
						icon="sun"
						height="20"
						width="20"
						color="#ffffff"
						:fill="false"
					/>
					<base-switch
						v-model="darkMode"
						class="mb-0"
						@input="toggleMode"
					></base-switch>
					<svg-icon
						class="ml-2"
						icon="moon"
						height="20"
						width="20"
						color="#ffffff"
						:fill="false"
					/>
				</div>
			</div>
			<div
				v-if="coinbase && isMetamask"
				class="d-flex align-items-center justify-content-center pr-2 my-3 my-lg-0"
			>
				<button
					type="primary"
					class="btn toggle-network-btn text-white btn-primary py-3 btn-simple"
					:class="{ 'connect-btn_white': !darkMode }"
					style="height: 20px"
					@click="showNetworkModal = true"
				>
					<img
						:src="networkIcons[networkId]"
						alt="Network icon"
						class="rounded-md mr-2"
						style="width: 22px; height: 22px"
					/>
					{{ networkLables[networkId] }}
				</button>
			</div>

			<client-only>
				<div class="d-flex justify-content-center pb-5 mb-0 pb-lg-0">
					<button
						v-if="!coinbase"
						class="text-uppercase rounded-pill connect-btn text-white my-3"
						:class="{ 'connect-btn_white': !darkMode }"
						@click="connectAccount()"
					>
						CONNECT
					</button>
					<base-button
						v-else
						:class="{ 'connect-btn_white': !darkMode }"
						class="text-uppercase rounded-pill connect-btn text-white"
						@click="showModal = true"
					>
						<span class="mr-2">{{ coinbase | truncate }}</span>
						<div class="avatar-group primary">
							<span class="avatar avatar-sm rounded-circle">
								<eth-image
									:opts="{
										seed: coinbase,
										size: 10,
										scale: 5,
									}"
								/>
							</span>
						</div>
					</base-button>
				</div>
			</client-only>
		</ul>
		<div v-if="coinbase">
			<modal :show.sync="showModal">
				<template slot="header">
					<h5 class="modal-title">Account</h5>
				</template>
				<div class="row">
					<div class="col-9">
						<span class="mr-2">{{ coinbase }}</span>
					</div>
					<div class="col-3">
						<div class="avatar-group primary">
							<span class="avatar avatar-sm rounded-circle">
								<eth-image
									:opts="{
										seed: coinbase,
										size: 10,
										scale: 5,
									}"
								/>
							</span>
						</div>
					</div>
				</div>
				<template slot="footer">
					<base-button type="secondary" @click="disconnect()">Disconnect</base-button>
					<base-button type="secondary" @click="change()">Change</base-button>
				</template>
			</modal>

			<network-modal :show.sync="showNetworkModal">
				<div
					class="d-flex flex-col h-full w-100 bg-dark-900 rounded overflow-y-auto p-6"
				>
					<div class="relative mb-2">
						<h2 class="text-h5 mt-2.5 font-bold mb-0 text-primary">Networks</h2>
						<div
							class="
								p-1
								absolute
								top-0
								right-0
								w-5
								h-5
								rounded-full
								border-2
								text-primary
								hover:text-high-emphesis
								border-primary
								flex
								items-center
								justify-center
								cursor-pointer
							"
							@click="closeModal"
						>
							<svg
								width="8px"
								height="8px"
								viewBox="0 0 8 8"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									class="stroke-current stroke-1"
									d="M6.8746 7.54507C6.6953 7.54507 6.52679 7.47526 6.40003 7.34844L4.00001 4.94841L1.60003 7.34844C1.47327 7.47526 1.30473 7.54507 1.12547 7.54507C0.946204 7.54507 0.777659 7.47526 0.650905 7.34844C0.524152 7.22169 0.454346 7.05317 0.454346 6.87394C0.454346 6.69468 0.524152 6.52616 0.650905 6.39938L3.05093 3.99934L0.650905 1.5993C0.389254 1.33762 0.389254 0.911858 0.650905 0.650175C0.777659 0.52342 0.946174 0.453613 1.12547 0.453613C1.30473 0.453613 1.47327 0.52342 1.60003 0.650175L4.00005 3.05021L6.40007 0.650175C6.52685 0.52342 6.69536 0.453613 6.87463 0.453613C7.05386 0.453613 7.22237 0.52342 7.34912 0.650175C7.47591 0.776929 7.54568 0.945476 7.54568 1.12474C7.54568 1.304 7.47591 1.47255 7.34912 1.5993L4.94911 3.99934L7.34919 6.39938C7.47597 6.52616 7.54578 6.69468 7.54578 6.87394C7.54578 7.05317 7.47597 7.22169 7.34919 7.34844C7.22234 7.47523 7.05383 7.54507 6.8746 7.54507ZM4.00001 4.90511L6.42168 7.3268C6.54262 7.4478 6.70348 7.51445 6.8746 7.51445C7.04565 7.51445 7.20651 7.4478 7.32751 7.3268C7.44848 7.20586 7.51513 7.04503 7.51513 6.87394C7.51513 6.70285 7.44848 6.54199 7.32751 6.42102L4.90578 3.99934L7.32745 1.57766C7.44842 1.45669 7.51504 1.29583 7.51504 1.12474C7.51504 0.95365 7.44842 0.792819 7.32745 0.671851C7.20651 0.550883 7.04568 0.484261 6.8746 0.484261C6.70351 0.484261 6.54265 0.550883 6.42168 0.671851L4.00001 3.09354L1.57835 0.671851C1.45738 0.550883 1.29652 0.484261 1.12543 0.484261C0.954348 0.484261 0.793519 0.550883 0.672552 0.671851C0.422841 0.921594 0.422841 1.32791 0.672552 1.57766L3.09422 3.99934L0.672552 6.42102C0.551585 6.54199 0.484962 6.70285 0.484962 6.87394C0.484962 7.04503 0.551585 7.20586 0.672552 7.3268C0.793549 7.4478 0.954379 7.51445 1.12547 7.51445C1.29655 7.51445 1.45738 7.4478 1.57838 7.3268L4.00001 4.90511Z"
								/>
							</svg>
						</div>
					</div>
					<div class="text-lg text-primary mb-6">
						You are currently browsing
						<span class="font-bold text-pink">MISO</span>
						<br />
						on the
						<span class="font-bold text-blue">
							{{ networkLables[networkId] }}
						</span>
						network.
						<br />
						<span class="network-metamask-warning">
							ETH networks can only be switched via Metamask
						</span>
					</div>
					<div
						class="d-flex flex-col space-y-5"
						style="overflow-y: scroll; height: 700px"
					>
						<button
							v-for="(item, index) in activeChainIds"
							:key="index + '_a'"
							:disabled="+item.chainId === networkId || item.disabled"
							class="
								flex
								w-100
								rounded
								p-75
								d-flex
								items-center
								network_btn
								from-blue
								to-pink
							"
							:class="{
								'btn-active': !item.disabled,
								'bg-dark-800': +item.chainId !== networkId && !item.disabled,
								'btn-disabled': item.disabled,
							}"
							@click="changeEthChain(index)"
						>
							<img
								:src="networkIcons[+item.chainId]"
								alt="Switch Network"
								class="rounded-md mr-2 w-8 h-8"
							/>
							<div class="text-primary font-bold">
								<span>{{ item.chainName }}</span>
							</div>
						</button>
						<br />
						<div class="text-lg text-primary mb-6">
							We'll be launching on these networks soon.
						</div>
						<button
							v-for="(item, index) in inactiveChainIds"
							:key="index + '_b'"
							:disabled="+item.chainId === networkId || item.disabled"
							class="
								flex
								w-100
								rounded
								p-75
								d-flex
								items-center
								network_btn
								from-blue
								to-pink
							"
							:class="{
								'btn-active': !item.disabled,
								'bg-dark-800': +item.chainId !== networkId && !item.disabled,
								'btn-disabled': item.disabled,
							}"
							@click="changeEthChain(index)"
						>
							<img
								:src="networkIcons[+item.chainId]"
								alt="Switch Network"
								class="rounded-md mr-2 w-8 h-8"
							/>
							<div class="text-primary font-bold">
								<span>{{ item.chainName }}</span>
							</div>
						</button>
					</div>
				</div>
			</network-modal>
		</div>
	</base-nav>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { NETWORK_ICON, NETWORK_LABEL, CHAIN_IDS } from '@/constants/networks'
import { BaseNav, BaseSwitch, Modal, NetworkModal } from '@/components'
import { ZoomXTransition } from 'vue2-transitions'
import EthImage from '@/components/Miso/EthIdentication/EthImage.vue'

export default {
	name: 'DishboardNavbar',
	components: {
		BaseNav,
		BaseSwitch,
		EthImage,
		ZoomXTransition,
		Modal,
		NetworkModal,
	},
	props: {
		slideBar: {
			type: Boolean,
			required: false,
			discriptioin: 'navbar side with slidebar min/max condition',
		},
	},
	data() {
		return {
			activeNotifications: false,
			showMenu: false,
			searchModalVisible: false,
			searchQuery: '',
			darkMode: true,
			breackpoint: null,
			showSideBar: false,
			showModal: false,
			showNetworkModal: false,
			networkIcons: [],
			networkLables: [],
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			networkId: 'ethereum/networkId',
			isMetamask: 'ethereum/isMetamask',
			mode: 'theme/getMode',
		}),
		activeChainIds() {
			return CHAIN_IDS.filter((chainId) => !chainId.disabled)
		},
		inactiveChainIds() {
			return CHAIN_IDS.filter((chainId) => chainId.disabled)
		},
		isRTL() {
			return this.$rtl.isRTL
		},
		notDesktopSize() {
			if (
				this.breackpoint === 'md' ||
				this.breackpoint === 'sm' ||
				this.breackpoint === 'xs'
			) {
				return true
			}
			return false
		},
		logoHeight() {
			if (this.breackpoint === 'xs') {
				return '10'
			}
			return '15'
		},
	},

	watch: {
		darkMode(type) {
			this.SET_THEME(type)
			this.initTheme(type)
		},
		'$screen.breakpoint'(val) {
			this.breackpoint = val
		},
	},
	created() {
		this.networkIcons = NETWORK_ICON
		this.networkLables = NETWORK_LABEL
		if (process.browser) {
			const pageThem = JSON.parse(localStorage.getItem('miso-theme'))
			if (pageThem !== null) {
				this.SET_THEME(pageThem)
				this.darkMode = this.mode
				this.initTheme(pageThem)
			}
		}
		this.breackpoint = this.$screen.breakpoint
	},
	methods: {
		closeModal() {
			this.showNetworkModal = false
		},
		...mapActions({
			enableAccount: 'ethereum/enableAccount',
			disconnectAccount: 'ethereum/disconnectAccount',
			changeWallet: 'ethereum/changeWallet',
		}),
		...mapMutations('theme', ['SET_THEME']),
		async connectAccount() {
			await this.enableAccount()
		},
		initTheme(val) {
			const body = document.body
			if (val) {
				body.classList.remove('white-content')
			} else {
				body.classList.add('white-content')
			}
		},
		async disconnect() {
			await this.disconnectAccount()
			this.showModal = false
		},
		async change() {
			this.showModal = false
			await this.changeWallet()
		},
		toggleMode(type) {
			this.$emit('darkMode', type)
			const docClasses = document.body.classList
			if (type) {
				docClasses.remove('white-content')
			} else {
				docClasses.add('white-content')
			}
		},
		capitalizeFirstLetter(string) {
			if (!string || typeof string !== 'string') {
				return ''
			}
			return string.charAt(0).toUpperCase() + string.slice(1)
		},
		closeDropDown() {
			this.activeNotifications = false
		},
		toggleSidebar() {
			this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
		},
		toggleMenu() {
			this.showMenu = !this.showMenu
		},
		async changeEthChain(index) {
			const chain = this.activeChainIds[index]
			try {
				await ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: chain.chainId }],
				})
			} catch (switchError) {
				ethereum
					.send('wallet_addEthereumChain', [chain])
					.then((result) => {
						console.log('result:', result)
						this.showNetworkModal = false
					})
					.catch((error) => {
						console.log('error:', error)
					})
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.network-metamask-warning {
	font-size: 12px;
}

.disabled {
	background: #dddddd;
}
.top-navbar {
	top: 0px;
	height: 5.2rem;
	background: transparent !important;
	&.divider {
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			height: 1px;
			width: 100%;
			background: rgba(255, 255, 255, 0.1);
		}
	}
}
.navbar-wrapper {
	margin-left: -15px;
}
.navbar-toggle {
	.navbar-toggler-bar {
		height: 3px;
		&.bar1 {
			top: 11px;
			width: 12px;
			margin-left: auto;
		}
		&.bar2 {
			margin-top: 4px;
			width: 18px;
			margin-left: auto;
		}
		&.bar3 {
			margin-top: 4px;
			width: 22px;
			margin-left: auto;
		}
	}
	&.toggled {
		.bar1 {
			width: 22px;
			margin-left: auto;
			top: 8px;
		}
		.bar3 {
			margin-top: 7px;
			width: 22px;
			margin-left: auto;
		}
	}
}

.toggle-network-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 120px;
	height: 20px;
}

.toggle-network-btn:hover {
	border-color: #f338c3;
}

.connect-btn {
	padding: 12px 40px;
	background: rgb(240, 74, 39);
	background: linear-gradient(
		90deg,
		rgba(240, 74, 39, 1) 0%,
		rgba(246, 116, 64, 1) 50%,
		rgba(236, 68, 34, 1) 100%
	);
	box-shadow: none;
	border-width: 1px;
	border: none;
	&_white {
		border: 1px solid #ffffff;
	}
}
.nav_bg {
	background: url('/s3/img/backgrounds/nav_bg-2.png') no-repeat left bottom !important;
	background-size: cover !important;
}

@media screen and (min-width: 1200px) {
	.active-bar {
		width: calc(100% - 264px) !important;
	}
	.inactive-bar {
		width: calc(100% - 80px) !important;
	}
}
</style>

<style lang="scss">
@media screen and (max-width: 991.98px) {
	.navbar-collapse {
		background: #000a35;
		width: 100%;
		position: absolute;
		left: 0;
		top: 5.2rem;
		width: 100%;
		ul {
			padding: 0 40px;
			margin-top: 50px;
		}
	}
}
.network_btn {
	border: none;
}
.network_btn:focus {
	outline: none;
}
.btn-active:hover {
	--tw-bg-opacity: 1 !important;
	background-color: rgba(46, 51, 72, var(--tw-bg-opacity)) !important;
}

.rounded-md {
	border-radius: 0.375rem !important;
}
.w-8 {
	width: 2rem !important;
}
.h-8 {
	height: 2rem !important;
}
.overflow-y-auto {
	overflow-y: auto !important;
}
.flex-col {
	flex-direction: column !important;
}
.space-y-5 > :not([hidden]) ~ :not([hidden]) {
	--tw-space-y-reverse: 0 !important;
	margin-top: calc(1.25rem * calc(1 - var(--tw-space-y-reverse))) !important;
	margin-bottom: calc(1.25rem * var(--tw-space-y-reverse)) !important;
}
.p-75 {
	padding: 0.75rem !important;
}
.rounded {
	border-radius: 0.625rem !important;
}
.items-center {
	align-items: center !important;
}
.text-primary {
	--tw-text-opacity: 1 !important;
	color: rgba(191, 191, 191, var(--tw-text-opacity)) !important;
}
.font-bold {
	font-weight: 700 !important;
}
.bg-dark-800 {
	--tw-bg-opacity: 1 !important;
	background-color: rgba(32, 34, 49, var(--tw-bg-opacity)) !important;
	border-inline-color: black;
}
.btn-disabled {
	background-color: #050f39;
}
.disabled {
	background-color: rgba(59, 130, 246, 0.5);
}
.mb-6 {
	margin-bottom: 1.5rem !important;
}
.text-lg {
	font-size: 1.125rem !important;
	line-height: 1.75rem !important;
}
.text-pink {
	--tw-text-opacity: 1 !important;
	color: rgba(243, 56, 195, var(--tw-text-opacity)) !important;
}
.text-blue {
	--tw-text-opacity: 1 !important;
	color: rgba(39, 176, 230, var(--tw-text-opacity)) !important;
}
.relative {
	position: relative !important;
}
.mt-2\.5 {
	margin-top: 0.625rem !important;
}
.text-h5 {
	font-size: 24px !important;
	line-height: 28px !important;
	letter-spacing: -0.01em;
}
.w-5 {
	width: 1.25rem !important;
}
.absolute {
	position: absolute !important;
}
.h-5 {
	height: 1.25rem !important;
}
.border-2 {
	border-width: 2px !important;
}
.rounded-full {
	border-radius: 9999px !important;
}
.border-primary {
	--tw-border-opacity: 1 !important;
	border-color: rgba(191, 191, 191, var(--tw-border-opacity)) !important;
}
.stroke-1 {
	stroke-width: 1 !important;
}
.stroke-current {
	stroke: currentColor !important;
}
img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
	vertical-align: middle;
	display: flex;
}
.p-px {
	padding: 1px !important;
}
.to-pink {
	--tw-gradient-to: #f338c3 !important;
}
.from-blue {
	--tw-gradient-from: #ec4422 !important;
	--tw-gradient-stops: var(--tw-gradient-from),
		var(--tw-gradient-to, rgba(39, 176, 230, 0)) !important;
}
.bg-gradient-to-r {
	background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important;
}
.h-full {
	height: 100% !important;
}
.p-6 {
	padding: 1.5rem !important;
}
.bg-dark-900 {
	max-height: 89vh;
	--tw-bg-opacity: 1 !important;
	background-color: #050f39 !important;
}
</style>
