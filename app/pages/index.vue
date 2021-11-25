<template>
	<div class="container-fluid container-padding">
		<div class="row">
			<div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
				<scroll-div
					ref="myscroll"
					:height="scrollHeight"
					view-class="scrolldiv"
					:scroll="onScroll"
					class="mt-3"
				>
					<div id="misoido" class="mt-1 mb-4 row">
						<div class="col-12">
							<div class="d-flex">
								<img src="@/assets/images/misoBowl.png" class="bowl" />
								<!-- p class="text-uppercase text-white misoido pt-1">Miso Ido</p -->
								<img :src="getMisoIdo" class="misoido" />
							</div>
							<p class="bottom-bar">&nbsp;</p>
						</div>
					</div>
					<landing-card
						v-for="(cardcont, index) in cardContent"
						:id="'landingcard' + index"
						:key="index"
						:ref="'landingcard' + index"
						:class="{ 'pt-5': index !== 0 }"
						:cardimg="cardcont.cardimg"
						:mobilecardimg="cardcont.mobilecardimg"
						:logoimg="cardcont.logoimg"
						:title="cardcont.title"
						:description="cardcont.description"
						:websiteurl="cardcont.websiteurl"
						:social="cardcont.social"
						:auction="cardcont.auction"
						:ingredients="ingredients"
					></landing-card>
				</scroll-div>
				<landing-card
					v-for="(cardcont, index) in cardContent"
					:key="index"
					:class="{ 'pt-5': index !== 0 }"
					:cardimg="cardcont.cardimg"
					:mobilecardimg="cardcont.mobilecardimg"
					:logoimg="cardcont.logoimg"
					:title="cardcont.title"
					:description="cardcont.description"
					:websiteurl="cardcont.websiteurl"
					:social="cardcont.social"
					:auction="cardcont.auction"
					:ingredients="ingredients"
					class="landing-mobile"
				></landing-card>
			</div>
			<div class="col-lg-3 col-md-3 d-flex right-pane mt-5">
				<scroll-div ref="myscroll1" :height="paneScrollHeight" view-class="scrolldiv">
					<div v-for="(cardcont, index) in cardContent" :key="index">
						<div class="d-flex">
							<div class="status-icon">
								<div v-if="cardcont.status == 'live'" class="d-flex">
									<div
										:id="'circle' + index"
										class="green-circle bg-success"
										:class="{ 'bg-disabled': index !== 0 }"
									></div>
								</div>
								<div
									v-if="cardcont.status == 'upcoming'"
									:id="'circle' + index"
									class="green-circle bg-orange"
									:class="{ 'bg-disabled': index !== 0 }"
								></div>
							</div>
							<div class="w-100">
								<div class="text-white dead-date pb-1">{{ cardcont.deaddate }}</div>
								<div class="d-flex">
									<div
										class="pane-card d-flex text-white w-100"
										:class="paneCardBack"
										@click="paneClick(index)"
									>
										<img
											:src="getCardContentLogo(cardcont.logoimg)"
											class="logo-image"
										/>
										<div class="margin-auto">
											<div class="title">{{ cardcont.title }}</div>
											<div class="panescript">{{ cardcont.panescript }}</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</scroll-div>
			</div>
		</div>
	</div>
</template>

<script>
import LandingCard from '@/components/Miso/Auctions/Specials/LandingCard'
// import AuctionModal from '@/components/web3-core/navbar/AuctionModal'
import { mapGetters, mapActions } from 'vuex'
import ScrollDiv from 'vue-scroll-div'

import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
import {
	getContractInstance as dutchAuctionContract,
	clearingPrice,
} from '@/services/web3/auctions/dutch'
import { getContractInstance as crowdsaleContract } from '@/services/web3/auctions/crowdsale'
import { getContractInstance as batchAuctionContract } from '@/services/web3/auctions/batch'
import { makeBatchCall } from '@/services/web3/base'
import { toDecimals, toPrecision, to18Decimals, toNDecimals } from '@/util/index'
import { NATIVE_CURRENCY_ADDRESS } from '@/constants/networks'

