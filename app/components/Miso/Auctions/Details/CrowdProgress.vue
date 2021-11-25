<template>
	<div class="d-flex progress-status" :style="computedMargin">
		<div
			class="d-flex w-100 position-relative"
			:style="[isClaimed ? { opacity: 0.1 } : '']"
		>
			<!-- soft cap section -->
			<span
				class="progress-status_start"
				:class="[statusColor]"
				:style="{ left: startPosition + '%' }"
			>
				<span class="d-flex flex-column progress-status_text-box left">
					<span
						class="progress-status_text-line left"
						:class="[getMode ? 'bg-dark' : 'bg-light']"
					></span>
					<el-tooltip
						content="The sale needs to raise this much or more to be successful"
						:open-delay="200"
						placement="top-start"
						:effect="getTooltipEffect"
					>
						<span class="text pl-2 text-uppercase font-weight-bold">min raise</span>
					</el-tooltip>
					<span class="fs-2 pl-2 text-white font-weight-bold no-whitespace">
						{{ soft }} {{ marketInfo.paymentCurrency.symbol }}
					</span>
				</span>
			</span>
			<!-- soft cap section -->

			<span
				class="w-100 progress-status_line d-inline-block position-relative"
				:class="[statusLightColor]"
			>
				<span
					class="bg-success fill position-absolute"
					:class="[statusColor]"
					:style="{ width: progress + '%' }"
				></span>
				<span
					v-if="progress !== 0"
					class="text-box d-flex align-items-end"
					:style="{ left: computedProgess + '%' }"
				>
					<span v-if="progress > 80" class="font-weight-bold price-left text-center">
						<span class="pr-2">
							<span class="text-white">{{ marketCommitPercent }} %</span>
						</span>
						<span
							class="line-left"
							:class="[getMode ? 'bg-dark' : 'bg-light']"
						></span>
					</span>

					<span
						v-if="progress <= 80"
						class="font-weight-bold price-right text-center"
					>
						<span
							class="line-right mr-2"
							:class="[getMode ? 'bg-dark' : 'bg-light']"
						></span>
						<span class="pl-2">
							<span class="text-white">{{ marketCommitPercent }} %</span>
						</span>
					</span>
				</span>
			</span>

			<!-- hard cap section -->
			<span class="progress-status_end" :class="[statusColor]">
				<span class="d-flex flex-column progress-status_text-box right">
					<el-tooltip
						content="This is the most the auction will raise"
						:open-delay="200"
						placement="top-end"
						:effect="getTooltipEffect"
					>
						<span class="text pr-2 text-right text-uppercase font-weight-bold">
							max raise
						</span>
					</el-tooltip>
					<span class="fs-2 pr-2 text-white font-weight-bold text-right">
						{{ hard }} {{ marketInfo.paymentCurrency.symbol }}
					</span>
					<span
						class="progress-status_text-line rigth"
						:class="[getMode ? 'bg-dark' : 'bg-light']"
					></span>
				</span>
			</span>
			<!-- hard cap section -->

			<!-- token price text -->
			<span class="progress-status_token-price d-flex flex-column">
				<el-tooltip
					content="Cause it doesn't change over time, so the price now will be the same later"
					:open-delay="200"
					placement="top-start"
					:effect="getTooltipEffect"
				>
					<span class="text pl-2 text-uppercase font-weight-bold">token price</span>
				</el-tooltip>
				<span class="fs-2 pl-2 text-white font-weight-bold no-whitespace">
					{{ tokenPrice }} {{ marketInfo.paymentCurrency.symbol }}
				</span>
			</span>
			<!-- token price text -->
		</div>
		<div
			v-if="isClaimed"
			class="
				position-absolute
				finalize-box
				d-flex
				align-items-center
				justify-content-center
			"
		>
			<div class="d-flex flex-column align-items-center">
				<div class="fs-5 text-white font-weight-bold">Your tokens have been</div>
				<div class="fs-10 text-white font-weight-bold">CLAIMED</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tooltip } from 'element-ui'
import { mapGetters } from 'vuex'
import { toPrecision } from '@/util'

