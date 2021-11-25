<template>
	<div class="progress-status">
		<div class="w-100 h-100">
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
				<!-- <span
					v-if="progress <= 60"
					class="progress-status_indicator-line_status"
					:style="{ left: computedProgress, width: computedProctessStyle }"
				>
					<span
						class="d-flex flex-column align-items-baseline position-absolute pl-2"
					>
						<span class="font-weight-bold fs-1 no-whitespace text-uppercase">
							tokens sold
						</span>
						<span class="font-weight-bold fs-3 text-white no-whitespace">
							{{ marketInfo.commitmentsTotal }} / {{ marketInfo.totalTokens }}
						</span>
					</span>
				</span>
				<span
					v-if="progress > 60"
					class="progress-status_indicator-line_status-bottom"
					:style="{ left: computedProgress, width: computedProctessStyle }"
				>
					<span class="d-flex flex-column align-items-end position-absolute pl-2">
						<span class="font-weight-bold fs-1 no-whitespace text-uppercase">
							tokens sold
						</span>
						<span class="font-weight-bold fs-3 text-white no-whitespace">
							{{ marketInfo.commitmentsTotal }} / {{ marketInfo.totalTokens }}
						</span>
					</span>
				</span> -->
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
		</div>
		<span
			class="
				position-absolute
				font-weight-bold
				text-uppercase
				progress-status_min-raise
				d-flex
				flex-column
			"
		>
			<span class="fs-1">min raise:</span>
			<span class="text-white fs-2">
				{{ minRaise }} {{ marketInfo.paymentCurrency.symbol }}
			</span>
		</span>
		<span
			class="
				position-absolute
				font-weight-bold
				text-uppercase
				progress-status_total-raised
				d-flex
				flex-column
			"
		>
			<span class="fs-1">total raised:</span>
			<span class="text-white fs-2">
				{{ marketInfo.commitmentsTotal }} {{ marketInfo.paymentCurrency.symbol }}
			</span>
		</span>
		<span
			class="
				position-absolute
				font-weight-bold
				text-uppercase
				progress-status_current-price
				d-flex
				flex-column
			"
		>
			<span class="fs-1">auction token price:</span>
			<span class="text-white fs-2">
				{{ marketInfo.currentPrice }} {{ marketInfo.paymentCurrency.symbol }}
			</span>
		</span>
	</div>
</template>

<script>
import { inpidatorTheme } from '@/mixins/auctionIndicator'
import { toDecimalPlaces, multiplyNumbers } from '@/util'

export default {
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
	},
	computed: {
		computedProgress() {
			if (this.progress <= 60) {
				return `${this.progress}%`
			}
			return `calc(${this.progress}% - ${6}px)`
		},
		computedProctessStyle() {
			if (this.progress > 99 || this.progress < 2) {
				return 0
			}
			return '1px'
		},
		minRaise() {
			if (this.marketInfo.minimumCommitmentAmount !== '') {
				return toDecimalPlaces(
					multiplyNumbers(
						this.marketInfo.totalTokens,
						this.marketInfo.minimumCommitmentAmount
					),
					this.marketInfo.paymentCurrency.decimals
				)
			}
			return 0
		},
	},
}
</script>

<style lang="scss" scoped>
.progress-status {
	min-height: 116px;
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
		width: 101%;
		transform: rotate(-6deg) translate(-0.5%, 0%);
		&_status {
			height: 60px;
			background: rgba(255, 255, 255, 0.3);
			position: absolute;
			top: -4px;
			transform: translate(0%, -100%) rotate(6deg);
			&-bottom {
				height: 60px;
				width: 1px;
				background: rgba(255, 255, 255, 0.3);
				position: absolute;
				bottom: -4px;
				transform: translate(0%, 100%) rotate(6deg);
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
	&_min-raise {
		left: 4px;
		top: 10px;
		transform: translateY(-12%);
		@media screen and (max-width: 500px) {
			margin-top: -2px;
			span {
				&:first-child {
					font-size: 10px !important;
				}
				font-size: 10px !important;
			}
		}
	}
	&_total-raised {
		right: 6px;
		top: 10px;
		transform: translateY(-12%);
		text-align: right;
		@media screen and (max-width: 500px) {
			margin-top: -2px;
			span {
				&:first-child {
					font-size: 10px !important;
				}
				font-size: 10px !important;
			}
		}
	}
	&_current-price {
		left: 6px;
		bottom: 24px;
		transform: translateY(100%);
		background: -webkit-linear-gradient(45deg, #f05240, #ba23ab);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		@media screen and (max-width: 500px) {
			margin-top: -2px;
			span {
				&:first-child {
					font-size: 10px !important;
				}
				font-size: 10px !important;
			}
		}
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
}
</style>
