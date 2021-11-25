<template>
	<card class="pt-2 pb-4 mb-1 h-100 about-project">
		<div ref="card" class="d-flex flex-column">
			<div
				v-if="cardWidth > 550"
				class="
					d-flex
					flex-column flex-sm-row
					justify-content-between
					align-items-start
				"
			>
				<div class="d-flex align-items-center">
					<div class="token-img mr-2">
						<img :src="computedTokenImg" class="img-fluid" />
					</div>
					<div class="d-flex flex-column" :class="{ 'pl-4': checkImage }">
						<div class="d-flex align-items-center">
							<h4 class="card-title font-weight-bold text-capitalize fs-5 mb-1">
								{{ textCheck(title, 'title') }}
							</h4>
							<div class="d-flex flex-column">
								<span
									v-if="
										status.auction !== 'upcoming' && status.auction !== 'finished'
									"
									class="
										fs-2
										font-weight-bold
										text-capitalize text-white
										d-flex
										align-items-center
										pl-2
									"
								>
									<span
										class="radius-full status-indicator mr-2"
										:class="computedStatusColor"
									></span>
									{{ status.auction }}
								</span>
							</div>
							<div
								v-if="isPrivate"
								class="
									d-flex
									special_status
									px-3
									py-2
									mr-2
									text-white
									font-weight-bold
									border-danger
								"
							>
								<img src="@/assets/svg/private.svg" class="mr-2 mb-0" />
								Private
							</div>
						</div>
						<p class="font-weight-bold text-uppercase fs-2 d-flex align-items-center">
							{{ tokenPriceTitle }}
							<span class="text-white ml-2">{{ tokenPrice }}</span>
							<el-tooltip
								:disabled="tokenPriceStatusColor !== 'bg-danger'"
								:content="tokenPriceTooltip"
								:open-delay="200"
								placement="top-start"
								:effect="getTooltipEffect"
							>
								<span
									class="radius-full token-price-status-indicator ml-2"
									:class="tokenPriceStatusColor"
								></span>
							</el-tooltip>
						</p>
					</div>
				</div>
				<div>
					<span
						v-if="status.auction === 'upcoming' || status.auction === 'finished'"
						class="
							fs-3
							font-weight-bold
							text-capitalize text-white
							d-flex
							align-items-center
							pl-2
						"
					>
						<span
							class="radius-full status-indicator mr-2"
							:class="computedStatusColor"
						></span>
						{{ status.auction }}
					</span>
				</div>
				<div
					v-if="status.auction !== 'upcoming' && status.auction !== 'finished'"
					class="duration mt-sm-0 mt-3"
				>
					<div class="bg-primary radius-md">
						<div class="d-flex justify-content-around text-white">
							<div class="d-flex flex-column align-items-center text-uppercase">
								<span class="fs-2 font-weight-bold">
									{{ displayDays }}
								</span>
								<span class="abbr">days</span>
							</div>
							&nbsp;:&nbsp;
							<div class="d-flex flex-column align-items-center text-uppercase">
								<span class="fs-2 font-weight-bold">
									{{ displayHours }}
								</span>
								<span class="abbr">hrs</span>
							</div>
							&nbsp;:&nbsp;
							<div class="d-flex flex-column align-items-center text-uppercase">
								<span class="fs-2 font-weight-bold">
									{{ displayMinutes }}
								</span>
								<span class="abbr">min</span>
							</div>
							&nbsp;:&nbsp;
							<div class="d-flex flex-column align-items-center text-uppercase">
								<span class="fs-2 font-weight-bold">
									{{ displaySeconds }}
								</span>
								<span class="abbr">Sec</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-else>
				<div class="d-flex align-items-center">
					<div class="token-img mr-2">
						<img :src="computedTokenImg" class="img-fluid" />
					</div>
					<div class="d-flex flex-column" :class="{ 'pl-4': checkImage }">
						<div class="d-flex align-items-center">
							<h4 class="card-title font-weight-bold text-capitalize fs-5 mb-1">
								{{ textCheck(title, 'title') }}
							</h4>
						</div>
						<span
							v-if="status.auction !== 'upcoming' && status.auction !== 'finished'"
							class="
								fs-3
								font-weight-bold
								text-capitalize text-white
								d-flex
								align-items-center
								justify-center
							"
						>
							<span
								class="radius-full token-price-status-indicator mr-2"
								:class="computedStatusColor"
							></span>
							{{ status.auction }}

							<div
								v-if="isPrivate"
								class="
									d-flex
									special_status
									px-3
									mr-2
									text-white
									font-weight-bold
									border-danger
								"
							>
								<img src="@/assets/svg/private.svg" class="mr-2 mb-0" />
								Private
							</div>
						</span>
						<span
							v-if="status.auction === 'upcoming' || status.auction === 'finished'"
							class="
								fs-3
								font-weight-bold
								text-capitalize text-white
								d-flex
								align-items-center
								justify-center
							"
						>
							<span
								class="radius-full token-price-status-indicator mr-2"
								:class="computedStatusColor"
							></span>
							{{ status.auction }}

							<div
								v-if="isPrivate"
								class="
									d-flex
									special_status
									px-3
									mr-2
									text-white
									font-weight-bold
									border-danger
								"
							>
								<img src="@/assets/svg/private.svg" class="mr-2 mb-0" />
								Private
							</div>
						</span>

						<p
							class="
								font-weight-bold
								text-uppercase
								fs-1
								d-flex
								align-items-center
								pt-2
							"
						>
							<span
								class="radius-full token-price-status-indicator mr-2"
								:class="tokenPriceStatusColor"
							></span>
							<span class="mr-2">{{ tokenPriceTitle }}</span>
							<span class="text-white">{{ tokenPrice }}</span>
						</p>
					</div>
				</div>

				<div class="align-items-center justify-content-center row pt-3">
					<div
						v-if="status.auction !== 'upcoming' && status.auction !== 'finished'"
						class="d-flex flex-column duration mt-sm-0 mt-3"
					>
						<div class="bg-primary radius-md">
							<div class="d-flex justify-content-around text-white">
								<div class="d-flex flex-column align-items-center text-uppercase">
									<span class="fs-2 font-weight-bold">
										{{ displayDays }}
									</span>
									<span class="abbr">days</span>
								</div>
								&nbsp;:&nbsp;
								<div class="d-flex flex-column align-items-center text-uppercase">
									<span class="fs-2 font-weight-bold">
										{{ displayHours }}
									</span>
									<span class="abbr">hrs</span>
								</div>
								&nbsp;:&nbsp;
								<div class="d-flex flex-column align-items-center text-uppercase">
									<span class="fs-2 font-weight-bold">
										{{ displayMinutes }}
									</span>
									<span class="abbr">min</span>
								</div>
								&nbsp;:&nbsp;
								<div class="d-flex flex-column align-items-center text-uppercase">
									<span class="fs-2 font-weight-bold">
										{{ displaySeconds }}
									</span>
									<span class="abbr">Sec</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<base-divider class="mb-4 mt-2 py-1" />
			<div class="pt-2">
				<!-- Auction Contract -->
				<div class="pt-3 mt-1 pr-5">
					<h5 class="fs-1 font-weight-bold text-uppercase mb-0">CONTRACT:</h5>
					<div class="d-flex align-items-center">
						<a
							class="font-weight-bold text-white text-uppercase fs-3 mb-0"
							:href="`${explorer.root}${explorer.address}${$route.params.address}`"
							target="blank"
						>
							{{ $route.params.address | truncate(6) }}
						</a>
						<div class="copy-box d-flex align-items-center ml-2">
							<div class="copy-box_icon">
								<svg-icon
									class="cursor-pointer"
									icon="copy"
									height="20"
									width="20"
									color="#F46E41"
									:fill="false"
									@click="copyToClipboard($route.params.address)"
								/>
							</div>
							<span class="font-weight-bolder text-white fs-2 pl-1">copy</span>
						</div>
					</div>
				</div>

				<!-- Token Contract -->
				<div class="pt-3 mt-1 pr-5">
					<h5 class="fs-1 font-weight-bold text-uppercase mb-0">TOKEN:</h5>
					<div class="d-flex align-items-center">
						<a
							class="font-weight-bold text-white text-uppercase fs-3 mb-0"
							:href="`${explorer.root}${explorer.address}${tokenInfo.addr}`"
							target="blank"
						>
							{{ tokenInfo.addr | truncate(6) }}
						</a>
						<div class="copy-box d-flex align-items-center ml-2">
							<div class="copy-box_icon">
								<svg-icon
									class="cursor-pointer"
									icon="copy"
									height="20"
									width="20"
									color="#F46E41"
									:fill="false"
									@click="copyToClipboard(tokenInfo.addr)"
								/>
							</div>
							<span class="font-weight-bolder text-white fs-2 pl-1">copy</span>
						</div>
					</div>
				</div>

				<!-- Liquidity pool -->
				<div class="pt-3 mt-1 pr-5">
					<h5 class="fs-1 font-weight-bold text-uppercase mb-0">
						{{ liquidityPoolLabel }}
					</h5>
					<div class="d-flex align-items-center justify-content-between">
						<!-- Launcher Set !-->
						<div
							v-if="liquidityInfo.liquidityStatus > 0"
							class="d-flex align-items-center"
						>
							<a
								class="font-weight-bold text-white text-uppercase fs-3 mb-0"
								:href="
									liquidityInfo.liquidityStatus === 2
										? `https://analytics.sushi.com/pairs/${liquidityInfo.lpTokenAddress}`
										: `${explorer.root}${explorer.address}${liquidityInfo.lpTokenAddress}`
								"
								target="blank"
							>
								{{ liquidityInfo.lpTokenAddress | truncate(6) }}
							</a>
							<div class="copy-box d-flex align-items-center ml-2">
								<div class="copy-box_icon">
									<svg-icon
										class="cursor-pointer"
										icon="copy"
										height="20"
										width="20"
										color="#F46E41"
										:fill="false"
										@click="copyToClipboard(liquidityInfo.lpTokenAddress)"
									/>
								</div>
								<span class="font-weight-bolder text-white fs-2 pl-1">copy</span>
							</div>
						</div>
						<!-- Launcher Not Set !-->
						<span
							v-else-if="
								liquidityInfo.liquidityStatus === 0 || !liquidityInfo.isAdmin
							"
							class="font-weight-bold text-white text-uppercase fs-3 mb-0"
						>
							Nothing has been set up yet.
						</span>
						<!-- Launcher Cancelled !-->
						<span v-else class="font-weight-bold text-white text-uppercase fs-3 mb-0">
							It's cancelled.
						</span>
						<!-- Edit Liquidity Pool !-->
						<div
							v-if="liquidityInfo.isAdmin && liquidityInfo.liquidityStatus !== 0"
							class="d-flex align-items-center ml-2"
						>
							<nuxt-link :to="`/launcher-admin/${marketInfo.wallet}`">
								Edit Liquidity Pool
							</nuxt-link>
						</div>
						<!-- Set Up Liquidity Pool !-->
						<div
							v-else-if="
								user.isAdmin &&
								liquidityInfo.liquidityStatus === 0 &&
								!marketInfo.finalized
							"
							class="d-flex align-items-center ml-2"
						>
							<nuxt-link :to="`/factory/liquidity?auction=${auctionAddress}`">
								Set Up Liquidity Pool
							</nuxt-link>
						</div>
					</div>
				</div>

				<!-- Auction Detail -->
				<div v-if="info.website && urlCheck" class="pt-3">
					<h5 class="fs-1 font-weight-bold mb-2 text-uppercase">Website:</h5>
					<a
						:href="info.website"
						target="_blank"
						class="font-weight-bold text-white pt-0 mt-0 fs-3"
					>
						<u>{{ info.website }}</u>
					</a>
				</div>
				<div v-if="Object.keys(info.icons.social).length" class="pt-3">
					<div class="d-flex justify-content-between flex-wrap">
						<div class="d-flex flex-column mb-3">
							<h5 class="fs-1 font-weight-bold text-uppercase mb-2">About:</h5>
							<div class="social-sections d-flex flex-wrap">
								<a
									v-for="(item, index) in info.icons.social"
									:key="index"
									:href="item"
									class="
										socials-icon
										svg-color
										pr-4
										fs-3
										font-weight-bold
										text-capitalize
									"
									target="_blank"
								>
									<i :class="icons[index]" class="fs-4" />
									<span>{{ index }}</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="info.description" class="pt-4 pr-5">
				<h5 class="fs-1 mb-1 font-weight-bold text-uppercase">Description:</h5>
				<p class="fs-2">
					<!-- {{ textCheck(info.description, "description") }} -->
					{{ info.description }}
				</p>
			</div>
			<base-divider v-if="!info.description" class="my-4 py-2" />
			<div v-if="info.icons.ingredient.length" class="pt-4 pr-5">
				<div class="d-flex align-items-center justify-content-between">
					<h5 class="fs-1 font-weight-bold text-uppercase">Auction Type:</h5>
					<div v-if="user.isAdmin">
						<nuxt-link class="text-right" :to="`/auction-admin/${auctionAddress}`">
							Edit Auction
						</nuxt-link>
					</div>
				</div>
				<div class="d-flex align-items-center">
					<span class="mr-3">
						<svg-icon
							slot="reference"
							class="mr-2 cursor-pointer"
							:icon="type"
							height="45"
							width="45"
							:original="true"
							:color="computedIconColor"
						/>
					</span>
					<span class="text-capitalize font-weight-bold text-white">
						{{ auctionType }}
					</span>
				</div>
			</div>
		</div>
	</card>