export default {
	components: {
		[Tooltip.name]: Tooltip,
	},
	props: {
		progress: {
			type: [Number, String],
			default: 0,
			description: 'progress in percentage',
		},
		status: {
			type: [Object],
			required: true,
		},
		marketInfo: {
			type: [Object],
			required: true,
		},
		userInfo: {
			type: [Object],
			required: true,
		},
		finalize: {
			type: Boolean,
			required: true,
		},
	},
	computed: {
		...mapGetters('theme', ['getMode']),
		startPosition() {
			return (parseInt(this.soft) * 100) / parseInt(this.hard)
		},
		activeAuction() {
			if (this.status.auction === 'live') {
				return true
			}
			return false
		},
		getTooltipEffect() {
			if (this.getMode) {
				return 'light'
			}
			return 'dark'
		},
		computedMargin() {
			if (
				this.$route.name === 'auctions-live___en' ||
				this.$route.name === 'auctions-upcoming___en' ||
				this.$route.name === 'auctions-finished___en'
			) {
				return {
					margin: '80px 0',
				}
			}
			return {
				margin: '140px 0',
			}
		},
		statusColor() {
			return {
				'bg-success': this.activeAuction,
				'bg-danger': !this.activeAuction && !this.status.auctionSuccessful,
				'bg-link': !this.activeAuction && this.status.auctionSuccessful,
			}
		},
		statusLightColor() {
			return {
				'bg-success-light': this.activeAuction,
				'bg-danger-light': !this.activeAuction && !this.status.auctionSuccessful,
			}
		},
		soft() {
			return this.marketInfo.goal
		},
		hard() {
			return this.marketInfo.totalTokens / this.marketInfo.rate
		},
		marketCommitPercent() {
			return (
				(this.marketInfo.commitmentsTotal * 100 * this.marketInfo.rate) /
				this.marketInfo.totalTokens
			).toFixed(2)
		},
		computedProgess() {
			if (this.progress > 99 && this.$route.name.includes('auctions-address')) {
				if (this.$route.name.includes('auctions-address')) {
					return this.progress - 1
				}
			} else if (this.progress > 99) {
				return this.progress - 1.5
			}

			return this.progress
		},
		tokenPrice() {
			return toPrecision(this.marketInfo.currentPrice, 5)
		},
		isClaimed() {
			const claimed = parseFloat(this.userInfo.claimed)
			const tokensClaimable = parseFloat(this.userInfo.tokensClaimable)
			return claimed > 0 && tokensClaimable === 0
		},
	},
}
</script>

<style lang="scss" scoped>
.progress-status {
	position: relative;
	.text {
		font-size: 11px;
		@media screen and (max-width: 450px) {
			font-size: 10px;
		}
	}
	&_line {
		height: 4px;
		border-radius: 4px;
		.fill {
			display: inline-block;
			height: 4px;
			border-radius: 4px;
		}
		.text-box {
			position: absolute;
			min-height: 40px;
			top: 12px;
			.line-left {
				position: absolute;
				height: 90%;
				width: 2px;
				bottom: 3px;
				right: 0;
				height: 38px;
			}
			.line-right {
				position: absolute;
				height: 90%;
				width: 2px;
				bottom: 3px;
				left: 0;
			}
			.price-left {
				transform: translateX(-100%);
				white-space: nowrap;
			}
		}
	}
	&_start {
		position: absolute;
		top: 50%;
		z-index: 99;
		transform: translate(0%, -50%);
		content: '';
		width: 15px;
		height: 15px;
		border-radius: 100%;
		border: 1px solid #fff;
	}
	&_end {
		position: absolute;
		top: 50%;
		right: 0;
		z-index: 99;
		transform: translate(0%, -50%);
		content: '';
		width: 15px;
		height: 15px;
		border-radius: 100%;
		border: 1px solid #fff;
	}
	&_token-price {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 64px;
		margin-left: 12px;
		z-index: 99;
	}
	&_text {
		&-box {
			position: absolute;
			bottom: 15px;
			width: 100px;
			height: 50px;
			@media screen and (max-width: 450px) {
				span {
					font-size: 11px;
				}
			}
			&.left {
				left: 40%;
			}
			&.right {
				right: 40%;
			}
		}
		&-line {
			content: '';
			position: absolute;
			bottom: 0;
			height: 94%;
			width: 2px;
			&.left {
				left: 0;
			}
			&.rigth {
				right: 0;
			}
		}
	}
	.bg-light {
		background: rgba(0, 10, 53, 0.2) !important;
	}
	.bg-dark {
		background: rgba(255, 255, 255, 0.2) !important;
	}
	.finalize-box {
		left: -5px;
		top: -15%;
		height: 130%;
		width: 102%;
	}
	&.boder-light {
		border-color: rgba(255, 255, 255, 0.1);
	}
}
@media screen and (max-width: 500px) {
	.price {
		font-size: 10px;
	}
}
</style>