export default {
	name: 'LiveAuctions',
	components: {
		LandingCard,
		// AuctionModal,
		ScrollDiv,
	},
	data() {
		return {
			loading: true,
			scrollHeight: 0,
			paneScrollHeight: 0,
			auctionsList: [],
			ingredients: [
				{
					icon: 'wheat',
					text: 'Mintable',
				},
				{
					icon: 'teapot',
					text: 'Pool Liquidity',
				},
				{
					icon: 'crowd',
					text: 'Crowdsale',
				},
			],
			options: { quality: { default: '1080p' } },
			showModal: true,
			cardContent: [],
			cardContentTemplate: [
				{
					cardimg: 'card.png',
					mobilecardimg: 'card_mobile.png',
					logoimg: 'card_logo.png',
					title: '',
					description: '',
					websiteurl: '',
					auction: '',
					deaddate: '',
					panescript: '',
					type: '',
					status: 'upcoming',
					social: {},
				},
				{
					cardimg: 'card01.jpg',
					mobilecardimg: 'card_mobile01.jpg',
					logoimg: 'card_logo01.png',
					title: '',
					description: '',
					websiteurl: '',
					auction: '',
					deaddate: '',
					panescript: '',
					type: '',
					status: 'upcoming',
					social: {},
				},
				{
					cardimg: 'card02.jpg',
					mobilecardimg: 'card_mobile02.jpg',
					logoimg: 'card_logo02.png',
					title: '',
					description: '',
					websiteurl: '',
					auction: '',
					deaddate: '',
					panescript: '',
					type: '',
					status: 'upcoming',
					social: {},
				},
			],
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
				totalTokens: 0,
				commitmentsTotal: 0,
			},
			tokenInfo: {
				address: '',
				name: '',
				symbol: '',
			},
			about: {
				title: '',
				tokenPair: '',
				recipe: 'Classic Miso',
			},
			contractInstance: null,
			currentpane: 0,
		}
	},
	computed: {
		...mapGetters({
			auctions: 'auctions/list',
			coinbase: 'ethereum/coinbase',
			isRightNetwork: 'ethereum/isRightNetwork',
			mode: 'theme/getMode',
			nativeCurrency: 'ethereum/nativeCurrency',
		}),
		paneCardBack() {
			if (this.mode) {
				return 'pane-card-back'
			}
			return 'pane-card-back-white'
		},
		getMisoIdo() {
			if (this.mode) {
				return require('~/assets/images/miso_ido_dark.png')
			}
			return require('~/assets/images/miso_ido_light.png')
		},
	},
	watch: {
		currentpane(val) {
			this.currentpaneChanged(val)
		},
	},
	beforeMount() {
		this.scrollHeight = window.innerHeight - 174 // misoido height: 86
		this.paneScrollHeight = window.innerHeight - 212 // mt-5: 48
		window.addEventListener('resize', this.myResize)
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.myResize)
	},
	async mounted() {
		await this.initAuctions()
		let i, templateIndex
		this.cardContent = []
		for (i = 0; i < this.auctionsList.length; i++) {
			switch (this.auctionsList[i]) {
				case '0x6088aCBeC1dc8a66E800453f15BBf39d392a39C5':
					templateIndex = 1
					break
				case '0x1cF0EC7745de56682bC9a27632E7311FBc71C75a':
					templateIndex = 2
					break
				default:
					templateIndex = 0
			}
			this.cardContent.push({ ...this.cardContentTemplate[templateIndex] })
			this.cardContent[i].auction = this.auctionsList[i]
			await this.getTemplateId(this.cardContent[i].auction)
			let type
			switch (parseInt(this.marketTemplateId)) {
				case 1:
					type = 'crowdsale'
					this.contractInstance = crowdsaleContract(this.cardContent[i].auction)
					await this.setCrowdsaleData(this.cardContent[i].auction)
					break
				case 2:
					type = 'dutch'
					this.contractInstance = dutchAuctionContract(this.cardContent[i].auction)
					await this.setDutchAuctionData(this.cardContent[i].auction)
					break
				case 3:
					type = 'batch'
					this.contractInstance = batchAuctionContract(this.cardContent[i].auction)
					await this.setBatchData(this.cardContent[i].auction)
					break
				case 4:
					type = 'hyperbolic'
					break
				default:
					break
			}
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
			this.cardContent[i].type = type
			this.cardContent[i].status = auction
			this.cardContent[i].deaddate = new Date(
				parseInt(this.marketInfo.startTime) * 1000
			).toUTCString()

			this.cardContent[i].title = `${this.tokenInfo.name} (${this.tokenInfo.symbol})`
			this.cardContent[i].title = this.cardContent[i].title.substring(
				0,
				this.cardContent[i].title.lastIndexOf('(')
			)

			const methods = [
				{ methodName: 'getDocuments', args: [this.cardContent[i].auction] },
			]
			const [documents] = await makeBatchCall(misoHelperContract(), methods)

			documents.forEach((document) => {
				const name = document['0']
				const data = document['1']
				if (name && data && data.length > 0) {
					switch (name) {
						case 'website':
							this.cardContent[i].websiteurl = data
							break
						case 'icon':
							this.cardContent[i].logoimg = data
							break
						case 'description':
							this.cardContent[i].description = data
							// this.cardContent[i].panescript = data
							break
						case 'desktopBanner':
							this.cardContent[i].cardimg = data
							break
						case 'mobileBanner':
							this.cardContent[i].mobilecardimg = data
							break
						default:
							this.cardContent[i].social[name] = data
							break
					}
				}
			})

			// if (this.cardContent[i].description)
			// 	this.cardContent[i].description =
			// 		this.cardContent[i].description.substring(0, 200) + ' ...'
			// if (this.cardContent[i].panescript)
			// 	this.cardContent[i].panescript =
			// 		this.cardContent[i].panescript.substring(0, 60) + ' ...'
		}
	},
	methods: {
		...mapActions({
			getAuctions: 'auctions/getAuctions',
		}),
		async initAuctions() {
			await this.getAuctions()
			this.auctionsList = this.auctions
				.filter((auction) => {
					const currentTimestamp = Date.parse(new Date()) / 1000
					return (
						((currentTimestamp >= parseInt(auction.startTime) &&
							currentTimestamp < parseInt(auction.endTime)) ||
							currentTimestamp < parseInt(auction.startTime)) &&
						!auction.finalized
					)
				})
				.map((x) => x[0])
			this.loading = false
		},
		async setDutchAuctionData(auction) {
			const methods = [{ methodName: 'getDutchAuctionInfo', args: [auction] }]
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

		async setCrowdsaleData(auction) {
			const methods = [{ methodName: 'getCrowdsaleInfo', args: [auction] }]
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

		async setBatchData(auction) {
			const methods = [{ methodName: 'getBatchAuctionInfo', args: [auction] }]
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

		async getTemplateId(auction) {
			const methods = [{ methodName: 'marketTemplate' }]
			const [marketTemplate] = await makeBatchCall(
				dutchAuctionContract(auction),
				methods
			)
			this.marketTemplateId = marketTemplate
		},

		setTokenInfo(tokenInfo) {
			this.tokenInfo = tokenInfo
			this.about.title = `${tokenInfo.name} (${tokenInfo.symbol})`
			this.about.tokenPair = `${tokenInfo.symbol}/${this.marketInfo.paymentCurrency.symbol}`
		},

		myResize() {
			this.scrollHeight = window.innerHeight - 174 // misoido height: 86
			this.paneScrollHeight = window.innerHeight - 212 // mt-5: 48
		},

		paneClick(ind) {
			if (ind === 0) this.$refs.myscroll.scrollTo('top')
			else if (ind === this.cardContent.length - 1)
				this.$refs.myscroll.scrollTo(99999)
			else {
				let height = 86
				let i
				for (i = 0; i < ind; i++) {
					if (document.getElementById('landingcard' + i))
						height =
							height +
							parseInt(document.getElementById('landingcard' + i).offsetHeight)
				}
				// height =
				// 	height + parseInt(getComputedStyle(document.documentElement).fontSize) * 3
				this.$refs.myscroll.scrollTo(height)
			}
			// this.currentpaneChanged(ind)
		},

		currentpaneChanged(val) {
			let i
			for (i = 0; i < this.cardContent.length; i++) {
				if (document.getElementById('circle' + i) != null) {
					if (i !== val) {
						document.getElementById('circle' + i).classList.add('bg-disabled')
					} else {
						document.getElementById('circle' + i).classList.remove('bg-disabled')
					}
				}
			}
		},

		onScroll(e, val) {
			let i
			let height = 86
			for (i = 0; i < this.cardContent.length; i++) {
				if (document.getElementById('landingcard' + i))
					height =
						height + parseInt(document.getElementById('landingcard' + i).offsetHeight)
			}
			// height =
			// 	height + parseInt(getComputedStyle(document.documentElement).fontSize) * 3
			const maxScroll = height - this.$refs.myscroll.height
			height = 86
			if (e.target.scrollTop === maxScroll)
				this.currentpaneChanged(this.cardContent.length - 1)
			else if (e.target.scrollTop <= height) this.currentpaneChanged(0)
			else {
				// height = parseInt(getComputedStyle(document.documentElement).fontSize) * 3
				for (i = 0; i < this.cardContent.length - 1; i++) {
					if (document.getElementById('landingcard' + i)) {
						height =
							height +
							parseInt(document.getElementById('landingcard' + i).offsetHeight)
						// console.log(e.target.scrollTop, height)
						if (e.target.scrollTop <= height) {
							this.currentpaneChanged(i + 1)
							break
						}
					}
				}
			}
		},

		getCardContentLogo(url) {
			if (url && url.startsWith('http')) return url
			return require('~/assets/images/' + url)
		},
	},
}
</script>

<style lang="scss" scoped>
.bowl {
	width: 6rem;
	// height: fit-content;
	margin: auto 0;
	@media screen and (max-width: 400px) {
		width: 4.5rem;
	}
}
.misoido {
	width: 13rem;
	height: fit-content;
	margin: auto 0;
	@media screen and (max-width: 400px) {
		width: 10rem;
	}
}
.bottom-bar {
	background-image: linear-gradient(115deg, #ff000b 0%, #ff5100 40%, #f800ff 80%);
	height: 2px;
	margin: 0 auto;
	@media screen and (max-width: 767px) {
		margin: 0 -30px;
		margin-top: 1rem;
	}
}

.scrolldiv {
	width: 100%;
	// height: 800px;
	@media screen and (max-width: 767px) {
		display: none;
	}
}

.landing-mobile {
	display: none;
	@media screen and (max-width: 767px) {
		display: inline;
	}
}

.scroll-div.is-scroll-native::-webkit-scrollbar {
	width: 0;
	height: 0;
}

.right-pane {
	@media screen and (max-width: 767px) {
		display: none !important;
	}
}

.pane-card {
	border-radius: 6px;
	padding: 0.5rem;
	border: none;
	cursor: pointer;
	margin-bottom: 1.5rem;
}

.pane-card-back {
	background-color: #262f53;
}

.pane-card-back-white {
	background-color: #f3f3f3;
}

.logo-image {
	min-width: 3.5rem;
	max-height: 3.5rem;
	margin-right: 0.5rem;
	margin-top: auto;
	margin-bottom: auto;
}

.title {
	font-size: 1rem;
}

.panescript {
	font-size: 0.6rem;
}

.margin-auto {
	margin: auto 0;
}

.dead-date {
	font-size: 0.6rem;
}

.green-circle {
	border-radius: 1rem;
	width: 1rem;
	height: 1rem;
}

.status-icon {
	margin-top: auto;
	margin-bottom: auto;
	padding-right: 0.5rem;
}

.bg-orange {
	background-color: #ffa500 !important;
}

.bg-disabled {
	opacity: 0.5;
}
</style>
