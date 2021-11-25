<template>
	<div class="progress-status" :class="{ 'boder-light': finalize }">
		<div class="w-100 h-100" :style="[isClaimed ? { opacity: 0.1 } : '']">
			<span
				class="progress-status_indicator-line d-inline-block"
				:class="[statusLightColor]"
			>
				<span
					class="progress-status_indicator-line_fill"
					:style="{ width: progress + '%' }"
					:class="[statusColor]"
				></span>

				<!-- active status text -->
				<span
					v-if="progress <= 70"
					class="progress-status_indicator-line_status"
					:style="{ left: computedProgress }"
				>
					<span
						class="d-flex flex-column align-items-baseline position-absolute pl-2"
					>
						<el-tooltip
							content="This is the current token price. (total commitments/number of tokens)"
							:open-delay="200"
							placement="top-start"
							:effect="getTooltipEffect"
						>
							<span class="font-weight-bold fs-1 no-whitespace text-uppercase">
								CURRENT TOKEN PRICE
							</span>
						</el-tooltip>
						<span class="font-weight-bold fs-3 text-white no-whitespace">
							{{ marketInfo.currentPrice }} {{ marketInfo.paymentCurrency.symbol }}
						</span>
					</span>
				</span>
				<span
					v-if="progress > 70"
					class="progress-status_indicator-line_status-bottom"
					:style="{ left: computedProgress }"
				>
					<span class="d-flex flex-column align-items-end position-absolute pl-2">
						<el-tooltip
							content="This is the current token price. (total commitments/number of tokens)"
							:open-delay="200"
							placement="top-end"
							:effect="getTooltipEffect"
						>
							<span class="font-weight-bold fs-1 no-whitespace text-uppercase">
								CURRENT TOKEN PRICE
							</span>
						</el-tooltip>
						<span class="font-weight-bold fs-3 text-white no-whitespace">
							{{ marketInfo.currentPrice }} {{ marketInfo.paymentCurrency.symbol }}
						</span>
					</span>
				</span>
				<!-- active status text -->

				<!-- start auction -->
				<span
					class="progress-status_start-dot d-inline-block miso-border"
					:class="[statusColor]"
				></span>
				<!-- start auction -->

				<!-- end auction -->
				<span
					class="progress-status_end-dot d-inline-block miso-border"
					:class="[statusColor]"
				></span>
				<!-- end auction -->
			</span>

			<!-- bottom line -->
			<span class="progress-status_bottom-line w-100 d-flex">
				<span
					v-for="line in 5"
					:key="line"
					class="position-relative progress-status_bottom-line_item"
				></span>
			</span>
			<!-- bottom line -->
		</div>
		<span
			:style="[finalize.user ? { opacity: 0.1 } : '']"
			class="
				position-absolute
				bottom-0
				fs-1
				font-weight-bold
				progress-status_start-text
			"
		>
			AUCTION START
		</span>
		<span
			:style="[finalize ? { opacity: 0.1 } : '']"
			class="
				position-absolute
				bottom-0
				fs-1
				font-weight-bold
				progress-status_end-text
			"
		>
			AUCTION END
		</span>
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
export default {
	components: {
		[Tooltip.name]: Tooltip,
	},
	mixins: [inpidatorTheme],
	props: {
		progress: {
			type: [Number, String],
			default: 0,
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
		computedProgress() {
			if (this.progress <= 70) {
				return `calc(${this.progress}% + ${6}px)`
			}
			return `calc(${this.progress}% - ${10}px)`
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
	min-height: 234px;
	height: 234px;
	border-left: 1px solid;
	border-right: 1px solid;
	position: relative;
	&_indicator-line {
		position: absolute;
		height: 4px;
		border-radius: 4px;
		top: 50%;
		left: 0;
		right: 0;
		width: 102.3%;
		transform: rotate(-12deg) translate(-1.1%, 0%);
		&_status {
			height: 60px;
			width: 1px;
			border: 1px solid;
			position: absolute;
			top: -4px;
			transform: translate(0%, -100%) rotate(11deg);
			&-bottom {
				height: 60px;
				width: 1px;
				border: 1px solid;
				position: absolute;
				bottom: -4px;
				transform: translate(0%, 100%) rotate(12deg);
				span:first-child {
					bottom: -6px;
					right: 4px;
				}
			}
			span:first-child {
				top: -6px;
			}
		}
		&_fill {
			position: absolute;
			height: 4px;
			border-radius: 4px;
			left: 0;
		}
	}
	&_start-dot {
		position: absolute;
		left: 0;
		bottom: 0;
		transform: translate(-50%, 38%);
		border: 2px solid;
		border-radius: 100%;
		height: 15px;
		width: 15px;
		z-index: 10;
	}
	&_end-dot {
		position: absolute;
		right: 0;
		top: 15%;
		transform: translate(50%, -48%);
		border: 2px solid;
		border-radius: 100%;
		height: 15px;
		width: 15px;
		z-index: 10;
	}
	&_start-text {
		left: 0;
		transform: translateY(100%);
	}
	&_end-text {
		right: 0;
		transform: translateY(100%);
	}
	&_bottom-line {
		position: absolute;
		bottom: 0;
		border-bottom: 1px solid;
		&_item {
			width: calc(100% / 5);
			&:not(:last-child) {
				transform: translateY(50%);
				border-right: 1px solid;
				height: 12px;
			}
		}
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
</style>
