<template>
	<div class="position-relative h-100">
		<card class="p1-2 project-status h-100">
			<div v-if="!finalize.author">
				<div
					class="
						d-flex
						flex-sm-row flex-row
						justify-content-between
						mt-2
						project-status_text
						flex-wrap
						options-wrapper
					"
				>
					<div class="d-flex flex-column failed-options">
						<span
							class="
								fs-1
								mb-1
								text-uppercase
								font-weight-bold
								text-center text-sm-left
							"
						>
							Amount For Sale:
						</span>
						<div class="d-flex justify-content-center justify-content-sm-start">
							<p class="fs-3 text-white font-weight-bold text-capitalize live">
								{{ marketInfo.totalTokens }}
								<span class="fs-2">{{ textCheck(tokenInfo.symbol) }}</span>
							</p>
						</div>
					</div>
					<div class="d-flex flex-column failed-options">
						<span class="fs-1 mb-1 text-center text-uppercase font-weight-bold">
							amount raised:
						</span>
						<p class="fs-3 text-white font-weight-bold text-center">
							{{ totalCommitments }}
							{{ textCheck(marketInfo.paymentCurrency.symbol) }}
						</p>
					</div>
					<div class="d-flex flex-column failed-options">
						<span class="fs-1 mb-1 text-center text-uppercase font-weight-bold">
							Remaining:
						</span>
						<p class="fs-3 text-white font-weight-bold text-center">
							{{ percentRemaining }} %
						</p>
					</div>
					<div class="d-flex flex-column failed-options">
						<span
							class="
								fs-1
								mb-1
								text-sm-right text-center text-uppercase
								font-weight-bold
							"
						>
							Participants:
						</span>
						<p class="fs-3 text-white font-weight-bold text-sm-right text-center">
							{{ totalParticipants }}
						</p>
					</div>
				</div>
				<base-divider class="mt-2 py-2" />
				<div
					v-if="!isUpcoming && status.auction !== 'finished' && !marketInfo.finalized"
				>
					<!-- CrowedProgress -->
					<crowd-progress
						v-if="status.type === 'crowdsale'"
						class="pt-5"
						:status="status"
						:token-info="tokenInfo"
						:market-info="marketInfo"
						:user-info="userInfo"
						:progress="crowdProgress"
						:finalize="finalize.user"
					/>
					<!-- CrowedProgress -->
					<!-- DutchProgress -->
					<dutch-progress
						v-if="status.type === 'dutch'"
						class="my-5"
						:status="status"
						:market-info="marketInfo"
						:user-info="userInfo"
						:progress="dutchProgress"
						:finalize="finalize.user"
					/>
					<!-- DutchProgress -->
					<!-- BatchProgress -->
					<batch-progress
						v-if="status.type === 'batch'"
						class="my-5"
						:status="status"
						:market-info="marketInfo"
						:user-info="userInfo"
						:progress="timeProgress"
						:finalize="finalize.user"
					/>
					<!-- BatchProgress -->
				</div>

				<div v-else-if="!isUpcoming || marketInfo.finalized" class="d-flex">
					<div v-if="status.auctionSuccessful" class="finalized-box">
						<video
							v-if="mode"
							class="finalized-video"
							autoplay
							poster="~/assets/video/covers/dark_mode_bg.jpg"
						>
							<source src="~/assets/video/dark_mode.webm" type="video/webm" />
							<source src="~/assets/video/dark_mode.mp4" type="video/mp4" />
						</video>
						<video
							v-else
							class="finalized-video"
							autoplay
							poster="~/assets/video/covers/light_mode_bg.jpg"
						>
							<source src="~/assets/video/light_mode.webm" type="video/webm" />
							<source src="~/assets/video/light_mode.mp4" type="video/mp4" />
						</video>
					</div>
				</div>
				<div v-else class="d-flex flex-column flex-grow-1 my-5 py-4 upcoming-counter">
					<div v-show="upcomingVideo" :class="{ 'd-flex': upcomingVideo }">
						<video v-if="mode" autoplay class="finalized-video">
							<source
								src="~/assets/video/dark_mode-upcoming.webm"
								type="video/webm"
							/>
							<source src="~/assets/video/dark_mode-upcoming.mp4" type="video/mp4" />
						</video>
						<video v-else class="finalized-video" autoplay>
							<source
								src="~/assets/video/light_mode_upcoming.webm"
								type="video/webm"
							/>
							<source src="~/assets/video/light_mode_upcoming.mp4" type="video/mp4" />
						</video>
					</div>
					<div
						v-show="!upcomingVideo"
						:class="{ 'd-flex flex-column': !upcomingVideo }"
					>
						<div class="text-white text-center">COUNTDOWN</div>
						<div class="text-white font-weight-bold text-center fs-14">
							<span class="counter-line">{{ getFullTime }}</span>
						</div>
					</div>
				</div>
				<!-- DutchProgress -->
				<base-divider
					v-if="getStatus && status.auction !== 'upcoming'"
					class="mb-5 pb-2"
				/>
				<!-- active auction -->
				<div
					v-if="getStatus && status.auction !== 'upcoming' && !marketInfo.finalized"
					class="row no-gutters"
				>
					<div class="col-12">
						<div class="d-flex justify-content-between mb-2">
							<template v-if="status.type === 'batch'">
								<div class="font-weight-bold text-uppercase d-flex flex-column">
									<span class="fs-1">Amount</span>
									<span class="text-white fs-3">
										{{ userTokens }}
										{{ textCheck(marketInfo.paymentCurrency.symbol) }}
									</span>
								</div>
								<div class="font-weight-bold text-uppercase d-flex flex-column">
									<span class="fs-1 text-right">Balance</span>
									<span class="text-white text-right fs-3">
										{{ accountBalance }} {{ marketInfo.paymentCurrency.symbol }}
									</span>
								</div>
							</template>
							<template v-else>
								<div class="font-weight-bold text-uppercase d-flex flex-column">
									<span class="fs-1">Minimum token Amount</span>
									<span class="text-white fs-3">
										{{ tokenAmount }} {{ textCheck(tokenInfo.symbol) }}
									</span>
								</div>
								<div class="font-weight-bold text-uppercase d-flex flex-column">
									<span class="fs-1 text-right">MAX Available</span>
									<span class="text-white text-right fs-3">
										{{ maxTokenAmount }} {{ textCheck(tokenInfo.symbol) }}
									</span>
								</div>
							</template>
						</div>
						<div class="position-relative d-flex">
							<div class="w-100">
								<client-only>
									<vue-slider
										v-model="userLimit"
										:max="maxInvestAmount"
										:min="0"
										:interval="0.00000000001"
										:clickable="maxInvestAmount > 0"
										:disabled="maxInvestAmount <= 0"
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
						</div>
						<div
							v-if="marketInfo.hasPointList"
							class="text-uppercase font-weight-bold fs-1 limit position-relative"
						>
							<div class="d-inline position-absolute pt-4 limit_wrapper w-100">
								<span :class="[mode ? 'bg-dark' : 'bg-light']"></span>

								<div class="d-flex flex-column right">
									<p class="d-block pl-2 text-left m-0 fs-1">wallet max</p>
								</div>
							</div>
						</div>
					</div>
					<div v-if="status.type !== 'batch'" class="col-12 mt-4">
						<base-input
							v-model="tokenAmount"
							type="number"
							step="0.1"
							name="input"
							:bg-color="['#20284E', '#D5D6DC']"
							input-classes="is-small invest-input font-weight-bolder"
							sixe="md"
							rounded
							:clickable="maxTokenAmount > 0"
							:disabled="maxTokenAmount <= 0"
							:rules="`required|decimal|max_value:${maxTokenAmount}`"
						/>
					</div>
					<div class="col-12 mt-4 mb-3">
						<div class="font-weight-bold text-uppercase text-white fs-4">
							commitment
						</div>
						<span v-if="status.type === 'dutch'" class="fs-2">
							Your commitment is for the minimum amount of tokens. As the auction
							price drops, your commitment will entile you to claim even more tokens
							at the end. Final price per token is determined at the end of the
							auction. Everyone who commits before the end of a successful auction,
							claims tokens at same final price.
						</span>
					</div>
					<div class="col-12">
						<div class="invest">
							<base-input
								v-model="selectedTokenQuantity"
								rounded
								type="number"
								step="0.1"
								name="input"
								:bg-color="['#20284E', '#D5D6DC']"
								input-classes="is-small invest-input font-weight-bolder"
								:class="responsiveClass"
							>
								<template #custom>
									<span class="position-absolute symbol_wrapper">
										<span
											class="
												d-flex
												align-items-center
												font-weight-bold
												text-white
												fs-2
											"
										>
											<span class="pr-3 amount">{{ selectedTokenQuantity }}</span>
											<span class="token">
												{{ marketInfo.paymentCurrency.symbol }}
											</span>
										</span>
									</span>
								</template>
								<template #sub-button>
									<div class="h-100 invest-bg d-sm-block d-none">
										<base-button
											v-if="isApproved"
											:round="true"
											class="btn font-weight-bold text-uppercase fs-2 px-5"
											:disabled="
												selectedTokenQuantity === 'NaN' ||
												selectedTokenQuantity <= 0 ||
												isUpcoming ||
												isBadAuction
											"
											:loading="loading"
											@click="invest"
										>
											commit
										</base-button>
										<base-button
											v-else
											:round="true"
											class="btn font-weight-bold text-uppercase fs-2 px-5"
											:disabled="
												selectedTokenQuantity <= 0 || isUpcoming || isBadAuction
											"
											:loading="loading"
											@click="approve"
										>
											approve
										</base-button>
									</div>
								</template>
							</base-input>
						</div>
						<div v-if="isUpcoming" class="font-weight-bold text-center fs-1">
							You can participate as soon as the auction is LIVE.
						</div>
					</div>
					<div class="col-12 mt-4">
						<div class="h-100 invest d-sm-none d-block">
							<base-button
								v-if="isApproved"
								:round="true"
								class="btn w-100 font-weight-bold text-uppercase fs-2 px-5"
								:disabled="selectedTokenQuantity <= 0 || isUpcoming"
								:loading="loading"
								@click="invest"
							>
								Commit {{ marketInfo.paymentCurrency.symbol }}
							</base-button>
							<base-button
								v-else
								:round="true"
								class="btn w-100 font-weight-bold text-uppercase fs-2 px-5"
								:disabled="selectedTokenQuantity <= 0 || isUpcoming"
								:loading="loading"
								@click="approve"
							>
								Approve {{ marketInfo.paymentCurrency.symbol }}
							</base-button>
						</div>
					</div>
				</div>
				<!-- if auction is finished -->
				<div
					v-else-if="status.auction === 'finished' || marketInfo.finalized"
					class="row no-gutters"
				>
					<div class="d-flex flex-column flex-grow-1">
						<!-- auction successed !-->
						<div v-if="status.auctionSuccessful">
							<!-- not finalized -->
							<div v-if="!marketInfo.finalized">
								<!-- admin privileges -->
								<div v-if="canFinalize">
									<div class="text-center text-white font-weight-bold fs-5">
										Congratulations!
									</div>
									<div class="text-center fs-3 mt-2 mb-4">
										Your auction was successful
									</div>
									<div class="withdraw d-flex justify-content-center">
										<base-button
											class="
												btn
												finalize
												bg-orange
												text-uppercase text-white
												font-weight-bold
												cursor-pointer
											"
											:loading="loading"
											@click="finalizeAuction"
										>
											finalize
										</base-button>
									</div>
								</div>
								<!-- default !-->
								<div v-else>
									<div class="font-weight-bold text-white fs-4 text-center">
										Auction Finished Successfully
									</div>
									<div class="font-weight-bold text-center mb-4">
										{{ claimTokenText }}
									</div>
								</div>
							</div>
							<!-- finalized !-->
							<div v-else>
								<div class="font-weight-bold text-white fs-4 text-center">
									Auction Finished Successfully
								</div>
								<div class="mb-4">
									<!-- claim -->
									<div class="font-weight-bold text-center">
										{{ claimTokenText }}
									</div>
									<!-- withdraw LP -->
									<div v-if="canWithdrawLP" class="font-weight-bold text-center">
										{{ launcherLPBalanceText }}
									</div>
								</div>
								<div class="withdraw d-flex justify-content-center">
									<!-- claim -->
									<base-button
										v-if="!isClaimed"
										class="
											btn
											finalize
											bg-orange
											text-uppercase text-white
											font-weight-bold
											cursor-pointer
											mr-3
										"
										:disabled="!canClaim"
										:loading="loading"
										@click="withdraw"
									>
										Claim
									</base-button>
									<!-- withdraw LP -->
									<base-button
										v-if="canWithdrawLP"
										class="
											btn
											finalize
											bg-orange
											text-uppercase text-white
											font-weight-bold
											cursor-pointer
										"
										:disabled="!withdrawLPUnlocked"
										:loading="waitingForWithdrawLP"
										@click="withdrawLP"
									>
										Withdraw LP
									</base-button>
								</div>
							</div>
						</div>
						<!-- action failed -->
						<div v-else class="center-status">
							<div class="font-weight-bold text-white fs-4 text-center mb-2">
								Auction Failed to Reach a Target
							</div>
							<!-- finalized !-->
							<div v-if="marketInfo.finalized">
								<div class="font-weight-bold text-center mb-4">
									You are able to withdraw {{ userCommitments }}
									{{ marketInfo.paymentCurrency.symbol }} now
								</div>
								<div class="withdraw d-flex justify-content-center">
									<base-button
										class="
											btn
											finalize
											bg-orange
											text-uppercase text-white
											font-weight-bold
											cursor-pointer
										"
										:loading="loading"
										:disabled="!canWithdraw"
										@click="withdraw"
									>
										Withdraw
									</base-button>
								</div>
							</div>
							<!-- not finalized -->
							<div v-else>
								<!-- admin privileges -->
								<div v-if="canFinalize">
									<div class="withdraw d-flex justify-content-center">
										<base-button
											class="
												btn
												finalize
												bg-orange
												text-uppercase text-white
												font-weight-bold
												cursor-pointer
											"
											:loading="loading"
											@click="finalizeAuction"
										>
											Finalize
										</base-button>
									</div>
								</div>
								<!-- default !-->
								<div v-else class="font-weight-bold text-center mb-4">
									You are able to withdraw {{ userCommitments }}
									{{ marketInfo.paymentCurrency.symbol }} when it is finalized
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</card>
	</div>
