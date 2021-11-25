<template>
	<div class="d-flex progress-status">
		<div class="d-flex w-100 position-relative">
			<!-- starting price text -->
			<span class="position-absolute progress-status_start-price d-flex flex-column">
				<span class="font-weight-bold fs-1 text-uppercase">starting price:</span>
				<span class="font-weight-bold text-white fs-2 text-uppercase">
					{{ marketInfo.startPrice }} {{ marketInfo.paymentCurrency.symbol }}
					<!-- 0.0005897 ETH -->
				</span>
			</span>
			<!-- starting price text -->

			<!-- total raised text -->
			<span class="position-absolute progress-status_total-raised d-flex flex-column">
				<span class="font-weight-bold fs-1 text-uppercase">total raised:</span>
				<span class="font-weight-bold text-white fs-2 text-uppercase">
					{{ marketInfo.commitmentsTotal }} {{ marketInfo.paymentCurrency.symbol }}
				</span>
			</span>
			<!-- total raised text -->

			<!-- reserve price text -->
			<span
				class="position-absolute progress-status_reserve-price d-flex flex-column"
			>
				<span class="font-weight-bold fs-1 text-uppercase">RESERVE PRICE:</span>
				<span class="font-weight-bold text-white fs-2 text-uppercase">
					{{ marketInfo.minimumPrice }} {{ marketInfo.paymentCurrency.symbol }}
				</span>
			</span>
			<!-- reserve price text -->

			<!-- current price text -->
			<span
				class="position-absolute progress-status_current-price d-flex flex-column"
			>
				<span class="font-weight-bold fs-1 text-uppercase">auction token price:</span>
				<span class="font-weight-bold text-white fs-2 text-uppercase">
					{{ marketInfo.currentPrice }} {{ marketInfo.paymentCurrency.symbol }}
				</span>
			</span>
			<!-- current price text -->

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
				<!-- <span
					v-if="progress !== 0"
					class="text-box d-flex align-items-end"
					:class="{ down: progress < 32 }"
					:style="{ left: computedProgess + '%' }"
				>
					<span
						class="d-flex flex-column progress-status_current position-absolute"
						:class="[
							progress > 75
								? 'progress-status_current-left-top'
								: 'progress-status_current-right-top',
							{ 'progress-status_current-bottom-right': progress < 32 },
						]"
					>
						<span
							v-if="progress <= 75"
							class="line"
							:class="[getMode ? 'bg-dark' : 'bg-light']"
							:style="{ width: computedProctessStyle }"
						></span>
						<span
							class="d-flex flex-column position-absolute"
							:class="[
								progress > 75 ? 'mr-2' : 'ml-2',
								progress > 32 ? 'text-top' : 'text-bottom',
							]"
						>
							<span class="font-weight-bold fs-1">CURRENT PRICE</span>
							<span class="font-weight-bold fs-2 text-white">
								{{ marketInfo.currentPrice }}
								{{ marketInfo.paymentCurrency.symbol }}
							</span>
						</span>
						<span
							v-if="progress > 75"
							class="line"
							:class="[getMode ? 'bg-dark' : 'bg-light']"
							:style="{ width: computedProctessStyle }"
						></span>
					</span>
				</span> -->
			</span>
		</div>
	</div>
</template>

<script>
import { inpidatorTheme } from '@/mixins/auctionIndicator'
export default {
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
			paymentCurrency: {
				type: [String],
				required: true,
			},
		},
	},
	computed: {
		computedProgess() {
			if (this.progress > 99 && this.$route.name.includes('auctions-address')) {
				if (this.$route.name.includes('auctions-address')) {
					return this.progress - 2.1
				}
			} else if (this.progress > 99) {
				return this.progress - 2.2
			}
			return this.progress - 2
		},
		computedProctessStyle() {
			if (this.progress > 99 || this.progress < 1) {
				return 0
			}
			return '1px'
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
	min-height: 116px;
	border-left: 1px solid;
	border-right: 1px solid;
	&_start-price {
		left: 0;
		top: 0;
		margin-top: -4px;
		margin-left: 4px;
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
		right: 0;
		top: 0;
		margin-top: -4px;
		margin-right: 4px;
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
	&_reserve-price {
		right: 0;
		bottom: -8px;
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
	&_current-price {
		left: 0;
		bottom: -10px;
		margin-bottom: -24px;
		margin-left: 4px;
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
			top: -1px;
		}
		.text-bottom {
			bottom: 12px;
		}
		span {
			white-space: nowrap;
			@media screen and (max-width: 500px) {
				font-size: 11px !important;
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
		width: 100.5%;
		transform: translateX(0%) rotate(6deg);
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
			transform: translate(-50%, -50%);
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
			transform: translate(50%, -50%);
			border-radius: 100%;
		}
		.fill {
			display: inline-block;
			height: 4px;
			border-radius: 4px;
		}
		.text-box {
			position: absolute;
			height: 60px;
			top: 0;
			transform: translateY(-85%) rotate(-6deg);
			&.down {
				transform: translate(5px, 10px) rotate(-6deg);
			}
			.line {
				position: absolute;
				top: 0;
				height: 72%;
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
}
@media screen and (max-width: 500px) {
	.price {
		font-size: 10px;
	}
}
@media screen and (min-width: 1200px) and (max-width: 1400px) {
	.fs {
		&-1 {
			font-size: 9px !important;
		}
		&-2 {
			font-size: 12px !important;
		}
	}
}
.fs-1 {
	font-size: 10px !important;
}
</style>
