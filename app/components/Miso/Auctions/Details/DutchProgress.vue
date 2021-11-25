<template>
	<div class="d-flex progress-status" :class="{ 'boder-light': finalize }">
		<div
			class="d-flex w-100 position-relative"
			:style="[isClaimed ? { opacity: 0.1 } : '']"
		>
			<!-- starting price text -->
			<span class="position-absolute progress-status_start-price d-flex flex-column">
				<el-tooltip
					content="A Dutch auction starts high and ends low. Everyone pays the same final price."
					:open-delay="200"
					placement="top-start"
					:effect="getTooltipEffect"
				>
					<span class="font-weight-bold fs-1 text-uppercase">starting price</span>
				</el-tooltip>
				<span class="font-weight-bold text-white fs-3 text-uppercase">
					{{ marketInfo.startPrice }} {{ marketInfo.paymentCurrency.symbol }}
					<!-- 0.0005897 ETH -->
				</span>
			</span>

			<!-- starting price text -->

			<!-- reserve price text -->
			<span
				class="position-absolute progress-status_reserve-price d-flex flex-column"
			>
				<el-tooltip
					content="The auction will end when price drops to the reserve price, if not already sold out"
					:open-delay="200"
					placement="top-end"
					:effect="getTooltipEffect"
				>
					<span class="font-weight-bold fs-1 text-uppercase">RESERVE PRICE</span>
				</el-tooltip>
				<span class="font-weight-bold text-white fs-3 text-uppercase">
					{{ marketInfo.minimumPrice }} {{ marketInfo.paymentCurrency.symbol }}
				</span>
			</span>
			<!-- reserve price text -->

			<!-- current token price text -->
			<span
				class="
					position-absolute
					progress-status_current-token-price
					d-flex
					flex-column
				"
			>
				<span class="d-flex align-items-center">
					<el-tooltip
						:disabled="tokenPriceStatusColor !== 'bg-danger'"
						content="Auction is only successful if token price goes above reserve price."
						:open-delay="200"
						placement="top-start"
						:effect="getTooltipEffect"
					>
						<span
							class="radius-full token-price-status-indicator mr-2"
							:class="tokenPriceStatusColor"
						></span>
					</el-tooltip>
					<el-tooltip
						content="This is the current price per token. It is calculated from the total commitments divided by the number of tokens on sale."
						:open-delay="200"
						placement="top-start"
						:effect="getTooltipEffect"
					>
						<span class="font-weight-bold fs-1 text-uppercase">
							current token price
						</span>
					</el-tooltip>
				</span>
				<span class="font-weight-bold text-white fs-3 text-uppercase">
					{{ tokenPrice }} {{ marketInfo.paymentCurrency.symbol }}
				</span>
			</span>
			<!-- current token price text -->

			<!-- start auction text -->
			<span
				class="
					position-absolute
					progress-status_start-auction
					bottom-0
					left-0
					d-flex
					flex-column
				"
			>
				<span class="font-weight-bold pt-1 fs-1 text-uppercase">AUCTION START</span>
			</span>
			<!-- start auction text -->

			<!-- end auction text -->
			<span
				class="
					position-absolute
					progress-status_end-auction
					bottom-0
					right-0
					d-flex
					flex-column
				"
			>
				<span class="font-weight-bold pt-1 fs-1 text-uppercase">AUCTION END</span>
			</span>
			<!-- end auction text -->

			<span
				class="progress-status_line d-inline-block position-absolute dutch"
				:class="[statusLightColor]"
			>
				<span
					class="fill position-absolute"
					:class="[statusColor]"
					:style="{ width: progress + '%' }"
				></span>
				<span class="progress-status_line_left-dot" :class="[statusColor]"></span>
				<span class="progress-status_line_right-dot" :class="[statusColor]"></span>
				<span
					v-if="progress !== 0"
					class="text-box d-flex align-items-end"
					:class="{ down: progress < 28 }"
					:style="{ left: computedProgess + '%' }"
				>
					<span
						class="d-flex flex-column progress-status_current position-absolute"
						:class="[
							progress > 75
								? 'progress-status_current-left-top'
								: 'progress-status_current-right-top',
							{ 'progress-status_current-bottom-right': progress < 28 },
						]"
					>
						<span
							v-if="progress <= 75"
							class="line"
							:class="[getMode ? 'bg-dark' : 'bg-light']"
						></span>
						<span
							class="d-flex flex-column position-absolute"
							:class="[
								progress > 75 ? 'mr-2' : 'ml-2',
								progress > 28 ? 'text-top' : 'text-bottom',
							]"
						>
							<el-tooltip
								content="This is the current auction price. The auction ends successfully when the token price (total commitments/tokens) reaches this price"
								:open-delay="200"
								placement="top-end"
								:effect="getTooltipEffect"
							>
								<span class="font-weight-bold fs-1">AUCTION PRICE</span>
							</el-tooltip>
							<span class="font-weight-bold fs-3 text-white">
								{{ marketInfo.currentPrice }}
								{{ marketInfo.paymentCurrency.symbol }}
							</span>
						</span>
						<span
							v-if="progress > 75"
							class="line"
							:class="[getMode ? 'bg-dark' : 'bg-light']"
						></span>
					</span>
				</span>
			</span>
			<span class="dutch_bottom w-100 d-flex">
				<span
					v-for="item in 5"
					:key="item"
					class="dutch_bottom-line position-relative"
				></span>
			</span>
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
import { inpidatorTheme } from '@/mixins/auctionIndicator'
import { divNumbers, toPrecision } from '@/util'
import BigNumber from 'bignumber.js'

