<template>
	<card v-if="!loading" class="special p-2 card-hight">
		<div @mouseover="cardhover" @mouseout="cardout">
			<div class="d-flex justify-content-end align-items-center">
				<!-- 
					// uncomment then web3 link for img are ready.
					// wrapper to justify-content-between
					<div class="token-img mr-2">
					<img :src="computedTokenImg" class="img-fluid" />
				</div> 
				-->
				<div class="d-flex align-items-center">
					<div
						v-if="status.auction !== 'live' && status.auction !== 'upcoming'"
						class="
							special_status
							px-2
							py-2
							mr-2
							text-white
							font-weight-bold
							text-uppercase
						"
						:class="'border-' + computedStatusColor"
					>
						<svg-icon
							v-if="status.auctionSuccessful"
							icon="check"
							height="20"
							width="20"
							:color="computedIconColor"
						/>
						<svg-icon
							v-else
							icon="cancel"
							height="20"
							width="20"
							:color="computedIconColor"
						/>
					</div>
					<div
						v-if="isPrivate"
						class="
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
					<div
						class="
							special_status
							px-3
							py-2
							text-white
							font-weight-bold
							text-uppercase
						"
						:class="'border-' + computedStatusColor"
					>
						<span class="mr-2" :class="'bg-' + computedStatusColor"></span>
						{{ status.auction }}
					</div>
				</div>
			</div>
			<div class="d-flex flex-column mt-3">
				<div class="text-capitalize fs-5 font-weight-bold text-white">
					{{ checkTitle(about.title) }}
				</div>
				<!-- <div class="fs-2 text-white">This is a first line of a Subtitle</div>
				<div class="fs-2 text-white">Second line of subtitle goes here</div> -->
			</div>
			<base-divider class="mb-4 mt-2 py-1" />
			<div v-if="!isUpcoming">
				<!-- CrowedProgress -->
				<crowd-progress
					v-if="status.type === 'crowdsale'"
					:status="status"
					:token-info="tokenInfo"
					:market-info="marketInfo"
					:progress="crowdProgress"
				/>
				<!-- CrowedProgress -->

				<!-- DutchProgress -->
				<dutch-progress
					v-if="status.type === 'dutch'"
					class="mt-4 mb-3"
					:status="status"
					:progress="dutchProgress"
					:market-info="marketInfo"
				/>
				<!-- DutchProgress -->

				<!-- BatchProgress -->
				<batch-progress
					v-if="status.type === 'batch'"
					class="mt-4"
					:status="status"
					:progress="timeProgress"
					:market-info="marketInfo"
				/>
				<!-- BatchProgress -->
			</div>
			<div v-else class="d-flex flex-column flex-grow-1">
				<div class="text-white text-center">COUNTDOWN</div>
				<div class="text-white font-weight-bold text-center fs-16">
					<span class="upcoming counter-line">{{ getFullTime }}</span>
				</div>
			</div>
			<base-divider
				class="mb-4 mt-2 py-1"
				:style="{ marginTop: status.type !== 'batch' ? '25px !important' : '' }"
			/>
			<!-- <div class="d-flex flex-column">
				<div class="font-weight-bold text-white text-uppercase fs-1">recipe:</div>
				<div class="fs-3 font-weight-bold text-white mt-1">
					{{ about.recipe }}
				</div>
			</div> -->
			<div class="text-white text-uppercase font-weight-bold ingredients mt-5">
				auction type:
			</div>
			<div
				v-if="buybuttonflag && buyhoverflag"
				class="font-weight-bold text-white text-uppercase buy-sake-full py-4"
			>
				buy sake
			</div>
			<div class="d-flex flex-column">
				<div class="font-weight-bold text-white text-uppercase fs-1"></div>
				<div class="d-flex align-items-center mt-3">
					<span class="mr-1">
						<svg-icon
							:icon="status.type"
							height="50"
							width="48"
							:color="computedIconColor"
						/>
					</span>
					<span
						v-if="!buybuttonflag"
						class="text-capitalize font-weight-bold text-white"
					>
						{{ auctionType }}
					</span>
					<div
						v-if="buybuttonflag && !buyhoverflag"
						class="font-weight-bold text-white text-uppercase buy-sake"
					>
						buy sake
					</div>
				</div>
			</div>
			<div
				v-if="liquidityInfo.liquidityStatus === 2"
				class="d-flex mt-4 text-uppercase justify-content-center"
			>
				<base-button
					class="btn btn-lp w-100 text-uppercase"
					@click="goToLiquidityPool($event)"
				>
					Go to liquidity pool
				</base-button>
			</div>
			<div
				v-else-if="liquidityInfo.liquidityStatus === 1"
				class="d-flex mt-4 justify-content-center"
			>
				<span class="text-white text-uppercase font-weight-bold fs-2">
					{{ cardAdsTxt }}
				</span>
			</div>
		</div>
	</card>
</template>

<script>
import { mapGetters } from 'vuex'
import BigNumber from 'bignumber.js'

