<template>
	<div v-if="!loading" class="row pl-3 card-main">
		<div class="col-lg-5 col-md-5 img-content">
			<img :src="cardImage" class="w-100 h-100 d-block" />
			<nuxt-link :to="`/auctions/${auction}`" tag="div" class="cursor-pointer">
				<div class="portfolio-overlay d-flex">
					<div class="view-auction-overlay">
						<div>View</div>
						<div>Auction</div>
						<div><i class="fas fa-arrow-right"></i></div>
					</div>
				</div>
			</nuxt-link>
		</div>
		<div class="mobile-display">
			<img :src="mobileCardImage" class="mobile-card-image pb-1" />
		</div>
		<div
			class="col-lg-7 col-md-7 col-sm-12 col-xs-12 card-content"
			:class="cardContentBack"
		>
			<div class="text-white d-flex dead-date">
				<div>
					<i class="far fa-calendar"></i>
					<span class="pl-1">{{ deadDate }}</span>
				</div>
				<span class="auction-button d-flex align-items-center">
					<div
						v-if="isPrivate"
						class="
							border-0
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
					<nobr>
						<span>
							<svg-icon
								:icon="status.type"
								width="20"
								height="20"
								:color="computedIconColor"
							/>
							{{ status.type }}
							<span v-if="status.type !== 'crowdsale'">&nbsp;auction</span>
						</span>
					</nobr>
				</span>
			</div>
			<div class="split-line" :class="splitLineBack"></div>
			<div class="d-flex">
				<div class="position-relative logo-image-wrap">
					<img :src="logoImage" class="logo-image" />
				</div>
				<nuxt-link :to="`/auctions/${auction}`" tag="div" class="cursor-pointer">
					<div class="text-white pl-3">
						<div>
							<span v-if="status.auction == 'live'" class="title">
								{{ title }}
								<i class="fas fa-circle color-success"></i>
							</span>
							<span v-else class="title">
								{{ title }}
								<i class="fas fa-circle color-orange"></i>
							</span>
						</div>
						<div class="text-uppercase raise-target">
							{{ raisedTargetLabel }}
							<nobr>
								{{ raiseTargetFrom }}
								<span v-if="status.type !== 'batch'">
									{{ textCheck(marketInfo.paymentCurrency.symbol) }}~
								</span>
								<span v-else>
									{{ textCheck(tokenInfo.symbol) }}
								</span>
							</nobr>
							<nobr>
								{{ raiseTargetTo }}
								<span v-if="status.type !== 'batch'">
									{{ textCheck(marketInfo.paymentCurrency.symbol) }}
								</span>
							</nobr>
						</div>
					</div>
				</nuxt-link>
			</div>
			<div class="split-line" :class="splitLineBack"></div>
			<div class="text-white social-link pb-1">
				<a
					v-if="websiteurl !== ''"
					:href="websiteurl"
					class="text-white"
					target="_blank"
				>
					<i class="fas fa-globe"></i>
					<span class="px-1">{{ websiteURL }}</span>
				</a>
				<a
					v-for="(item, index) in social"
					:key="index"
					:href="item"
					class="text-capitalize text-white"
					target="_blank"
				>
					<nobr>
						<i :class="icons[index]" />
						<span class="pl-1 pr-2">{{ index }}</span>
					</nobr>
				</a>
			</div>
			<div class="split-line" :class="splitLineBack"></div>
			<div class="auction-description text-white">
				{{ description }}
			</div>
			<!-- div v-if="description !== ''" class="read-more text-white pb-2">
				<nuxt-link :to="`/auctions/${auction}`" tag="div" class="cursor-pointer">
					<span class="cursor-pointer">Read More</span>
				</nuxt-link>
			</div -->
			<div v-if="isUpcoming" class="d-flex countdown-area flex-grow-1">
				<div>
					<p class="text-uppercase text-white countdown">Countdown</p>
					<p class="countdown-instance">{{ getFullTime }}</p>
				</div>
				<div class="d-flex">
					<div class="vertical-bar text-white" :class="splitLineBack"></div>
					<div class="view-auction font-weight-bold view-auction-parent">
						<nuxt-link :to="`/auctions/${auction}`" tag="div" class="cursor-pointer">
							<div>View</div>
							<div>Auction</div>
							<div>
								<i class="fas fa-arrow-right"></i>
							</div>
						</nuxt-link>
					</div>
				</div>
			</div>
			<div v-if="status.auction == 'live'" class="d-flex countdown-area flex-grow-1">
				<div class="d-flex">
					<div>
						<p class="text-uppercase text-white countdown">
							Auction Progress&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<span class="add-space">&nbsp;&nbsp;&nbsp;</span>
						</p>
						<div v-if="status.type === 'batch'" class="progress-status">
							<div class="w-100 h-100">
								<span
									class="progress-status_indicator-line d-inline-block"
									:class="[statusLightColor]"
								>
									<span
										class="progress-status_indicator-line_fill"
										:style="{ width: timeProgress + '%' }"
										:class="[statusColor]"
									></span>
								</span>
							</div>
						</div>
						<div v-if="status.type === 'dutch'" class="progress-status">
							<div class="w-100 h-100">
								<span
									class="progress-status_indicator-line d-inline-block"
									:class="[statusLightColor]"
								>
									<span
										class="progress-status_indicator-line_fill"
										:style="{ width: dutchProgress + '%' }"
										:class="[statusColor]"
									></span>
								</span>
							</div>
						</div>
						<div v-if="status.type === 'crowdsale'" class="progress-status">
							<div class="w-100 h-100">
								<span
									class="progress-status_indicator-line d-inline-block"
									:class="[statusLightColor]"
								>
									<span
										class="progress-status_indicator-line_fill"
										:style="{ width: crowdProgress + '%' }"
										:class="[statusColor]"
									></span>
								</span>
							</div>
						</div>
						<p class="text-white font-weight-bold raised">
							<span v-if="status.type === 'crowdsale'">
								{{ totalCommitments }}
								{{ textCheck(marketInfo.paymentCurrency.symbol) }}
								Raised
							</span>
							<span v-if="status.type === 'batch'">
								{{ totalCommitments }}
								{{ textCheck(marketInfo.paymentCurrency.symbol) }}
								Raised
							</span>
							<span v-if="status.type === 'dutch'">
								{{ totalCommitments }}
								{{ textCheck(marketInfo.paymentCurrency.symbol) }}
								Raised
							</span>
						</p>
						<p class="countdown-instance-live text-white">
							<i class="far fa-clock"></i>
							&nbsp;{{ getFullTime }}
						</p>
					</div>
					<div class="vertical-bar text-white" :class="splitLineBack"></div>
				</div>
				<div class="view-auction-parent d-flex">
					<div class="view-auction font-weight-bold">
						<nuxt-link :to="`/auctions/${auction}`" tag="div" class="cursor-pointer">
							<div>View</div>
							<div>Auction</div>
							<div>
								<i class="fas fa-arrow-right"></i>
							</div>
						</nuxt-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import { Card, BaseDivider } from '@/components'
