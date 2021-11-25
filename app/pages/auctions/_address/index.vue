<template>
	<div>
		<div v-if="!loading" class="row mt-4 pt-3 justify-content-center">
			<div class="col-12 col-lg-6">
				<about-card
					:info="about"
					:market-info="marketInfo"
					:token-info="tokenInfo"
					:liquidity-info="liquidityInfo"
					:user="userInfo"
					:price="marketInfo.currentPrice"
					:type="status.type"
					:status="status"
				/>
			</div>
			<div class="col-12 col-lg-6 mt-4 pt-3 pt-lg-0 mt-lg-0">
				<live-status
					:status="status"
					:market-info="marketInfo"
					:token-info="tokenInfo"
					:liquidity-info="liquidityInfo"
					:user-info="userInfo"
					@updateUserInfo="updateUserInfo"
					@auctionFinalized="finalizeAuction"
				/>
			</div>
			<br />
			<div class="col-12 col-lg-12 mt-4 pt-3">
				<commitments
					:commitments="listCommitments"
					:short-currency="marketInfo.paymentCurrency.symbol"
					:total-tokens="marketInfo.totalTokens"
					:total-tokens-committed="marketInfo.totalTokensCommitted"
					:current-price="marketInfo.currentPrice"
					:minimum-price="marketInfo.minimumPrice"
				/>
			</div>
		</div>
		<loader v-else width="80" height="80" y="250" />
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BigNumber from 'bignumber.js'

import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
import { clearingPrice } from '@/services/web3/auctions/dutch'
import { getContractInstance as getAuctionContract } from '@/services/web3/auctions/auction'
import { getContractInstance as postAuctionLauncherContract } from '@/services/web3/postAuctionLauncher'
import { makeBatchCall } from '@/services/web3/base'
import { toDecimals, toPrecision, to18Decimals, toNDecimals } from '@/util/index'
import AboutCard from '@/components/Miso/Auctions/AuctionInfo/AboutCard'
import LiveStatus from '@/components/Miso/Auctions/AuctionInfo/LiveStatus'
import Commitments from '@/components/Miso/Auctions/Commitments'
import { NATIVE_CURRENCY_ADDRESS } from '~/constants/networks'

const TOPIC_ADDED_COMMITMENT =
	'0x077511a636ba1f10551cc7b89c13ff66a6ac9344e8a917527817a9690b15af7a'