</template>

<script>
// import BigNumber from "bignumber.js"
import { mapGetters, mapActions } from 'vuex'
import BigNumber from 'bignumber.js'
import * as moment from 'moment'

import { sendTransactionAndWait, makeBatchCall } from '@/services/web3/base'
import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
import { getContractInstance as getAuctionContract } from '@/services/web3/auctions/auction'
import { getContractInstance as postAuctionLauncherContract } from '@/services/web3/postAuctionLauncher'
import { getContractInstance as erc20TokenContract } from '@/services/web3/erc20Token'
import {
	to18Decimals,
	toDecimals,
	divNumbers,
	multiplyNumbers,
	toNDecimals,
	toDecimalPlaces,
} from '@/util'
import { NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'
import CrowdProgress from '~/components/Miso/Auctions/Details/CrowdProgress'
import DutchProgress from '~/components/Miso/Auctions/Details/DutchProgress'
import BatchProgress from '~/components/Miso/Auctions/Details/BatchProgress'
import BaseDivider from '~/components/BaseDivider.vue'

export default {
	name: 'LiveStatus',
	components: {
		BaseDivider,
		CrowdProgress,
		DutchProgress,
		BatchProgress,
	},
	props: {
		status: {
			type: [Object, Array],
			required: true,
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
		userInfo: {
			type: [Object, Array],
			required: true,
		},
	},
	data() {
		return {
			displaySeconds: '00',
			displayMinutes: '00',
			displayHours: '00',
			displayDays: '00',
			userTokens: 0,
			accountBalance: 0,
			// TODO A.K. this need to be updated with connected wallet's bance in marketInfo.paymentCurrency currency
			maxValue: 20,
			limit: null,
			now: new Date(),
			finalize: {
				author: false,
				user: false,
			},
			allowance: 0,
			loading: false,
			waitingForWithdrawLP: false,
			upcomingVideo: true,
		}
	},
	computed: {
		...mapGetters({
			mode: 'theme/getMode',
			coinbase: 'ethereum/coinbase',
			// TODO: add user's balance
			// accountBalance: "ethereum/accountBalance",
			totalParticipants: 'commitments/totalParticipants',
		}),
		// TODO needs to be set if user is author of auction or not
		canFinalize() {
			if (this.liquidityInfo.liquidityStatus === 1) return true
			if (this.userInfo.isAdmin) return true
			return false
		},
		isAuthor() {
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
			if (this.mode) {
				return '#ffffff'
			}
			return 'rgba(255, 255, 255, 0.2)'
		},
		getFullTime() {
			return `${this.displayDays}d : ${this.displayHours}h : ${this.displayMinutes}m : ${this.displaySeconds}s`
		},
		limitWidth() {
			return this.limit
		},
		selectedTokenQuantity: {
			get() {
				return BigNumber(this.userTokens)
					.decimalPlaces(Number(this.marketInfo.paymentCurrency.decimals))
					.toString()
			},
			set(val) {
				if (val > this.maxInvestAmount) {
					this.userTokens = this.maxInvestAmount
				} else {
					this.userTokens = val
				}
			},
		},
		getStatus() {
			if (
				this.displayDays === '00' &&
				this.displayHours === '00' &&
				this.displayMinutes === '00' &&
				this.displaySeconds === '00'
			) {
				return false
			}
			return true
		},
		responsiveClass() {
			if (this.$screen.width > 992 && this.$screen.width < 1250) {
				return 'fs-2'
			}
			return 'fs-3'
		},
		finishedStatusText() {
			return this.status.auctionSuccessful
				? 'Auction Finished Successfully'
				: 'Auction Failed to Reach a Target'
		},
		isBadAuction() {
			return (
				this.$route.params.address === '0xEd4A285845f19945b0EbC04a3165e3DCAf62fEeD'
			)
		},
		isUpcoming() {
			const currentTimestamp = Date.parse(new Date()) / 1000
			return this.marketInfo.startTime > currentTimestamp
		},
		isLive() {
			const currentTimestamp = Date.parse(new Date()) / 1000
			return currentTimestamp < this.marketInfo.endTime
		},
		maxTokenAmount() {
			return toDecimalPlaces(
				Math.max(
					0,
					this.marketInfo.totalTokens - this.marketInfo.totalTokensCommitted
				)
			)
		},
		maxInvestAmount() {
			if (this.status.type === 'batch') {
				return this.accountBalance
			}

			return parseFloat(
				multiplyNumbers(this.maxTokenAmount, this.marketInfo.currentPrice)
			)
		},
		percentRemaining() {
			if (this.status.type === 'batch') {
				return this.isLive ? 100 : 0
			}
			return parseFloat(
				toDecimalPlaces(
					divNumbers(this.maxTokenAmount, this.marketInfo.totalTokens) * 100
				)
			)
		},
		totalCommitments() {
			return toDecimalPlaces(this.marketInfo.commitmentsTotal)
		},
		tokenAmount: {
			get() {
				if (this.status.type === 'batch') {
					if (parseFloat(this.marketInfo.currentPrice) === 0)
						return this.marketInfo.totalTokens
					return divNumbers(this.selectedTokenQuantity, this.marketInfo.currentPrice)
				}
				return divNumbers(this.selectedTokenQuantity, this.marketInfo.currentPrice)
			},
			set(val) {
				this.userTokens = multiplyNumbers(val, this.marketInfo.currentPrice)
			},
		},
		isApproved() {
			if (this.marketInfo.paymentCurrency.addr === NATIVE_CURRENCY_ADDRESS) {
				return true
			}
			return (
				parseInt(this.allowance) >=
				parseInt(
					toNDecimals(
						this.selectedTokenQuantity,
						this.marketInfo.paymentCurrency.decimals
					)
				)
			)
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
			const hard = this.marketInfo.totalTokens * this.marketInfo.rate
			const commitmentsTotal = this.marketInfo.commitmentsTotal

			const d1 = hard
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
		userCommitments() {
			return toDecimals(
				this.userInfo.commitments,
				this.marketInfo.paymentCurrency.decimals
			)
		},
		userTokensClaimable() {
			return toDecimals(this.userInfo.tokensClaimable)
		},
		canClaim() {
			return BigNumber(this.userInfo.tokensClaimable).isGreaterThan(0)
		},
		canWithdraw() {
			return BigNumber(this.userInfo.commitments).isGreaterThan(0)
		},
		isClaimed() {
			// return true
			return (
				BigNumber(this.userInfo.claimed).isGreaterThan(0) &&
				BigNumber(this.userInfo.tokensClaimable).isZero()
			)
		},
		claimTokenText() {
			if (!this.marketInfo.finalized) {
				return `You are able to claim ${this.userTokensClaimable} ${this.textCheck(
					this.tokenInfo.symbol
				)} when it is finalized`
			}
			if (this.isClaimed) {
				return `Your ${this.textCheck(this.tokenInfo.symbol)} has been claimed`
			}
			return `You are able to claim ${this.userTokensClaimable} ${this.textCheck(
				this.tokenInfo.symbol
			)} now`
		},
		canWithdrawLP() {
			return (
				this.liquidityInfo.isAdmin &&
				this.liquidityInfo.liquidityStatus === 2 &&
				BigNumber(this.liquidityInfo.lpTokenBalance).isGreaterThan(0)
			)
		},
		withdrawLPUnlocked() {
			return this.liquidityInfo.launcherInfo.unlock
				? Date.now() >= this.liquidityInfo.launcherInfo.unlock * 1000
				: false
		},
		launcherLPBalanceText() {
			const date = new Date(this.liquidityInfo.launcherInfo.unlock * 1000)
			return `You have ${
				this.liquidityInfo.lpTokenBalance
			} LP tokens locked up until ${moment(date).format('LLLL')}`
		},
	},
	watch: {
		mode: {
			deep: true,
			handler() {
				if (!this.upcomingVideo) {
					this.upcomingVideo = true
				}
				const video = document.querySelector('.finalized-video')
				if (video) {
					video.load()
					video.play()
				}
			},
		},
	},
	created() {
		if (this.marketInfo.hasPointList) {
			this.limit = Math.floor(this.maxTokenAmount) // TODO: get user's max amount
		} else {
			this.limit = 100
		}
	},
	async mounted() {
		// console.log('====>', this.marketInfo)
		// if (!this.status.auctionSuccessful) {
		this.showCountDown()
		// }
		if (this.coinbase) {
			const paymentTokenAddress = this.marketInfo.paymentCurrency.addr
			let balance = 0
			if (paymentTokenAddress !== NATIVE_CURRENCY_ADDRESS) {
				const methods = [{ methodName: 'balanceOf', args: [this.coinbase] }]
				const [balanceOf] = await makeBatchCall(
					erc20TokenContract(paymentTokenAddress),
					methods
				)
				balance = balanceOf
				await this.updateAllowance()
			} else {
				balance = await web3.eth.getBalance(this.coinbase)
			}
			this.accountBalance = parseFloat(
				toDecimalPlaces(
					toDecimals(balance, this.marketInfo.paymentCurrency.decimals),
					6
				)
			)
		}
		const auctionAddress = this.$route.params.address
		this.contractInstance = getAuctionContract(auctionAddress)

		const video = document.querySelector('.finalized-video')
		if (video) {
			video.onended = () => {
				this.upcomingVideo = false
			}
		}

		setInterval(() => {
			this.now = new Date()
		}, 2000)
	},
	beforeDestroy() {
		clearInterval(this.interval)
	},
	methods: {
		...mapActions({ enableAccount: 'ethereum/enableAccount' }),
		textCheck(str, val) {
			const pattern = /^[()\s0-9a-zA-Z]+$/
			if (str.match(pattern)) {
				return str
			} else {
				return `-`
			}
		},
		async withdraw() {
			this.loading = true
			const method = this.contractInstance.methods.withdrawTokens(this.coinbase)

			await sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
				if (receipt.status) {
					this.$emit('updateUserInfo')
				}
				this.loading = false
			})

			// Bob logic
			this.finalize.user = true
			// }
		},
		withdrawLP() {
			this.waitingForWithdrawLP = true

			const method = postAuctionLauncherContract(
				this.marketInfo.wallet
			).methods.withdrawLPTokens()

			sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
				if (receipt.status) {
					// eslint-disable-next-line vue/no-mutating-props
					this.liquidityInfo.lpTokenBalance = 0
				}
				this.waitingForWithdrawLP = false
			})
		},
		async finalizeAuction() {
			this.loading = true

			let method
			if (this.liquidityInfo.liquidityStatus === 1) {
				method = postAuctionLauncherContract(
					this.marketInfo.wallet
				).methods.finalize()
			} else {
				method = this.contractInstance.methods.finalize()
			}

			await sendTransactionAndWait(
				method,
				{ from: this.coinbase },
				async (receipt) => {
					if (receipt.status) {
						this.$emit('auctionFinalized')
					}
					if (receipt.blockNumber) {
						const block = await web3.eth.getBlock(receipt.blockNumber)
						// eslint-disable-next-line vue/no-mutating-props
						this.liquidityInfo.launcherInfo.unlock =
							block.timestamp + this.liquidityInfo.launcherInfo.locktime
					}
					this.loading = false
				}
			)

			this.finalize.user = true
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
		invest() {
			if (
				this.status.type !== 'batch' &&
				BigNumber(this.tokenAmount).isGreaterThan(BigNumber(this.maxTokenAmount))
			)
				return
			if (
				BigNumber(this.selectedTokenQuantity).isGreaterThan(
					BigNumber(this.accountBalance)
				)
			)
				return

			this.loading = true
			let method
			let value = 0
			if (this.marketInfo.paymentCurrency.addr === NATIVE_CURRENCY_ADDRESS) {
				method = this.contractInstance.methods.commitEth(this.coinbase, true)
				value = to18Decimals(this.selectedTokenQuantity)
			} else {
				method = this.contractInstance.methods.commitTokens(
					toNDecimals(
						this.selectedTokenQuantity,
						this.marketInfo.paymentCurrency.decimals
					),
					true
				)
			}
			// TODO: update user's allowance when transaction confirmed
			sendTransactionAndWait(method, { from: this.coinbase, value }, (_) => {
				this.loading = false
				this.updateAllowance()
			})
		},

		approve() {
			this.loading = true
			const auctionAddress = this.$route.params.address
			const allowanceAmount = toNDecimals(
				this.selectedTokenQuantity,
				this.marketInfo.paymentCurrency.decimals
			)
			const method = erc20TokenContract(
				this.marketInfo.paymentCurrency.addr
			).methods.approve(auctionAddress, allowanceAmount)

			sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
				if (receipt.status) {
					this.allowance = allowanceAmount
				}
				this.loading = false
			})
		},
		async updateAllowance() {
			const auctionAddress = this.$route.params.address
			const methods = [
				{
					methodName: 'allowance',
					args: [this.marketInfo.paymentCurrency.addr, this.coinbase, auctionAddress],
				},
			]

			const [allowance] = await makeBatchCall(misoHelperContract(), methods)
			this.allowance = allowance
		},
		updateTimestamp() {
			this.timestamp = Math.round(new Date().getTime() / 1000)
		},
	},
}
</script>

