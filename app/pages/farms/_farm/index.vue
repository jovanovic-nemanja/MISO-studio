<template>
	<div class="farmDetails">
		<div class="farmDetails_wrapper">
			<div class="row justify-content-center">
				<div class="col-12-mobile col-md-10">
					<h3 class="font-weight-bold text-white fs-8 text-center mb-0 mt-4 mt-sm-0">
						FARM
					</h3>
					<p class="text-center text-white">
						Stake LP tokens and farm, Zap {{ nativeCurrency.symbol }} to get LP tokens
						and claim rewards
					</p>
				</div>
				<div class="col-12 col-md-10 col-lg-10 col-xl-8">
					<card class="mt-4">
						<div
							class="d-flex flex-column flex-sm-row justify-content-between px-4 py-2"
						>
							<div
								class="
									farmDetails_token
									miso-border_light
									pb-2 pb-sm-0
									align-items-center
								"
							>
								<!-- <div class="farmDetails_token-img bg-white">
									<img src="~static/img/sushi.png" alt="token" />
								</div> -->
								<p class="m-0 pl-2 font-weight-bold fs-3 text-white">Farm Details:</p>
								<div class="flex flex-column ml-3">
									<p class="m-0 pl-2">
										Rewards {{ farmInfo.rewardsPerBlock }} / block
									</p>
								</div>
							</div>
							<!-- <div class="d-flex justify-content-sm-end justify-content-start">
								<div class="d-flex farmDetails_token-price">
									<div
										class="d-flex flex-column miso-border_light pl-sm-3 pr-4 py-2"
									>
										<span class="fs-2 font-weight-bold">APY</span>
										<span class="text-white fs-3 font-weight-bold">
											109.61%
										</span>
									</div>
									<div class="d-flex flex-column miso-border_light pl-3 py-2">
										<span class="fs-2 font-weight-bold">TVL</span>
										<span class="text-white fs-3 font-weight-bold">
											$17,500,937
										</span>
									</div>
								</div>
							</div> -->
						</div>
					</card>
				</div>
				<div class="col-12-mobile col-md-10 col-lg-10 col-xl-8">
					<div v-for="poolInfo in poolsInfo" :key="poolInfo.pid" class="row mt-2">
						<div class="col-sm-7 col-12 mb-4 mb-sm-0">
							<card class="h-100 mb-0">
								<div
									class="
										d-flex
										flex-column flex-sm-row
										justify-content-between
										align-items-center
										pl-4
										py-2
									"
								>
									<div class="d-flex flex-column">
										<p class="font-weight-bold text-white fs-1 m-0">
											Stake LP Tokens
										</p>
										<p class="font-weight-bold text-white fs-2 m-0">
											{{ farmInfo.rewardToken }} / {{ poolInfo.stakingToken }}
										</p>
										<p class="fs-1 m-0">
											{{ poolInfo.totalStaked.toFixed(2) }} total staked
										</p>
									</div>
									<div class="d-flex buttons justify-content-around">
										<button
											v-if="!poolInfo.isApproved"
											class="btn info-button"
											role="link"
											@click="approve(poolInfo.pid, poolInfo.stakingTokenAddress)"
										>
											Approve
										</button>
										<div v-if="poolInfo.isApproved" class="d-flex">
											<div class="ml-3 mt-2">
												<base-input
													v-model="poolInfo.stakeAmount"
													aria-placeholder=""
													type="number"
													min="0"
													step="0.1"
												></base-input>
											</div>
											<button
												class="btn info-button ml-3"
												role="link"
												@click="stake(poolInfo.pid, poolInfo.stakeAmount)"
											>
												Stake
											</button>
										</div>
									</div>
								</div>
							</card>
						</div>
						<div class="col-sm-5 col-12">
							<card class="h-100 mb-0">
								<div class="d-flex align-items-center justify-content-between py-1">
									<div class="d-flex flex-column h-100 justify-content-center">
										<p class="font-weight-bold text-white fs-2 m-0">Claim Rewards</p>
										<p class="font-weight-bold text-white fs-2 m-0">
											{{ poolInfo.pendingRewards.toFixed(2) }}
										</p>
									</div>
									<button
										class="btn info-button ml-3"
										role="link"
										@click="claim(poolInfo.pid, poolInfo.pendingRewards)"
									>
										Claim
									</button>
								</div>
							</card>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Card } from '@/components'
import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
import { getContractInstance as masterChefContract } from '@/services/web3/masterChef'
import { getContractInstance as erc20Contract } from '@/services/web3/erc20Token'
import { fromWei, toWei } from '@/services/web3/base'
import { ZERO_ADDRESS } from '@/constants/networks'
import BigNumber from 'bignumber.js'
import { makeBatchCall, sendTransactionAndWait } from '~/services/web3/base'
import BaseInput from '~/components/Inputs/BaseInput.vue'