export default {
	name: 'AuctionInfo',
	components: {
		LiveStatus,
		AboutCard,
		Commitments,
	},
	data() {
		return {
			auctionAddress: this.$route.params.address,
			// can be Object or Array
			about: {
				icons: {
					social: {},
					ingredient: [
						{
							icon: 'liquidity-1',
							text: 'Pool Liquidity',
						},
						{
							icon: 'mintable-2',
							text: 'Mintable',
						},
						{
							icon: 'crowdsale',
							text: 'Crowdsale',
						},
					],
				},
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
					addr: null,
					name: '',
					symbol: '',
					decimals: 0,
				},
				hasPointList: false,
				pointListAddress: '',
				totalTokens: 0,
				commitmentsTotal: 0,
				wallet: '',
				finalized: 0,
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
			userInfo: {
				commitments: 0,
				tokensClaimable: 0,
				claimed: 0,
				isAdmin: 0,
			},
			contractInstance: null,
			loading: true,
			subscription: null,
			aboutStatus: {},
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			commitmentsTotal: 'commitments/commitmentsTotal',
			listCommitments: 'commitments/list',
			nativeCurrency: 'ethereum/nativeCurrency',
		}),
	},
	watch: {
		commitmentsTotal(newValue) {
			this.marketInfo.commitmentsTotal = toPrecision(newValue, 5)
			if (this.status.type === 'dutch') {
				this.updateDutchData()
			} else if (this.status.type === 'crowdsale') {
				this.updateCrowdsaleData()
			} else if (this.status.type === 'batch') {
				this.updateBatchData()
			}
		},
	},
	async mounted() {
		await this.getTemplateId()
		let type
		// let finishAuction
		switch (parseInt(this.marketTemplateId)) {
			case 1:
				type = 'crowdsale'
				await this.setCrowdsaleData()
				// finishAuction = this.marketInfo.totalTokensCommitted
				break
			case 2:
				type = 'dutch'
				await this.setDutchAuctionData()
				break
			case 3:
				type = 'batch'
				await this.setBatchData()
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
		Object.assign(this.status, { type, auction })
		if (this.coinbase) {
			await this.updateUserInfo()
		}
		await this.getPastCommitments()
		this.subscribeToNewCommitments()

		// Documents
		const methods = [{ methodName: 'getDocuments', args: [this.auctionAddress] }]
		const [documents] = await makeBatchCall(misoHelperContract(), methods)

		documents.forEach((document) => {
			const name = document['0']
			const data = document['1']
			if (name && data && data.length > 0) {
				switch (name) {
					case 'website':
					case 'icon':
					case 'desktopBanner':
					case 'mobileBanner':
					case 'description':
						this.about[name] = data
						break
					default:
						this.about.icons.social[name] = data
				}
			}
		})

		// PointList
		const pointListMethod = [{ methodName: 'pointList' }]
		const [pointList] = await makeBatchCall(
			getAuctionContract(this.auctionAddress),
			pointListMethod
		)
		this.marketInfo.pointListAddress = pointList

		this.loading = false
	},
	beforeDestroy() {
		this.subscription.unsubscribe()
		this.resetCommitmentsState()
	},
	methods: {
		...mapActions({
			setCommitments: 'commitments/setCommitments',
			addCommitment: 'commitments/addCommitment',
			resetCommitmentsState: 'commitments/resetCommitmentsState',
		}),
		async setDutchAuctionData() {
			const methods = [
				{ methodName: 'getDutchAuctionInfo', args: [this.auctionAddress] },
			]
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
			this.updateDutchData()
		},

		async setCrowdsaleData() {
			const methods = [
				{ methodName: 'getCrowdsaleInfo', args: [this.auctionAddress] },
			]
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
			// this.marketInfo.finalized = false
			this.marketInfo.finalized = data.finalized
			this.marketInfo.commitmentsTotal = toPrecision(
				toDecimals(data.commitmentsTotal, this.marketInfo.paymentCurrency.decimals),
				5
			)

			this.status.auctionSuccessful = data.auctionSuccessful
			this.status.totalTokens = toDecimals(data.totalTokens)
			this.marketInfo.currentPrice = toPrecision(this.marketInfo.rate, 5)
			this.updateCrowdsaleData()
		},

		async setBatchData() {
			const methods = [
				{ methodName: 'getBatchAuctionInfo', args: [this.auctionAddress] },
			]
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

		updateDutchData() {
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

		updateCrowdsaleData() {
			const tokensCommitted = this.marketInfo.commitmentsTotal / this.marketInfo.rate
			this.marketInfo.totalTokensCommitted = toPrecision(tokensCommitted, 3)
		},

		updateBatchData() {
			const price = this.marketInfo.commitmentsTotal / this.marketInfo.totalTokens
			this.marketInfo.currentPrice = toPrecision(price, 3)
		},

		async updateUserInfo() {
			const methods = [
				{
					methodName: 'getUserMarketInfo',
					args: [this.auctionAddress, this.coinbase],
				},
			]

			const [userInfo] = await makeBatchCall(misoHelperContract(), methods)

			this.userInfo.commitments = userInfo.commitments
			this.userInfo.tokensClaimable = userInfo.tokensClaimable
			this.userInfo.claimed = userInfo.claimed
			this.userInfo.isAdmin = userInfo.isAdmin
		},

		// Get Auction Template & Liquidity
		async getTemplateId() {
			const methods = [{ methodName: 'marketTemplate' }, { methodName: 'wallet' }]
			const [marketTemplate, wallet] = await makeBatchCall(
				getAuctionContract(this.auctionAddress),
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
					this.liquidityInfo.lpTokenBalance = toDecimals(lpTokenBalance)
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

		finalizeAuction() {
			this.marketInfo.finalized = true
			if (this.liquidityInfo.liquidityStatus === 1) {
				this.liquidityInfo.liquidityStatus = 2
			}
		},

		setTokenInfo(tokenInfo) {
			this.tokenInfo = tokenInfo
		},

		subscribeToNewCommitments() {
			this.subscription = web3socket.eth
				.subscribe(
					'logs',
					{
						address: this.auctionAddress,
						topics: [TOPIC_ADDED_COMMITMENT],
					},
					(error, result) => {
						if (!error) {
							const decodedData = web3.eth.abi.decodeParameters(
								['address', 'uint256'],
								result.data
							)
							this.addCommitment({
								txHash: result.transactionHash,
								timestamp: result.blockNumber,
								address: decodedData[0],
								amount: toDecimals(
									decodedData[1],
									this.marketInfo.paymentCurrency.decimals
								),
							})
						}
					}
				)
				.on('connected', function (subscriptionId) {
					console.log('subscriptionId:', subscriptionId)
				})
				.on('data', function (log) {})
				.on('changed', function (log) {
					console.log('changed:', log)
				})
		},
		async getPastCommitments() {
			const commitments = []
			const logs = await web3.eth.getPastLogs({
				fromBlock: 0,
				toBlock: 'latest',
				address: this.auctionAddress,
				topics: [TOPIC_ADDED_COMMITMENT],
			})
			logs.forEach((log) => {
				const decodedData = web3.eth.abi.decodeParameters(
					['address', 'uint256'],
					log.data
				)
				commitments.push({
					txHash: log.transactionHash,
					timestamp: log.blockNumber,
					address: decodedData[0],
					amount: toDecimals(
						decodedData[1],
						this.marketInfo.paymentCurrency.decimals
					),
				})
			})

			this.setCommitments(commitments)
		},
	},
}
</script>

<style lang="scss" scoped></style>
