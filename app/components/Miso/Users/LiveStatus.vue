<template>
	<card class="p1-2 pb-4 project-status h-100">
		<div class="d-flex justify-content-between mt-2 project-status_text">
			<div class="d-flex flex-column">
				<h5 class="fs-1 mb-1 font-weight-bold">STATUS:</h5>
				<div class="d-flex align-items-baseline">
					<p class="fs-3 text-white font-weight-bold text-capitalize live">
						{{ status.auction }}
					</p>
					<span class="status ml-2" :class="[getStatus]"></span>
				</div>
			</div>
			<div
				v-if="status.auction.toLowerCase() !== 'upcoming'"
				class="d-flex flex-column"
			>
				<h5 class="fs-1 mb-1 font-weight-bold text-center">COUNTDOWN:</h5>
				<p class="fs-3 text-white font-weight-bold d-flex status_counter text-center">
					<span
						v-if="
							status.auction.toLowerCase() !== 'finished' &&
							status.auction.toLowerCase() !== 'failed'
						"
						class=""
					>
						{{ getFullTime }}
					</span>
					<span v-else class="">00 : 00 : 00 : 00</span>
				</p>
			</div>
			<div class="d-flex flex-column">
				<h5 class="fs-1 mb-1 font-weight-bold text-center text-uppercase">
					TOKENS left:
				</h5>
				<p class="fs-3 text-white font-weight-bold text-center">{{ limit }}/1000</p>
			</div>
			<div class="d-flex flex-column">
				<h5 class="fs-1 mb-1 font-weight-bold text-right">PARTICIPANTS:</h5>
				<p class="fs-3 text-white font-weight-bold text-right">
					{{ status.participants }}
				</p>
			</div>
		</div>
		<base-divider class="mt-2 py-2" />
		<!-- CrowedProgress -->
		<crowd-progress
			v-if="
				status.type.toLowerCase() === 'crowdsale' &&
				status.auction.toLowerCase() !== 'upcoming'
			"
			class="pt-5"
			:status="auctionStatus"
			:soft="status.capRange[0]"
			:hard="status.capRange[1]"
			:progress="80"
		/>
		<!-- CrowedProgress -->

		<!-- DutchProgress -->
		<dutch-progress
			v-if="
				status.type.toLowerCase() === 'dutch' &&
				status.auction.toLowerCase() !== 'upcoming'
			"
			class="my-5"
			:status="auctionStatus"
			:soft="status.capRange[0]"
			:hard="status.capRange[1]"
			:progress="23"
		/>
		<div
			v-if="status.auction.toLowerCase() === 'upcoming'"
			class="d-flex flex-column flex-grow-1 my-5 py-4"
		>
			<div class="text-white text-center">COUNTDOWN</div>
			<div class="text-white font-weight-bold text-center fs-16">
				<span class="counter-line">{{ getFullTime }}</span>
			</div>
		</div>
		<!-- DutchProgress -->
		<base-divider class="mb-5 pb-2" />
		<!-- slider -->
		<div v-if="!isAuthor" class="row no-gutters">
			<div class="col-xl-6 col-md-6 col-12">
				<div class="d-flex justify-content-between mb-2">
					<div class="font-weight-bold text-uppercase d-flex flex-column">
						<span class="fs-1">0 Eth</span>
						<span class="text-white fs-3">0 sdf</span>
					</div>
					<div class="font-weight-bold text-uppercase d-flex flex-column">
						<span class="fs-1">{{ maxValue }} Eth</span>
						<span class="text-white fs-3">2,472 sdf</span>
					</div>
				</div>
				<div class="position-relative d-flex">
					<div :style="sliderLine">
						<client-only>
							<vue-slider
								v-model="userLimit"
								:max="sliderMax"
								:min="0"
								:interval="0.000001"
								:dot-style="{
									background: '#f46e41',
								}"
								:process-style="{
									background: '#f46e41',
								}"
								tooltip="none"
								class="vue-slider"
							></vue-slider>
						</client-only>
					</div>
					<div :style="emptyLine" :class="[getMode ? 'bg-dark' : 'bg-light']"></div>
				</div>
				<div
					v-if="coinbase"
					class="text-uppercase font-weight-bold fs-1 limit position-relative"
				>
					<div
						class="d-inline position-absolute pt-4 limit_wrapper"
						:style="{ left: limitWidth - 1 + '%' }"
					>
						<span :class="[getMode ? 'bg-dark' : 'bg-light']"></span>
						<div v-if="limitWidth < 57" class="d-flex flex-column">
							<p class="d-block pl-2 text-left m-0 fs-1">wallet max</p>
							<p class="d-block pl-2 text-left m-0 fs-2">40 TOKENS (0.018788 ETH)</p>
						</div>
						<div v-else class="d-flex flex-column right">
							<p class="d-block pl-2 text-left m-0 fs-1">wallet max</p>
							<p class="d-block pl-2 text-left m-0 fs-2">40 TOKENS (0.018788 ETH)</p>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xl-6 col-md-6 col-12">
				<div
					class="
						ml-xl-4 ml-0
						pl-0 pl-xl-3
						invest
						mt-xl-2 mt-5
						pt-4 pt-md-0
						mt-md-0
						pl-md-3
						pt-xl-0
					"
				>
					<base-input
						v-model="selectedTokenQuantity"
						rounded
						:disabled="!coinbase"
						:bg-color="['#20284E', '#D5D6DC']"
						input-classes="is-large font-weight-bolder fs-3 token-input"
					>
						<template #sub-button>
							<button
								:disabled="!coinbase"
								class="btn font-weight-bold text-uppercase fs-2 px-5"
							>
								commit
							</button>
						</template>
					</base-input>
					<div v-if="!coinbase" class="d-flex justify-content-center fs-2">
						<div class="text-white font-weight-bold">
							Wallet not detected.
							<span class="fs-2 text-primary connect-link" @click="connectAccount">
								Connect Wallet.
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="isAuthor" class="row no-gutters">
			<div class="d-flex flex-column flex-grow-1">
				<div class="text-center text-white font-weight-bold fs-5">
					This is your auction
				</div>
				<div class="text-center text-white fs-3">You cannot bid on it</div>
			</div>
		</div>
	</card>
