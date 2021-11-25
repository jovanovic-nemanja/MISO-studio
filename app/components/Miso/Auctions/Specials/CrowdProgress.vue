<template>
	<div class="d-flex progress-status">
		<div class="d-flex w-100 position-relative">
			<!-- soft cap section -->
			<span
				class="progress-status_start"
				:class="[statusColor]"
				:style="{ left: startPosition + '%' }"
			>
				<span
					v-if="isNaN(startPosition) || startPosition < 50"
					class="d-flex flex-column progress-status_text-box left"
				>
					<span class="text pl-2 text-uppercase font-weight-bold">min raise:</span>
					<span class="fs-2 pl-2 text-white font-weight-bold no-whitespace">
						{{ soft }} {{ marketInfo.paymentCurrency.symbol }}
					</span>
					<span
						class="progress-status_text-line left"
						:class="[getMode ? 'bg-dark' : 'bg-light']"
					></span>
				</span>
				<span
					v-else
					class="d-flex flex-column progress-status_text-box right"
					:style="{ textAlign: 'right' }"
				>
					<span class="text pr-2 text-uppercase font-weight-bold">min raise:</span>
					<span class="fs-2 pr-2 text-white font-weight-bold no-whitespace">
						{{ soft }} {{ marketInfo.paymentCurrency.symbol }}
					</span>
					<span
						class="progress-status_text-line right"
						:class="[getMode ? 'bg-dark' : 'bg-light']"
						:style="{ right: 0 }"
					></span>
				</span>
			</span>
			<!-- soft cap section -->

			<span
				class="w-100 progress-status_line d-inline-block position-relative"
				:class="[statusLightColor]"
			>
				<span
					class="
						d-flex
						flex-column
						progress-status_text-box
						left
						text-uppercase
						font-weight-bold
						current-price
					"
					:style="{ left: 0, top: '53px' }"
				>
					<span class="text pl-2 fs-1">auction token price:</span>
					<span class="text-white pl-2 fs-2">
						{{ salePrice }}
					</span>
				</span>
				<span
					class="bg-success fill position-absolute"
					:class="[statusColor]"
					:style="{ width: progress + '%' }"
				></span>
				<span
					v-if="progress !== 0"
					class="text-box d-flex align-items-end"
					:style="{
						left: computedProgess + '%',
						transform: `translateX(${computedProctessStyle})`,
					}"
				>
					<span v-if="progress > 51" class="font-weight-bold price-left">
						<span class="pr-2 d-flex">
							<!-- <div class="d-flex flex-column">
								<span class="text pr-2 text-uppercase fs-1">Sale Price:</span>
								<span class="text-white pr-2 text-uppercase fs-1">
									{{ salePrice }}
								</span>
							</div> -->
							<div class="d-flex flex-column">
								<span class="text pl-2 text-right text-uppercase fs-1">
									total raised:
								</span>
								<span class="pl-2 fs-1 text-white text-right">
									{{ marketInfo.commitmentsTotal }}
									{{ marketInfo.paymentCurrency.symbol }}
								</span>
							</div>
						</span>
						<span
							class="line-left"
							:class="[getMode ? 'bg-dark' : 'bg-light']"
						></span>
					</span>

					<span v-else class="font-weight-bold price-right">
						<span
							class="line-right mr-2"
							:class="[getMode ? 'bg-dark' : 'bg-light']"
						></span>
						<span class="pl-2 d-flex">
							<!-- <div class="d-flex flex-column">
								<span class="text pr-2 text-uppercase fs-1">Sale Price:</span>
								<span class="text-white text-uppercase pr-2 fs-1">
									{{ salePrice }}
								</span>
							</div> -->
							<div class="d-flex flex-column">
								<span class="text pr-2 text-left text-uppercase fs-1">
									total raised:
								</span>
								<span class="pr-2 fs-1 text-white text-left">
									{{ marketInfo.commitmentsTotal }}
									{{ marketInfo.paymentCurrency.symbol }}
								</span>
							</div>
						</span>
					</span>
				</span>
			</span>

			<!-- hard cap section -->
			<span class="progress-status_end" :class="[statusColor]">
				<span class="d-flex flex-column progress-status_text-box right">
					<span class="text pr-2 text-right text-uppercase font-weight-bold">
						max raise:
					</span>
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
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toPrecision } from '@/util/index'
export default {
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
		tokenInfo: {
			type: [Object, Array],
			required: true,
		},
		marketInfo: {
			type: [Object],
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
				'bg-link': !this.activeAuction && this.status.auctionSuccessful,
			}
		},
		salePrice() {
			return `${toPrecision(this.marketInfo.rate, 5)} 
				${this.textCheck(this.marketInfo.paymentCurrency.symbol)}`
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
		computedProctessStyle() {
			if (this.progress < 2) {
				return '6px'
			}
			return 0
		},
	},
	methods: {
		textCheck(str, val) {
			const pattern = /^[()\s0-9a-zA-Z.,/$#:&_-]+$/
			if (str.match(pattern)) {
				return str
			} else {
				return `${val} price`
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.progress-status {
	padding: 110px 0 52px 0;
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
				width: 1px;
				bottom: 3px;
				right: 0;
				height: 38px;
			}
			.line-right {
				position: absolute;
				height: 90%;
				width: 1px;
				bottom: 3px;
				left: 0;
			}
			.price-left {
				margin-top: 8px;
				transform: translateX(-100%);
				white-space: nowrap;
			}
			.price-right {
				margin-top: 8px;
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
		.progress-status_text-box {
			bottom: 65px !important;
		}
	}
	&_text {
		&-box {
			position: absolute;
			bottom: 15px;
			width: 250px;
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
			width: 1px;
			&.left {
				left: 0;
			}
			&.rigth {
				right: 0;
				bottom: -50px;
				height: calc(94% + 50px);
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
.fs-1 {
	font-size: 10px !important;
}
.current-price {
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
</style>