export default {
	components: {
		[Tooltip.name]: Tooltip,
	},
	mixins: [inpidatorTheme],
	props: {
		progress: {
			type: [Number, String],
			default: 0,
			description: 'progress in percentage',
		},
		status: {
			type: Object,
			required: true,
		},
		marketInfo: {
			type: [Object],
			required: true,
			currentPrice: {
				type: [Number, String],
				required: true,
			},
			startPrice: {
				type: [Number, String],
				required: true,
			},
			minimumPrice: {
				type: [Number, String],
				required: true,
			},
			totalTokens: {
				type: [Number, String],
				required: true,
			},
			commitmentsTotal: {
				type: [Number, String],
				required: true,
			},
			paymentCurrency: {
				type: [String],
				required: true,
			},
		},
		finalize: {
			type: Boolean,
			required: true,
		},
		userInfo: {
			type: [Object],
			required: true,
		},
	},
	computed: {
		getTooltipEffect() {
			if (this.getMode) {
				return 'light'
			}
			return 'dark'
		},
		computedProgess() {
			if (this.progress > 99 && this.$route.name.includes('auctions-address')) {
				if (this.$route.name.includes('auctions-address')) {
					return this.progress - 2.1
				}
			} else if (this.progress > 99) {
				return this.progress - 3.2
			}

			return this.progress
		},
		tokenPrice() {
			return toPrecision(
				divNumbers(this.marketInfo.commitmentsTotal, this.marketInfo.totalTokens),
				5
			)
		},
		tokenPriceStatusColor() {
			if (
				BigNumber(
					divNumbers(this.marketInfo.commitmentsTotal, this.marketInfo.totalTokens)
				).comparedTo(this.marketInfo.minimumPrice) < 0
			)
				return 'bg-danger'
			return 'bg-success'
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
.dutch {
	transform: rotate(20deg);

	&_bottom {
		position: absolute;
		bottom: 0;
		height: 10px;
		transform: translateY(50%);
		&-line {
			width: calc(100% / 4);
			&:not(:last-child)::after {
				content: '';
				height: 100%;
				display: block;
				right: 0;
				position: absolute;
				border-right: 1px solid;
			}

			&::before {
				content: '';
				width: 100%;
				height: 1px;
				border-bottom: 1px solid;
				display: block;
				top: 50%;
				position: absolute;
				transform: translateY(-50%);
			}
		}
	}
}

.progress-status {
	min-height: 234px;
	border-left: 1px solid;
	border-right: 1px solid;
	position: relative;
	&_start-price {
		left: 0;
		top: 0;
		margin-top: -6px;
		margin-left: 4px;
		@media screen and (max-width: 500px) {
			margin-top: -2px;
			span {
				&:first-child {
					font-size: 10px !important;
				}
				font-size: 12px !important;
			}
		}
	}
	&_reserve-price {
		right: 0;
		top: 0;
		margin-top: -6px;
		margin-right: 4px;
		text-align: right;
		@media screen and (max-width: 500px) {
			margin-top: -2px;
			span {
				&:first-child {
					font-size: 10px !important;
				}
				font-size: 12px !important;
			}
		}
	}
	&_current-token-price {
		left: 0;
		bottom: 0;
		margin-bottom: 8px;
		margin-left: 15px;
		@media screen and (max-width: 500px) {
			margin-bottom: 12px;
			span {
				&:first-child {
					font-size: 10px !important;
				}
				font-size: 12px !important;
			}
		}
	}
	&_start-auction {
		transform: translateY(100%);
		@media screen and (max-width: 500px) {
			span {
				font-size: 10px !important;
			}
		}
	}
	&_end-auction {
		transform: translateY(100%);
		@media screen and (max-width: 500px) {
			span {
				font-size: 10px !important;
			}
		}
	}
	&_current {
		top: 0;
		left: 4px;
		height: 100%;
		&-right-top {
			transform: translateX(-100%);
			text-align: left;
			height: 100%;
			.line {
				right: 0;
			}
			.text {
				right: 0;
			}
		}
		&-left-top {
			transform: translateX(-100%);
			text-align: right;
			height: 100%;
			span.text-top {
				transform: translate(-107%, 4%);
			}
			.line {
				right: 0;
			}
			.text {
				right: 0;
			}
		}
		&-bottom-right {
			left: 9px !important;
		}
		.text-top {
			top: -6px;
		}
		.text-bottom {
			bottom: 12px;
		}
		span {
			white-space: nowrap;
			@media screen and (max-width: 500px) {
				font-size: 12px !important;
			}
		}
		@media screen and (max-width: 500px) {
			.text-bottom span {
				&:first-child {
					font-size: 10px !important;
				}
				font-size: 12px !important;
			}
		}
	}
	.text {
		font-size: 11px;
		@media screen and (max-width: 450px) {
			font-size: 10px;
		}
	}
	&_line {
		height: 4px;
		border-radius: 4px;
		background: hsla(142, 19%, 23%, 0.741);
		top: 50%;
		left: 0;
		right: 0;
		width: 103.3%;
		transform: translateX(-1.6%) rotate(9deg);
		&_left-dot {
			position: absolute;
			content: '';
			z-index: 50;
			left: 0;
			top: 50%;
			border: 2px solid rgb(0, 10, 53);
			height: 15px;
			width: 15px;
			display: block;
			transform: translateY(-50%);
			border-radius: 100%;
		}
		&_right-dot {
			position: absolute;
			content: '';
			z-index: 50;
			right: 0;
			top: 50%;
			border: 2px solid rgb(0, 10, 53);
			height: 15px;
			width: 15px;
			display: block;
			transform: translateY(-50%);
			border-radius: 100%;
		}
		.fill {
			display: inline-block;
			height: 4px;
			border-radius: 4px;
		}
		.text-box {
			position: absolute;
			height: 75px;
			top: 0;
			transform: translateY(-85%) rotate(-9deg);
			&.down {
				transform: translate(5px, 10px) rotate(-9deg);
			}
			.line {
				position: absolute;
				top: 0;
				height: 78%;
				width: 2px;
			}
		}
	}
	&_start {
		position: absolute;
		top: 50%;
		z-index: 99;
		transform: translate(0%, -50%);
		content: '';
		background: #95ce22;
		width: 8px;
		height: 8px;
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
		background: #95ce22;
		width: 8px;
		height: 8px;
		border-radius: 100%;
		border: 1px solid #fff;
	}
	&_text {
		&-box {
			position: absolute;
			bottom: 10px;
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

.token-price-status-indicator {
	height: 12px;
	width: 12px;
	display: block;
}

@media screen and (max-width: 500px) {
	.price {
		font-size: 10px;
	}
}
</style>