import { theme } from '@/mixins/theme'

import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
import {
	getContractInstance as dutchAuctionContract,
	clearingPrice,
} from '@/services/web3/auctions/dutch'
import { getContractInstance as crowdsaleContract } from '@/services/web3/auctions/crowdsale'
import { getContractInstance as batchAuctionContract } from '@/services/web3/auctions/batch'
import { makeBatchCall } from '@/services/web3/base'
import { toDecimals, toPrecision, to18Decimals, toNDecimals } from '@/util'
import { mapGetters } from 'vuex'
import { inpidatorTheme } from '@/mixins/auctionIndicator'
import { ZERO_ADDRESS, NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'

// import CrowdProgress from '~/components/Miso/Auctions/Specials/CrowdProgress'
// import DutchProgress from '~/components/Miso/Auctions/Specials/DutchIndicator'
// import BatchProgress from '~/components/Miso/Auctions/Specials/BatchIndicator '

export default {
	name: 'LandingCard',
	components: {
		// Card,
		// BaseDivider,
		// CrowdProgress,
		// DutchProgress,
		// BatchProgress,
	},
	mixins: [theme, inpidatorTheme],
	props: {
		iconLink: {
			type: String,
			default: undefined,
		},
		auction: {
			type: String,
			required: true,
		},
		ingredients: {
			type: Array,
			required: true,
		},
		cardimg: {
			type: String,
			default: undefined,
		},
		mobilecardimg: {
			type: String,
			default: undefined,
		},
		logoimg: {
			type: String,
			default: undefined,
		},
		title: {
			type: String,
			default: undefined,
		},
		description: {
			type: String,
			default: undefined,
		},
		websiteurl: {
			type: String,
			default: undefined,
		},
		social: {
			type: Object,
			default: undefined,
		},
	},
	data() {
		return {
			// can be Object or Array
			about: {
				title: '',
				tokenPair: '',
				recipe: 'Classic Miso',
			},
			status: {
				date: '',
				participants: 0,
				finished: false,
				auctionSuccessful: false,
			},
			marketInfo: {
				startTime: 0,
				endTime: 0,
				currentPrice: 0,
				totalTokensCommitted: 0,
				paymentCurrency: {
					addr: NATIVE_CURRENCY_ADDRESS,
					name: 'ETHEREUM',
					symbol: 'ETH',
					decimals: 18,
				},
				hasPointList: false,
				pointListAddress: '',
				totalTokens: 0,
				commitmentsTotal: 0,
			},
			tokenInfo: {
				address: '',
				name: '',
				symbol: '',
			},
			contractInstance: null,
			loading: true,
			now: new Date(),
			displaySeconds: '00',
			displayMinutes: '00',
			displayHours: '00',
			displayDays: '00',
			raise_target_from: '1,000',
			raise_target_to: '100,000',
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
			mode: 'theme/getMode',
			nativeCurrency: 'ethereum/nativeCurrency',
		}),
		computedDescriptionClass() {
			if (this.mode) {
				return 'auction-description-white'
			}
			return 'auction-description'
		},
		cardContentBack() {
			if (this.mode) {
				return 'card-content-back'
			}
			return 'card-content-back-white'
		},
		splitLineBack() {
			if (this.mode) {
				return 'split-line-back'
			}
			return 'split-line-back-white'
		},
		cardImage() {
			if (this.cardimg && this.cardimg.startsWith('http')) return this.cardimg
			return require('~/assets/images/' + this.cardimg)
		},
		mobileCardImage() {
			if (this.mobilecardimg && this.mobilecardimg.startsWith('http'))
				return this.mobilecardimg
			return require('~/assets/images/' + this.mobilecardimg)
		},
		logoImage() {
			if (this.logoimg && this.logoimg.startsWith('http')) return this.logoimg
			return require('~/assets/images/' + this.logoimg)
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
		auctionType() {
			if (this.status.type === 'crowdsale') {
				return 'Crowdsale'
			}
			return `${this.status.type} Auction`
		},
		computedStatusColor() {
			if (this.status.auction === 'upcoming') {
				return 'info'
			} else if (
				this.status.auction === 'finished' &&
				this.status.auctionSuccessful
			) {
				return 'link'
			} else if (
				this.status.auction === 'finished' &&
				!this.status.auctionSuccessful
			) {
				return 'danger'
			}

			return 'success'
		},
		isUpcoming() {
			const currentTimestamp = Date.parse(new Date()) / 1000
			return this.marketInfo.startTime > currentTimestamp && !this.marketInfo.finished
		},
		isPrivate() {
			return (
				this.marketInfo.hasPointList &&
				this.marketInfo.pointListAddress !== ZERO_ADDRESS
			)
		},
		sliderMax() {
			if (this.limit > 0) {
				return this.limit
			}
			return 100
		},
		dutchProgress() {
			const startPrice = this.marketInfo.startPrice
			const minimumPrice = this.marketInfo.minimumPrice
			const currentPrice = this.marketInfo.currentPrice

			const d1 = startPrice - minimumPrice
			const d2 = Math.max(0, currentPrice - minimumPrice)
			const progress = 100 - (100 * d2) / d1

			return progress
		},
		crowdProgress() {
			const startPrice = 0
			const hard = this.marketInfo.totalTokens / this.marketInfo.rate
			const commitmentsTotal = this.marketInfo.commitmentsTotal

			const d1 = hard - startPrice
			const d2 = Math.max(0, hard - commitmentsTotal)
			const progress = 100 - (100 * d2) / d1

			return progress
		},
		timeProgress() {
			const startTime = new Date(parseInt(this.marketInfo.startTime) * 1000)
			const endTime = new Date(parseInt(this.marketInfo.endTime) * 1000)
			if (endTime <= this.now) return 100
			const d1 = startTime - endTime
			const d2 = this.now - endTime
			const progress = 100 - (100 * d2) / d1

			return progress
		},
		getFullTime() {
			return `${this.displayDays}d : ${this.displayHours}h : ${this.displayMinutes}m : ${this.displaySeconds}s`
		},
		computedTokenImg() {
			if (this.iconLink) {
				return this.iconLink
			}
			return require('static/s3/img/token_placeholder.png')
		},
		totalCommitments() {
			return toPrecision(this.marketInfo.commitmentsTotal, 3)
		},
		deadDate() {
			return new Date(parseInt(this.marketInfo.startTime) * 1000).toUTCString()
		},
		websiteURL() {
			let newurl
			newurl = this.websiteurl.replace('https:', '')
			newurl = newurl.replace('http:', '')
			newurl = newurl.replace('//', '')
			return newurl
		},
		raiseTargetFrom() {
			let ret
			if (this.status.type === 'crowdsale') {
				ret = this.marketInfo.goal
			} else if (this.status.type === 'batch') {
				ret = this.marketInfo.totalTokens
			} else if (this.status.type === 'dutch') {
				ret = this.marketInfo.startPrice
			}
			return ret
		},
		raiseTargetTo() {
			let ret
			if (this.status.type === 'crowdsale') {
				ret = this.marketInfo.totalTokens / this.marketInfo.rate
			} else if (this.status.type === 'batch') {
				ret = ''
			} else if (this.status.type === 'dutch') {
				ret = this.marketInfo.minimumPrice
			}
			return ret
		},
		raisedTargetLabel() {
			let ret
			if (this.status.type === 'crowdsale') {
				ret = 'Raised Target: '
			} else if (this.status.type === 'batch') {
				ret = 'Total: '
			} else if (this.status.type === 'dutch') {
				ret = 'Target: '
			}
			return ret
		},
	},
	async mounted() {
		this.showCountDown()
		await this.getTemplateId()
		let type
		switch (parseInt(this.marketTemplateId)) {
			case 1:
				type = 'crowdsale'
				this.contractInstance = crowdsaleContract(this.auction)
				await this.setCrowdsaleData()
				break
			case 2:
				type = 'dutch'
				this.contractInstance = dutchAuctionContract(this.auction)
				await this.setDutchAuctionData()
				break
			case 3:
				type = 'batch'
				this.contractInstance = batchAuctionContract(this.auction)
				await this.setBatchData()
				break
			case 4:
				type = 'hyperbolic'
				break
			default:
				break
		}

		// PointList
		const pointListMethod = [{ methodName: 'pointList' }]
		const [pointList] = await makeBatchCall(this.contractInstance, pointListMethod)
		this.marketInfo.pointListAddress = pointList

		const currentTimestamp = Date.parse(new Date()) / 1000
		let auction
		if (this.marketInfo.finalized) {
			auction = 'finished'
		} else if (this.marketInfo.startTime > currentTimestamp) {
			auction = 'upcoming'
			this.status.date = new Date(this.marketInfo.startTime * 1000)
		} else if (currentTimestamp < this.marketInfo.endTime) {
			auction = 'live'
			this.status.date = new Date(this.marketInfo.endTime * 1000)
		} else {
			auction = 'finished'
		}
		Object.assign(this.status, { type, auction })
		this.loading = false
	},
	beforeDestroy() {
		clearInterval(this.interval)
	},
	methods: {
		textCheck(str, val) {
			const pattern = /^[()\s0-9a-zA-Z]+$/
			if (str.match(pattern)) {
				return str
			} else {
				return `-`
			}
		},
		checkTitle(value) {
			const specialReg = '^(?=.*[!@#$%^&*"\\[\\]\\{\\}<>/\\=\\\\\\_´+`~\\:;,\\.€\\|])'

			if (!value.match(specialReg)) {
				return value
			} else {
				return (
					this.tokenInfo.addr.substring(0, 6) +
					'...' +
					this.tokenInfo.addr.substring(this.tokenInfo.addr.length - 10)
				)
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

		async setDutchAuctionData() {
			const methods = [{ methodName: 'getDutchAuctionInfo', args: [this.auction] }]
			const [data] = await makeBatchCall(misoHelperContract(), methods)
			const tokenInfo = data.tokenInfo

			if (data.paymentCurrencyInfo.addr === NATIVE_CURRENCY_ADDRESS) {
				this.marketInfo.paymentCurrency = {
					addr: NATIVE_CURRENCY_ADDRESS,
					...this.nativeCurrency,
				}
			} else {
				this.marketInfo.paymentCurrency = data.paymentCurrencyInfo
			}

			this.setTokenInfo(tokenInfo)
			this.marketInfo.startTime = data.startTime
			this.marketInfo.endTime = data.endTime
			this.marketInfo.hasPointList = data.usePointList
			this.marketInfo.startPrice = toDecimals(
				data.startPrice,
				this.marketInfo.paymentCurrency.decimals
			)
			this.marketInfo.minimumPrice = toDecimals(
				data.minimumPrice,
				this.marketInfo.paymentCurrency.decimals
			)
			this.marketInfo.finalized = data.finalized
			this.marketInfo.commitmentsTotal = toPrecision(
				toDecimals(data.commitmentsTotal, this.marketInfo.paymentCurrency.decimals),
				5
			)

			this.marketInfo.totalTokens = toDecimals(data.totalTokens)

			this.status.auctionSuccessful = data.auctionSuccessful
			const currentTimestamp = Date.parse(new Date()) / 1000
			if (data.startTime > currentTimestamp) {
				this.status.date = new Date(data.startTime * 1000)
			} else {
				this.status.date = new Date(data.endTime * 1000)
			}
			const marketInfo = {
				currentTimestamp: Date.parse(new Date()) / 1000,
				startTime: this.marketInfo.startTime,
				endTime: this.marketInfo.endTime,
				startPrice: toNDecimals(
					this.marketInfo.startPrice,
					this.marketInfo.paymentCurrency.decimals
				),
				minimumPrice: toNDecimals(
					this.marketInfo.minimumPrice,
					this.marketInfo.paymentCurrency.decimals
				),
				totalTokens: to18Decimals(this.marketInfo.totalTokens),
				commitmentsTotal: toNDecimals(
					this.commitmentsTotal,
					this.marketInfo.paymentCurrency.decimals
				),
			}
			const price = clearingPrice(marketInfo)
			this.marketInfo.currentPrice = toPrecision(
				toDecimals(price, this.marketInfo.paymentCurrency.decimals),
				5
			)
			const tokensCommitted =
				this.marketInfo.commitmentsTotal / this.marketInfo.currentPrice
			this.marketInfo.totalTokensCommitted = toPrecision(tokensCommitted, 3)
		},

		async setCrowdsaleData() {
			const methods = [{ methodName: 'getCrowdsaleInfo', args: [this.auction] }]
			const [data] = await makeBatchCall(misoHelperContract(), methods)
			const tokenInfo = data.tokenInfo

			if (data.paymentCurrencyInfo.addr === NATIVE_CURRENCY_ADDRESS) {
				this.marketInfo.paymentCurrency = {
					addr: NATIVE_CURRENCY_ADDRESS,
					...this.nativeCurrency,
				}
			} else {
				this.marketInfo.paymentCurrency = data.paymentCurrencyInfo
			}

			this.setTokenInfo(tokenInfo)
			this.marketInfo.startTime = data.startTime
			this.marketInfo.endTime = data.endTime
			this.marketInfo.hasPointList = data.usePointList
			this.marketInfo.rate = toDecimals(
				data.rate,
				this.marketInfo.paymentCurrency.decimals
			)
			this.marketInfo.goal = toDecimals(
				data.goal,
				this.marketInfo.paymentCurrency.decimals
			)
			this.marketInfo.totalTokens = toDecimals(data.totalTokens)
			this.marketInfo.finalized = data.finalized
			this.marketInfo.commitmentsTotal = toPrecision(
				toDecimals(data.commitmentsTotal, this.marketInfo.paymentCurrency.decimals),
				5
			)

			this.status.auctionSuccessful = data.auctionSuccessful
			this.status.totalTokens = toDecimals(data.totalTokens)
			this.marketInfo.currentPrice = toPrecision(
				data.rate / this.status.totalTokens,
				5
			)
			const tokensCommitted = this.marketInfo.commitmentsTotal * this.marketInfo.rate
			this.marketInfo.totalTokensCommitted = tokensCommitted
		},

		async setBatchData() {
			const methods = [{ methodName: 'getBatchAuctionInfo', args: [this.auction] }]
			const [data] = await makeBatchCall(misoHelperContract(), methods)
			const tokenInfo = data.tokenInfo

			if (data.paymentCurrencyInfo.addr === NATIVE_CURRENCY_ADDRESS) {
				this.marketInfo.paymentCurrency = {
					addr: NATIVE_CURRENCY_ADDRESS,
					...this.nativeCurrency,
				}
			} else {
				this.marketInfo.paymentCurrency = data.paymentCurrencyInfo
			}

			this.setTokenInfo(tokenInfo)
			this.marketInfo.startTime = data.startTime
			this.marketInfo.endTime = data.endTime
			this.marketInfo.hasPointList = data.usePointList
			this.marketInfo.totalTokens = toDecimals(data.totalTokens)
			this.marketInfo.finalized = data.finalized
			this.marketInfo.commitmentsTotal = toPrecision(
				toDecimals(data.commitmentsTotal, this.marketInfo.paymentCurrency.decimals),
				5
			)
			this.marketInfo.minimumCommitmentAmount = toDecimals(
				data.minimumCommitmentAmount,
				this.marketInfo.paymentCurrency.decimals
			)

			this.status.auctionSuccessful = data.auctionSuccessful
			this.status.totalTokens = toDecimals(data.totalTokens)
			this.marketInfo.currentPrice = toPrecision(
				this.marketInfo.commitmentsTotal / this.status.totalTokens,
				5
			)
		},

		async getTemplateId() {
			const methods = [{ methodName: 'marketTemplate' }]
			const [marketTemplate] = await makeBatchCall(
				dutchAuctionContract(this.auction),
				methods
			)
			this.marketTemplateId = marketTemplate
		},

		setTokenInfo(tokenInfo) {
			this.tokenInfo = tokenInfo
			this.about.title = `${tokenInfo.name} (${tokenInfo.symbol})`
			this.about.tokenPair = `${tokenInfo.symbol}/${this.marketInfo.paymentCurrency.symbol}`
		},
	},
}
</script>

<style lang="scss" scoped>
.card-hight {
	min-height: 440px;
}
.token-img {
	height: 40px;
	width: 40px;
}
.special {
	&_status {
		border-radius: 8px;
		border-width: 1px;
		border-style: solid;
		display: flex;
		align-items: center;
		span {
			display: block;
			height: 8px;
			width: 8px;
			border-radius: 100%;
		}
	}
}
.counter-line {
	font-size: 28px;
	max-width: 300px;
	@media screen and (min-width: 992px) and (max-width: 1450px) {
		font-size: 22px;
		min-width: 235px;
	}
	@media screen and (max-width: 500px) {
		font-size: 20px;
		min-width: 225px;
	}
}
.buy-sake {
	position: absolute;
	right: 24px;
	bottom: 30px;
	background-image: linear-gradient(
		135deg,
		rgba(245, 62, 46, 1) 36.52%,
		rgba(209, 54, 158, 1) 72.9%
	);
	text-align: center;
	padding: 8px 20px;
	border-radius: 6px;
	font-size: 14px;
}
.buy-sake-full {
	background-image: linear-gradient(
		135deg,
		rgba(245, 62, 46, 1) 36.52%,
		rgba(209, 54, 158, 1) 72.9%
	);
	text-align: center;
	font-size: 14px;
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
	border-radius: 0 0 8px 8px;
}
.ingredients {
	font-size: 10px;
}

.underline-bar {
	height: 5px;
	color: #ffffff;
	opacity: 0.1;
}

.title {
	font-size: 1.75rem;
	@media screen and (min-width: 901px) and (max-width: 1000px) {
		font-size: 1.5rem;
	}
	@media screen and (min-width: 801px) and (max-width: 900px) {
		font-size: 1.25rem;
	}
	@media screen and (min-width: 768px) and (max-width: 800px) {
		font-size: 1.1rem;
	}
	@media screen and (min-width: 401px) and (max-width: 575px) {
		font-size: 1.5rem;
	}
	@media screen and (min-width: 361px) and (max-width: 399px) {
		font-size: 1.2rem;
	}
	@media screen and (max-width: 360px) {
		font-size: 1.1rem;
	}
}

.auction-button {
	position: absolute;
	right: 1rem;
	top: -0.5rem;
	text-transform: capitalize;
	@media screen and (min-width: 788px) and (max-width: 900px) {
		top: -0.25rem;
	}
	@media screen and (min-width: 768px) and (max-width: 787px) {
		top: -0.3rem;
	}
	@media screen and (max-width: 360px) {
		top: 0.8rem;
	}
}

.text-black {
	color: black;
}

.raise-target {
	font-size: 0.75rem;
	@media screen and (min-width: 1361px) and (max-width: 1402px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1360px) {
		font-size: 0.65rem;
	}
	@media screen and (min-width: 871px) and (max-width: 900px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 821px) and (max-width: 870px) {
		font-size: 0.6rem;
	}
	@media screen and (min-width: 768px) and (max-width: 820px) {
		font-size: 0.5rem;
	}
	@media screen and (min-width: 351px) and (max-width: 425px) {
		font-size: 0.65rem;
	}
	@media screen and (max-width: 350px) {
		font-size: 0.45rem;
	}
}

.split-line {
	height: 2px;
	opacity: 0.4;
	margin: 1rem 0;
	@media screen and (min-width: 1231px) and (max-width: 1326px) {
		margin: 0.75rem 0;
	}
	@media screen and (min-width: 1200px) and (max-width: 1230px) {
		margin: 0.7rem 0;
	}
	@media screen and (min-width: 951px) and (max-width: 1076px) {
		margin: 0.75rem 0;
	}
	@media screen and (min-width: 905px) and (max-width: 950px) {
		margin: 0.7rem 0;
	}
	@media screen and (min-width: 768px) and (max-width: 904px) {
		margin: 0.6rem 0;
	}
}

.split-line-back {
	background-color: #ffffff;
}

.split-line-back-white {
	background-color: #a0a0a0;
}

.social-link {
	opacity: 0.8;
	font-size: 0.75rem;
	@media screen and (min-width: 1361px) and (max-width: 1402px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1360px) {
		font-size: 0.65rem;
	}
	@media screen and (min-width: 982px) and (max-width: 1030px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 934px) and (max-width: 981px) {
		font-size: 0.65rem;
	}
	@media screen and (min-width: 885px) and (max-width: 933px) {
		font-size: 0.6rem;
	}
	@media screen and (min-width: 788px) and (max-width: 884px) {
		font-size: 0.5rem;
	}
	@media screen and (min-width: 768px) and (max-width: 787px) {
		font-size: 0.4rem;
	}
	@media screen and (min-width: 301px) and (max-width: 359px) {
		font-size: 0.5rem;
	}
	@media screen and (max-width: 300px) {
		font-size: 0.4rem;
	}
}

.countdown {
	opacity: 0.6;
	font-size: 0.9rem;
	@media screen and (min-width: 1231px) and (max-width: 1326px) {
		font-size: 0.8rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1230px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 951px) and (max-width: 1076px) {
		font-size: 0.8rem;
	}
	@media screen and (min-width: 905px) and (max-width: 950px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 878px) and (max-width: 904px) {
		font-size: 0.6rem;
	}
	@media screen and (min-width: 768px) and (max-width: 877px) {
		font-size: 0.5rem;
	}
	@media screen and (max-width: 359px) {
		font-size: 0.7rem;
	}
}

.view-auction-overlay {
	font-size: 1.5rem;
	color: white;
	margin: auto auto;
	text-align: center;
}

.view-auction {
	background-image: linear-gradient(
		to right,
		rgba(245, 62, 46, 1) 36.52%,
		rgba(209, 54, 158, 1) 72.9%
	);
	color: transparent;
	-webkit-background-clip: text;
	background-clip: text;
	font-size: 1rem;
	margin: auto;
	@media screen and (min-width: 1231px) and (max-width: 1326px) {
		font-size: 0.9rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1230px) {
		font-size: 0.8rem;
	}
	@media screen and (min-width: 951px) and (max-width: 1076px) {
		font-size: 0.9rem;
	}
	@media screen and (min-width: 905px) and (max-width: 950px) {
		font-size: 0.8rem;
	}
	@media screen and (min-width: 878px) and (max-width: 904px) {
		font-size: 0.75rem;
	}
	@media screen and (min-width: 768px) and (max-width: 877px) {
		font-size: 0.7rem;
	}
	@media screen and (max-width: 359px) {
		font-size: 0.8rem;
	}
}

.countdown-area {
	position: absolute;
	bottom: 0;
	width: 100%;
	padding-right: 3rem;
	@media screen and (max-width: 767px) {
		position: relative;
	}
	font-size: 0.9rem;
	@media screen and (min-width: 1231px) and (max-width: 1326px) {
		font-size: 0.8rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1230px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 951px) and (max-width: 1076px) {
		font-size: 0.8rem;
	}
	@media screen and (min-width: 905px) and (max-width: 950px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 878px) and (max-width: 904px) {
		font-size: 0.6rem;
	}
	@media screen and (min-width: 768px) and (max-width: 877px) {
		font-size: 0.5rem;
	}
	@media screen and (min-width: 360px) and (max-width: 414px) {
		font-size: 0.7rem;
	}
	@media screen and (max-width: 359px) {
		font-size: 0.5rem;
	}
}

.title-area {
	position: absolute;
	right: 1rem;
}

.countdown-instance {
	background-color: #f8856a;
	border-radius: 0.5rem;
	padding: 0.5rem 0.5rem;
	color: #ffffff;
	min-width: 10.5rem;
	@media screen and (min-width: 1231px) and (max-width: 1326px) {
		min-width: 9.5rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1230px) {
		min-width: 8.5rem;
	}
	@media screen and (min-width: 951px) and (max-width: 1076px) {
		min-width: 9.5rem;
	}
	@media screen and (min-width: 905px) and (max-width: 950px) {
		min-width: 8.5rem;
	}
	@media screen and (min-width: 878px) and (max-width: 904px) {
		min-width: 7.5rem;
	}
	@media screen and (min-width: 768px) and (max-width: 877px) {
		min-width: 6.5rem;
	}
	@media screen and (min-width: 360px) and (max-width: 414px) {
		min-width: 8.2rem;
	}
	@media screen and (max-width: 359px) {
		min-width: 6.2rem;
	}
}

.vertical-bar {
	width: 2px;
	opacity: 0.2;
	margin-left: 1.5rem;
}

.view-auction-parent {
	margin-left: 1.25rem;
}

.countdown-instance-live {
	font-size: 0.5rem;
}

.progress-status {
	position: relative;
	&_indicator-line {
		height: 10px;
		border-radius: 4px;
		width: 101%;
		transform: translate(-0.5%, 0%);
		&_fill {
			position: absolute;
			height: 10px;
			border-radius: 4px;
			left: 0;
		}
	}
}

.dead-date {
	font-size: 0.75rem;
	@media screen and (min-width: 1361px) and (max-width: 1402px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1360px) {
		font-size: 0.65rem;
	}
	@media screen and (min-width: 982px) and (max-width: 1030px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 934px) and (max-width: 981px) {
		font-size: 0.65rem;
	}
	@media screen and (min-width: 885px) and (max-width: 933px) {
		font-size: 0.6rem;
	}
	@media screen and (min-width: 788px) and (max-width: 884px) {
		font-size: 0.5rem;
	}
	@media screen and (min-width: 768px) and (max-width: 787px) {
		font-size: 0.4rem;
	}
	@media screen and (min-width: 311px) and (max-width: 420px) {
		font-size: 0.6rem;
	}
	@media screen and (min-width: 321px) and (max-width: 359px) {
		font-size: 0.5rem;
	}
	@media screen and (max-width: 320px) {
		font-size: 0.35rem;
	}
}

.auction-description-white {
	background-image: linear-gradient(
		to bottom,
		rgba(255, 255, 255, 1) 40%,
		rgba(255, 255, 255, 0.2) 80%
	);
	color: transparent;
	-webkit-background-clip: text;
	background-clip: text;
	font-size: 1rem;
}

.auction-description {
	font-size: 1.1rem;
	@media screen and (min-width: 1327px) and (max-width: 1440px) {
		font-size: 0.95rem;
	}
	@media screen and (min-width: 1241px) and (max-width: 1326px) {
		font-size: 0.75rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1240px) {
		font-size: 0.65rem;
	}
	@media screen and (min-width: 951px) and (max-width: 1199px) {
		font-size: 0.75rem;
	}
	@media screen and (min-width: 905px) and (max-width: 950px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 811px) and (max-width: 904px) {
		font-size: 0.6rem;
	}
	@media screen and (min-width: 768px) and (max-width: 810px) {
		font-size: 0.5rem;
	}
	@media screen and (max-width: 767px) {
		font-size: 1rem;
	}
}

.read-more {
	text-decoration: underline;
	font-size: 1.25rem;
	@media screen and (min-width: 1327px) and (max-width: 1440px) {
		font-size: 0.95rem;
	}
	@media screen and (min-width: 1231px) and (max-width: 1326px) {
		font-size: 0.75rem;
	}
	@media screen and (min-width: 1200px) and (max-width: 1230px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 951px) and (max-width: 1199px) {
		font-size: 0.75rem;
	}
	@media screen and (min-width: 905px) and (max-width: 950px) {
		font-size: 0.7rem;
	}
	@media screen and (min-width: 811px) and (max-width: 904px) {
		font-size: 0.6rem;
	}
	@media screen and (min-width: 768px) and (max-width: 810px) {
		font-size: 0.5rem;
	}
	@media screen and (max-width: 767px) {
		font-size: 1rem;
	}
}

.img-content {
	position: relative;
	padding-left: 0;
	padding-right: 0;
	display: inline;

	.portfolio-overlay {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		border-radius: 6px;
		cursor: pointer;
		background-image: linear-gradient(
			135deg,
			rgba(245, 62, 46, 1) 36.52%,
			rgba(209, 54, 158, 1) 72.9%
		);
		opacity: 0;
		transition: all 0.3s ease;
	}

	&:hover {
		.portfolio-overlay {
			opacity: 0.8;
		}
	}

	@media screen and (max-width: 767px) {
		display: none;
	}
}

.green-circle {
	border-radius: 1rem;
	width: 1rem;
	height: 1rem;
	position: absolute;
	right: -0.5rem;
	top: -0.5rem;
}

.logo-image {
	min-width: 5rem;
	max-width: 5rem;
}

.raised {
	font-size: 0.9rem;
}

.card-content {
	padding-left: 2rem;
	@media screen and (max-width: 767px) {
		padding: 1rem;
		margin-right: 1rem;
		border-radius: 6px;
	}
}

.card-content-back1 {
	@media screen and (max-width: 767px) {
		background-color: #262f53;
	}
}

.card-content-back-white1 {
	@media screen and (max-width: 767px) {
		background-color: #f3f3f3;
	}
}

.add-space {
	@media screen and (max-width: 375px) {
		display: none;
	}
}

.card-main {
	@media screen and (min-width: 576px) and (max-width: 767px) {
		padding-right: 1rem;
	}
}

.logo-image-wrap {
	margin-top: auto;
	margin-bottom: auto;
}

.mobile-display {
	display: none;
	@media screen and (max-width: 767px) {
		display: inline;
	}
}

.mobile-card-image {
	width: 100%;
	padding: 1rem;
}

.color-success {
	color: #95ce22 !important;
	font-size: 12px;
	vertical-align: middle;
}

.color-orange {
	color: #ffa500 !important;
	font-size: 12px;
	vertical-align: middle;
}
</style>