import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
import {
	getContractInstance as dutchAuctionContract,
	clearingPrice,
} from '@/services/web3/auctions/dutch'
import { getContractInstance as crowdsaleContract } from '@/services/web3/auctions/crowdsale'
import { getContractInstance as batchAuctionContract } from '@/services/web3/auctions/batch'
import { getContractInstance as postAuctionLauncherContract } from '@/services/web3/postAuctionLauncher'
import { makeBatchCall } from '@/services/web3/base'
import { toDecimals, toPrecision, to18Decimals, toNDecimals } from '@/util'
import { ZERO_ADDRESS, NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'

import { Card, BaseDivider } from '@/components'
import { theme } from '@/mixins/theme'
import CrowdProgress from '~/components/Miso/Auctions/Specials/CrowdProgress'
import DutchProgress from '~/components/Miso/Auctions/Specials/DutchIndicator'
import BatchProgress from '~/components/Miso/Auctions/Specials/BatchIndicator '

export default {
	name: 'SpecialCard',
	components: {
		Card,
		BaseDivider,
		CrowdProgress,
		DutchProgress,
		BatchProgress,
	},
	mixins: [theme],
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
		buybuttonflag: {
			type: Boolean,
			default: false,
			required: false,
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
				wallet: '',
			},
			tokenInfo: {
				address: '',
				name: '',
				symbol: '',
			},
			liquidityInfo: {
				liquidityStatus: 0,
				liquidityTemplate: null,
				launcherInfo: null,
				lpTokenAddress: null,
				lpTokenBalance: 0,
				isAdmin: false,
			},
			contractInstance: null,
			loading: true,
			now: new Date(),
			displaySeconds: '00',
			displayMinutes: '00',
			displayHours: '00',
			displayDays: '00',
			buyhoverflag: false,
		}
	},
	computed: {
		...mapGetters({
			nativeCurrency: 'ethereum/nativeCurrency',
			coinbase: 'ethereum/coinbase',
		}),
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
			return (
				this.marketInfo.startTime > currentTimestamp && !this.marketInfo.finalized
			)
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
		cardAdsTxt() {
			return (
				this.liquidityInfo.launcherInfo.liquidityPercent / 100 +
				'% of the raise will be sent to ' +
				this.tokenInfo.symbol +
				'-' +
				this.marketInfo.paymentCurrency.symbol +
				' LIQUIDITY POOL'
			)
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
		cardhover() {
			this.buyhoverflag = true
		},
		cardout() {
			this.buyhoverflag = false
		},
		checkTitle(value) {
			const pattern = /^[()\s0-9a-zA-Z.,/$#:&_-]+$/
			if (value.match(pattern)) {
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
					this.marketInfo.commitmentsTotal,
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

		// Get Auction Template & Liquidity
		async getTemplateId() {
			const methods = [{ methodName: 'marketTemplate' }, { methodName: 'wallet' }]
			const [marketTemplate, wallet] = await makeBatchCall(
				dutchAuctionContract(this.auction),
				methods
			)
			this.marketTemplateId = marketTemplate
			this.marketInfo.wallet = wallet

			// Get Liquidity Template
			try {
				const liquidityMethods = [
					{ methodName: 'liquidityTemplate' },
					{ methodName: 'launcherInfo' },
					{ methodName: 'getLPTokenAddress' },
					{ methodName: 'hasAdminRole', args: [this.coinbase] },
				]
				const [liquidityTemplate, launcherInfo, lpTokenAddress, isAdmin] =
					await makeBatchCall(postAuctionLauncherContract(wallet), liquidityMethods)

				this.liquidityInfo.liquidityTemplate = Number(liquidityTemplate)
				this.liquidityInfo.launcherInfo = launcherInfo
				this.liquidityInfo.lpTokenAddress = lpTokenAddress
				this.liquidityInfo.isAdmin = isAdmin

				// Get LP Balance
				try {
					const method = [
						{
							methodName: 'getLPBalance',
						},
					]
					const [lpTokenBalance] = await makeBatchCall(
						postAuctionLauncherContract(wallet),
						method
					)
					this.liquidityInfo.lpTokenBalance = lpTokenBalance
				} catch (error) {
					this.liquidityInfo.lpTokenBalance = 0
				}

				// Check the Liquidity Status
				if (launcherInfo.launched) {
					if (BigNumber(this.liquidityInfo.lpTokenBalance).isGreaterThan(0)) {
						this.liquidityInfo.liquidityStatus = 2 // Launcher is successfully finalized
					} else {
						this.liquidityInfo.liquidityStatus = -1 // Launcher is cancelled
					}
				} else {
					this.liquidityInfo.liquidityStatus = 1 // Launcher is not finalized yet
				}
			} catch (error) {
				this.liquidityInfo.liquidityStatus = 0 // No Launcher
				this.liquidityInfo.liquidityTemplate = null
				this.liquidityInfo.lpTokenAddress = null
				this.liquidityInfo.lpTokenBalance = 0
				this.liquidityInfo.launcherInfo = null
				this.liquidityInfo.isAdmin = false
			}
		},

		setTokenInfo(tokenInfo) {
			this.tokenInfo = tokenInfo
			this.about.title = `${tokenInfo.name} (${tokenInfo.symbol})`
			this.about.tokenPair = `${tokenInfo.symbol}/${this.marketInfo.paymentCurrency.symbol}`
		},

		goToLiquidityPool(event) {
			if (event) {
				event.preventDefault()
			}

			window
				.open(
					`https://app.sushi.com/add/${
						this.marketInfo.paymentCurrency.addr === NATIVE_CURRENCY_ADDRESS
							? 'ETH'
							: this.marketInfo.paymentCurrency.addr
					}/${this.tokenInfo.addr}`,
					'_blank'
				)
				.focus()
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
</style>
<style>
.btn-lp {
	background: linear-gradient(122.56deg, #f05240 1.52%, #ba23ab 68.03%) !important;
}
</style>