</template>

<script>
import { Card, BaseDivider } from '@/components'
// import { Popover } from "element-ui"
import { theme } from '@/mixins/theme'
import { divNumbers, toPrecision } from '@/util'
import BigNumber from 'bignumber.js'
import { mapGetters } from 'vuex'
import { ZERO_ADDRESS } from '@/constants/networks'

export default {
	components: {
		Card,
		BaseDivider,
	},
	mixins: [theme],
	props: {
		user: {
			type: [Object],
			required: true,
		},
		status: {
			type: [Object, Array],
			required: true,
			description: 'full data for status card',
		},
		info: {
			type: [Object, Array],
			required: true,
			description: 'full data for about card',
		},
		marketInfo: {
			type: [Object, Array],
			required: true,
		},
		tokenInfo: {
			type: [Object, Array],
			required: true,
		},
		liquidityInfo: {
			type: [Object, Array],
			required: true,
		},
		price: {
			type: [String, Number],
			required: true,
			description: 'current price of the auction',
		},
		type: {
			type: String,
			required: true,
			description: 'full data for status card',
		},
	},
	data() {
		return {
			cardWidth: 0,
			displaySeconds: '00',
			displayMinutes: '00',
			displayHours: '00',
			displayDays: '00',
			theme: false,
			auctionAddress: this.$route.params.address,
			hoverIcon: {},
			icons: {
				whitepaper: 'fa fa-file',
				github: 'fab fa-github',
				telegram: 'fab fa-telegram',
				wechat: 'fab fa-weixin',
				discord: 'fab fa-discord',
				medium: 'fab fa-medium',
				reddit: 'fab fa-reddit',
				twitter: 'fab fa-twitter',
				docs: 'fa fa-book',
			},
		}
	},
	computed: {
		...mapGetters({
			explorer: 'ethereum/explorer',
		}),
		seconds: () => 1000,
		minutes() {
			return this.seconds * 60
		},
		hours() {
			return this.minutes * 60
		},
		computedStatusColor() {
			if (this.status.auction === 'live') {
				return 'bg-success'
			} else if (this.status.auction === 'upcoming') {
				return 'bg-info'
			}
			return this.status.auction === 'finished' && this.status.auctionSuccessful
				? 'bg-link'
				: 'bg-danger'
		},
		getTooltipEffect() {
			if (this.mode) {
				return 'light'
			}
			return 'dark'
		},
		days() {
			return this.hours * 24
		},
		getFullTime() {
			return `${this.displayDays} : ${this.displayHours} : ${this.displayMinutes} : ${this.displaySeconds}`
		},
		isPrivate() {
			return (
				this.marketInfo.hasPointList &&
				this.marketInfo.pointListAddress !== ZERO_ADDRESS
			)
		},
		auctionType() {
			if (this.type === 'crowdsale') {
				return 'Crowd Sale'
			}
			return `${this.type} Auction`
		},
		tooltip() {
			if (this.type.toLowerCase() === 'dutch') {
				return 'Dutch Auction'
			} else if (this.type.toLowerCase() === 'batch') {
				return 'Batch Auction'
			}
			return 'Crowdsale'
		},
		checkImage() {
			if (this.info.icon) {
				return this.info.icon.match(/\.(jpeg|jpg|gif|png)$/) != null
			}
			return false
		},
		urlCheck() {
			const pattern = new RegExp(
				'^(https?:\\/\\/)?' + // protocol
					'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
					'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
					'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
					'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
					'(\\#[-a-z\\d_]*)?$',
				'i'
			) // fragment locator

			return !!pattern.test(this.info.website)
		},
		title() {
			return `${this.tokenInfo.name} (${this.tokenInfo.symbol})`
		},
		tokenPriceTitle() {
			if (this.type === 'batch' && parseFloat(this.price) === 0) return 'Token Price:'

			if (this.type === 'dutch' || this.type === 'batch')
				return 'Current Token Price:'

			return 'Token Price:'
		},
		tokenPrice() {
			if (this.type === 'batch' && parseFloat(this.price) === 0)
				return 'Price not determined'

			if (this.type === 'dutch' || this.type === 'batch')
				return `${toPrecision(
					divNumbers(this.marketInfo.commitmentsTotal, this.marketInfo.totalTokens),
					5
				)} ${this.marketInfo.paymentCurrency.symbol}`

			return `${toPrecision(this.marketInfo.currentPrice, 5)} ${
				this.marketInfo.paymentCurrency.symbol
			}`
		},
		tokenPriceStatusColor() {
			if (this.status.auction === 'live') {
				if (this.type === 'dutch') {
					if (
						BigNumber(
							divNumbers(
								this.marketInfo.commitmentsTotal,
								this.marketInfo.totalTokens
							)
						).comparedTo(this.marketInfo.minimumPrice) < 0
					)
						return 'bg-danger'
					return 'bg-success'
				}
				if (this.type === 'batch') {
					if (
						BigNumber(
							divNumbers(
								this.marketInfo.commitmentsTotal,
								this.marketInfo.totalTokens
							)
						).comparedTo(this.marketInfo.minimumCommitmentAmount) < 0
					)
						return 'bg-danger'
					return 'bg-success'
				}
			}
			return 'bg-none'
		},
		tokenPriceTooltip() {
			if (this.type === 'dutch') {
				return 'Auction is only successful if token price goes above reserve price.'
			}
			if (this.type === 'batch') {
				return 'Auction is only successful if token price goes above minimum price.'
			}
			return ''
		},
		computedTokenImg() {
			if (this.info.icon) {
				return this.info.icon
			}
			return require('static/s3/img/token_placeholder.png')
		},
		liquidityPoolLabel() {
			return (
				this.tokenInfo.symbol +
				' - ' +
				this.marketInfo.paymentCurrency.symbol +
				' LIQUIDITY POOL:'
			)
		},
	},
	mounted() {
		this.showCountDown()
		this.onResize()
		window.onresize = () => {
			this.onResize()
		}
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResize)
	},
	methods: {
		onResize() {
			this.cardWidth = this.$refs.card.offsetWidth
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
		textCheck(str, val) {
			const pattern = /^[()\s0-9a-zA-Z.,/$#:&_-]+$/
			if (str.match(pattern)) {
				return str
			} else {
				return `${val} price`
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
		getIconTooltip(val) {
			const name = `${val} Page`
			const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)
			return val === 'whitepaper' ? 'Documentation' : nameCapitalized
		},
	},
}
</script>

<style lang="scss" scoped>
// remove when icon
.social-sections a {
	min-width: 140px;
	margin-bottom: 1rem;
	span {
		text-decoration: underline;
	}
}
.token-img {
	height: 45px;
	width: 45px;
	@media screen and (min-width: 1200px) and (max-width: 1300px) {
		width: 40px;
	}
}
.status-indicator {
	height: 8px;
	width: 8px;
	display: block;
}
.token-price-status-indicator {
	height: 12px;
	width: 12px;
	display: block;
}
.duration {
	min-height: 50px;
	min-width: 152px;
	.bg-primary {
		height: 100%;
		padding: 4px 14px;
		.abbr {
			font-size: 11px;
		}
	}
}

.is-60x60 {
	height: 60px;
	width: 60px;
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
.about-project {
	@media screen and (max-width: 450px) {
		h4 {
			font-size: 16px;
		}
		p {
			font-size: 12px;
		}
	}
	@media screen and (min-width: 1200px) and (max-width: 1362px) {
		h4 {
			font-size: 15px;
		}
	}
}
@media screen and (min-width: 1200px) and (max-width: 1300px) {
	.card-title {
		font-size: 16px !important;
	}
}
@media screen and (min-width: 976px) and (max-width: 1050px) {
	.card-title {
		font-size: 16px !important;
	}
}
</style>

<style>
.el-popover {
	min-width: auto !important;
}
.popper__arrow::after {
	background: transparent !important;
}
</style>