</template>

<script>
import { Card, BaseInput } from '@/components'
import { mapGetters, mapActions } from 'vuex'
import CrowdProgress from '~/components/Miso/Auctions/Details/CrowdProgress'
import DutchProgress from '~/components/Miso/Auctions/Details/DutchProgress'
import BaseDivider from '~/components/BaseDivider.vue'

export default {
	name: 'LiveStatus',
	components: {
		BaseDivider,
		CrowdProgress,
		Card,
		BaseInput,
		DutchProgress,
	},
	props: {
		status: {
			type: [Object, Array, Boolean],
			required: true,
			description: 'full data for status card',
		},
	},
	data() {
		return {
			displaySeconds: '00',
			displayMinutes: '00',
			displayHours: '00',
			displayDays: '00',
			live: true,
			userTokens: 15,
			maxValue: 20,
			limit: null,
			author: false,
		}
	},

	computed: {
		...mapGetters('theme', ['getMode']),
		...mapGetters({
			coinbase: 'ethereum/coinbase',
		}),
		isAuthor() {
			const currentAddress = this.$route.params.address.toLowerCase()
			if (this.coinbase === currentAddress) {
				return true
			}
			return false
		},
		userLimit: {
			get() {
				return this.userTokens
			},
			set(val) {
				this.userTokens = val
			},
		},
		sliderMax() {
			if (this.limit > 0) {
				return this.limit
			}
			return 100
		},
		seconds: () => 1000,
		minutes() {
			return this.seconds * 60
		},
		hours() {
			return this.minutes * 60
		},
		days() {
			return this.hours * 24
		},
		computedIconColor() {
			if (this.getMode) {
				return '#ffffff'
			}
			return 'rgba(255, 255, 255, 0.2)'
		},
		getFullTime() {
			return `${this.displayDays} : ${this.displayHours} : ${this.displayMinutes} : ${this.displaySeconds}`
		},
		limitWidth() {
			return 1 + 5 * this.limit
		},
		selectedTokenQuantity: {
			get() {
				return this.userTokens
			},
			set(val) {
				if (val > this.limit) {
					this.userTokens = this.limit
				} else {
					this.userTokens = val
				}
			},
		},
		sliderLine() {
			return {
				width: this.limitWidth - 1 + '%',
			}
		},
		emptyLine() {
			return {
				height: '1px',
				width: 100 - this.limitWidth + '%',
			}
		},
		getStatus() {
			return {
				'bg-success': this.status.auction.toLowerCase() === 'live',
				'bg-danger':
					this.status.auction.toLowerCase() === 'finished' ||
					this.status.auction.toLowerCase() === 'failed',
				'bg-info': this.status.auction.toLowerCase() === 'upcoming',
			}
		},
		// dummy indicator status
		auctionStatus() {
			if (this.status.auction !== 'finished') {
				return 'live'
			}
			return 'finished'
		},
	},
	created() {
		this.limit = this.userTokens
	},
	mounted() {
		this.showCountDown()
	},
	methods: {
		...mapActions({
			enableAccount: 'ethereum/enableAccount',
		}),
		async connectAccount() {
			const coinbase = await this.enableAccount()
			if (!coinbase) {
				this.$swal.fire({
					icon: 'warning',
					title: `WALLET NOT DETECTED!`,
					html: `<p>Wallet is not detected in your browser, to continue please install Metamask extension for your browser</p> <a v-bind: href="https://metamask.io/" target="_blank">Get MetaMask</a>`,
					buttonsStyling: false,
					showCancelButton: false,
					confirmButtonClass: 'btn btn-primary btn-fill',
					confirmButtonText: `Close`,
				})
			}
		},
		showCountDown() {
			if (this.status.auction === 'finished') return
			const timer = setInterval(() => {
				// Get today's date
				const now = new Date().getTime()
				// Set the date counting down to
				const countDownDate = new Date(this.status.date).getTime()
				// Find the distance between now and the count down time
				const distance = countDownDate - now
				// If the count down is finished, write some text
				if (distance < 0) {
					this.live = false
					clearInterval(timer)
					return
				}
				// Time calculations for days, hours, minutes and seconds
				const days = Math.floor(distance / this.days)
				const hours = Math.floor((distance % this.days) / this.hours)
				const minutes = Math.floor((distance % this.hours) / this.minutes)
				const seconds = Math.floor((distance % this.minutes) / this.seconds)

				// Update display days, hours, minutes and seconds
				this.displaySeconds = seconds < 10 ? '0' + seconds : seconds
				this.displayMinutes = minutes < 10 ? '0' + minutes : minutes
				this.displayHours = hours < 10 ? '0' + hours : hours
				this.displayDays = days < 10 ? '0' + days : days
			}, 1000)
		},
	},
}
</script>