<style lang="scss" scoped>
.finalized {
	&-box {
		width: 100%;
		max-height: 350px;
		margin: 10px 0;
	}
	&-video {
		width: 100%;
		height: 100%;
	}
}
.symbol_wrapper {
	top: 50%;
	transform: translateY(-50%);
	left: 20px;
	pointer-events: none;
	.amount {
		font-size: 0.875rem !important;
		opacity: 0;
	}
	.token {
		opacity: 0.8;
	}
}

.center-status {
	position: absolute;
	left: 50%;
	top: 65%;
	width: 100%;
	transform: translate(-50%, -65%);
}
.status {
	height: 10px;
	width: 10px;
	border-radius: 100%;

	&_counter {
		span {
			min-width: 127px;
			display: inline-block;
			text-align: left;
		}
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
	@media screen and (min-width: 1200px) and (max-width: 1600px) {
		justify-content: space-around;
		padding-left: 0 !important;
	}

	&-bg {
		background: #20284e;
		border-radius: 34234234px;
	}
	button {
		background: #f46e41 !important;
		border-radius: 34234234px;
		margin: 0;
		height: inherit;
		@media screen and (min-width: 1200px) and (max-width: 1600px) {
			font-size: 14px;
			padding-left: 2rem !important;
			padding-right: 2rem !important;
		}
		@media screen and (min-width: 992px) and (max-width: 1350px) {
			font-size: 14px;
			padding-left: 1rem !important;
			padding-right: 1rem !important;
		}
		@media screen and (max-width: 400px) {
			font-size: 14px;
		}
	}
	span:first-child {
		font-size: 10px;
	}
}

.withdraw {
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
		transform: translateX(100%);
		.right {
			p {
				text-align: left !important;
			}
		}
		div {
			transform: translate(-11%, 0);
			padding-top: 10px;
		}
	}
	span {
		position: absolute;
		left: -0.4%;
		top: 2px;
		width: 1px;
		height: 25px;
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
.sale-token {
	button {
		background: #f46e41 !important;
		border-radius: 34234234px;
		margin: 0;
		height: inherit;
		min-width: 70px !important;
		&:first-child {
			border-top-right-radius: 0 !important;
			border-bottom-right-radius: 0 !important;
		}
		&:last-child {
			border-top-left-radius: 0 !important;
			border-bottom-left-radius: 0 !important;
		}
	}
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
@media screen and (max-width: 400px) {
	.project-status_text {
		h5 {
			font-size: 8px !important;
		}
		p {
			font-size: 10px !important;
		}
	}
}
.counter-line {
	display: inline-block;
	min-width: 315px;
	text-align: left;
	@media screen and (max-width: 550px) {
		font-size: 25px;
		min-width: 276px;
	}
}
.finalize {
	border-radius: 30px;
	padding: 15px 40px;
	&_bg {
		&-animation {
			border-radius: 100%;
			height: 170px;
			width: 170px;
			background: #00082b;
			margin: 40px 0;
		}
		.transaction {
			border-radius: 60px;
		}
		&-user {
			a {
				color: #f46e41 !important;
				text-decoration: underline;
			}
			.twitt {
				background: #00082b !important;
				padding: 15px 40px;
				border-radius: 34px;
				cursor: pointer;
			}
			&_box {
				top: 70%;
				left: 50%;
				transform: translate(-50%, -70%);

				.success {
					margin: 100px 0 100px 0;
				}
			}
		}
	}
}
.sale-token {
	.form-group {
		margin-bottom: 0 !important;
	}
}

@media screen and (max-width: 768px) {
	.failed-options {
		align-items: flex-start !important;
		margin-bottom: 15px;
	}
	.failed-options:nth-child(odd) {
		min-width: 50%;
	}
	.failed-options:nth-child(even) {
		min-width: 35%;
	}
	.options-wrapper {
		margin-bottom: 180px;
	}
}
</style>