export default {
	name: 'FarmDetails',
	components: {
		Card,
		BaseInput,
	},
	data() {
		return {
			farmAddress: this.$route.params.farm,
			poolsInfo: [],
			farmInfo: {
				rewardToken: '',
				rewardsPerBlock: 0,
			},
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			nativeCurrency: 'ethereum/nativeCurrency',
		}),
	},
	async mounted() {
		this.contractInstance = masterChefContract(this.farmAddress)

		// Get FarmDetail
		const methods = [
			{
				methodName: 'getFarmDetail',
				args: [this.farmAddress, this.coinbase || ZERO_ADDRESS],
			},
		]
		const [farmDetail] = await makeBatchCall(misoHelperContract(), methods)

		// FarmInfo
		this.farmInfo.rewardToken = farmDetail.farmInfo.rewardToken.symbol
		this.farmInfo.rewardsPerBlock = farmDetail.farmInfo.rewardsPerBlock

		// PoolsInfo
		farmDetail.farmInfo.pools.forEach((pool, index) => {
			const userInfo = farmDetail.userInfos[index]
			this.poolsInfo.push({
				pid: userInfo?.pid || index,
				allocPoint: pool.allocPoint,
				stakingToken: pool.stakingToken.symbol,
				stakingTokenAddress: pool.stakingToken.addr,
				totalStaked: BigNumber(fromWei(userInfo?.totalStaked || 0)),
				lpBalance: userInfo?.lpBalance || 0,
				isApproved: !BigNumber(userInfo?.lpAllowance || 0).isZero(),
				stakeAmount: 0,
				pendingRewards: BigNumber(fromWei(userInfo?.pendingRewards || 0)),
			})
		})
	},
	methods: {
		approve(pid, tokenAddress) {
			const BN = web3.utils.BN
			const method = erc20Contract(tokenAddress).methods.approve(
				this.farmAddress,
				new BN(2).pow(new BN(256)).sub(new BN(1)).toString()
			)
			sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
				if (receipt.status) {
					const pool = this.poolsInfo.find((pool) => pool.pid === pid)
					if (pool) {
						pool.isApproved = !BigNumber(
							receipt.events.Approval.returnValues[2]
						).isZero()
					}
				}
			})
		},
		stake(pid, amount) {
			if (parseFloat(amount) > 0) {
				const method = this.contractInstance.methods.deposit(
					pid,
					toWei(parseFloat(amount))
				)
				sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
					if (receipt.status) {
						const pool = this.poolsInfo.find((pool) => pool.pid === pid)
						if (pool) {
							console.log('++++++', receipt.events)
							pool.totalStaked = pool.totalStaked.plus(
								fromWei(receipt.events.Deposit.returnValues.amount)
							)
						}
					}
				})
			}
		},
		claim(pid, amount) {
			if (parseFloat(amount) > 0) {
				const method = this.contractInstance.methods.withdraw(pid, toWei(amount))
				sendTransactionAndWait(method, { from: this.coinbase }, (receipt) => {
					if (receipt.status) {
						const pool = this.poolsInfo.find((pool) => pool.pid === pid)
						if (pool) {
							pool.pendingRewards = 0
						}
					}
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.farmDetails {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: calc(100vh - 190px);
	&_token {
		display: flex;
		&.miso-border_light {
			border: none;
			@media screen and (max-width: 576px) {
				border-bottom: 1px solid;
			}
		}

		&-img {
			border-radius: 100%;
			height: 45px;
			width: 45px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	&_wrapper {
		max-width: 1400px;
	}
	.buttons {
		@media screen and (max-width: 576px) {
			margin-top: 1.5rem;
			width: 100%;
		}
	}
}
.info-button {
	border-radius: 30px;
	min-width: 90px;
	word-break: normal;
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.3);
	color: #fff;
	background-size: 210% 210%;
	background-position: top right;
	transition: all 0.2s linear;
	&:hover,
	&:focus {
		background-color: transparent !important;
		background-image: linear-gradient(
			to bottom left,
			#f46e41,
			#ba54f5,
			#f46e41
		) !important;
		color: #ffffff !important;
		transition: all 0.2s linear;
	}
	span {
		padding: 4px 0;
	}
}
.white-content .info-button {
	border: 1px solid rgba(84, 79, 79, 0.2);
	color: #000a35;
}
.miso-border_light {
	border-left: 1px solid;
	@media screen and (max-width: 576px) {
		border: none;
	}
}
</style>