<style lang="scss" scoped>
.status {
	height: 10px;
	width: 10px;
	border-radius: 100%;

	&_counter {
		span {
			max-width: 127px;
			display: inline-block;
			text-align: left;
		}
	}
}
.connect-link {
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
}
@media screen and (max-width: 450px) {
	.live {
		font-size: 13px;
	}
	.status_counter {
		font-size: 13px;
	}
}

.invest {
	@media screen and (min-width: 1200px) and (max-width: 1400px) {
		justify-content: space-around;
		margin-left: 1rem !important;
		padding-left: 0 !important;
	}

	button {
		background: #f46e41 !important;
		border-radius: 34234234px;
		margin: 0;
		height: inherit;
		@media screen and (min-width: 1200px) and (max-width: 1400px) {
			font-size: 14px;
			padding-left: 2rem !important;
			padding-right: 2rem !important;
		}
		@media screen and (max-width: 400px) {
			font-size: 14px;
		}
	}
	span:first-child {
		font-size: 10px;
	}
}
.limit {
	position: relative;
	display: flex;
	align-items: baseline;
	&_wrapper {
		transform: translateX(-50%);
		.right {
			transform: translate(-44%, -31%) !important;
			p {
				text-align: right !important;
			}
		}
		div {
			transform: translate(59%, -31%);
		}
	}
	span {
		position: absolute;
		left: 50%;
		top: 9px;
		width: 2px;
		height: 38px;
	}
	p {
		vertical-align: text-bottom;
		white-space: nowrap;
		min-width: 50px;
		text-align: center;
		transform: translateX(-8%);

		@media screen and (max-width: 450px) {
			font-size: 9px;
		}
	}
	.bg-light {
		background: rgba(0, 10, 53, 0.2) !important;
	}
	.bg-dark {
		background: rgba(255, 255, 255, 0.2) !important;
	}
}
.bg-light {
	background: rgba(0, 10, 53, 0.2) !important;
}
.bg-dark {
	background: rgba(255, 255, 255, 0.2) !important;
}
</style>

<style lang="scss">
.slider.slider-primary .noUi-handle {
	box-shadow: none;
}
.limit-slider .noUi-origin:not(:last-child) {
	display: none;
}

@media screen and (max-width: 500px) {
	.project-status_text {
		h5 {
			font-size: 10px !important;
		}
		p {
			font-size: 12px !important;
		}
	}
}
.counter-line {
	display: inline-block;
	min-width: 315px;
	text-align: left;
}
</style>
