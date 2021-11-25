<template>
	<stats-card>
		<div class="row">
			<div class="col">
				<div v-if="auctionEnded">
					<h5 class="card-title text-uppercase mb-0 text-muted">Status</h5>
					<span class="h3">Auction has ended.</span>
				</div>
				<div v-else-if="isAuctionStarted" class="h3">
					<h5 class="card-title text-uppercase mb-0 text-muted">Time remaining</h5>
					<span>{{ timeRemaining.days }}D</span>
					<span>{{ timeRemaining.hours }}H :</span>
					<span>{{ timeRemaining.minutes }}M :</span>
					<span>{{ timeRemaining.seconds }}S</span>
					<p class="mt-3 mb-0 text-sm">
						<base-progress
							show-label
							type="primary"
							:height="8"
							:value="tokensRemainingInPercent"
						>
							<template slot="label">
								<span>Tokens Remaining</span>
							</template>
							<template>
								<span>
									{{ tokensRemaining }} {{ tokenSymbol }} ({{
										tokensRemainingInPercent
									}}%)
								</span>
							</template>
						</base-progress>
					</p>
				</div>

				<div v-else class="h3">
					<h5 class="card-title text-uppercase mb-0 text-muted">Auction starts in</h5>
					<span>{{ startsAt.days }}D :</span>
					<span>{{ startsAt.hours }}H :</span>
					<span>{{ startsAt.minutes }}M :</span>
					<span>{{ startsAt.seconds }}S</span>
				</div>
			</div>
		</div>
	</stats-card>
</template>

<script>
import { duration } from 'moment'

export default {
	props: {
		startDate: {
			required: true,
		},
		endDate: {
			required: true,
		},
		totalTokens: {
			required: true,
		},
		totalTokensCommitted: {
			required: true,
		},
		auctionEnded: {
			type: Boolean,
			required: true,
		},
		auctionSuccessful: {
			type: Boolean,
		},
		tokenSymbol: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			now: new Date(),
		}
	},
	computed: {
		tokensRemaining() {
			return (this.totalTokens - this.totalTokensCommitted) / 10 ** 18
		},
		tokensRemainingInPercent() {
			const percent = 100 - (this.totalTokensCommitted * 100) / this.totalTokens
			return Math.round(percent * 100) / 100
		},
		isAuctionStarted() {
			return this.now > this.startDate * 1000
		},
		timeRemaining() {
			const remaining = duration(this.endDate * 1000 - this.now)
			return {
				days: remaining.days(),
				hours: remaining.hours(),
				minutes: remaining.minutes(),
				seconds: remaining.seconds(),
			}
		},
		startsAt() {
			const startDate = duration(this.startDate * 1000 - this.now)

			return {
				days: startDate.days(),
				hours: startDate.hours(),
				minutes: startDate.minutes(),
				seconds: startDate.seconds(),
			}
		},
	},
	mounted() {
		if (!this.auctionEnded) {
			this.auctionTimeInterval = this.refreshAuctionTime()
		}
	},
	beforeDestroy() {
		clearInterval(this.auctionTimeInterval)
	},
	methods: {
		refreshAuctionTime() {
			return setInterval(() => {
				this.now = new Date()
			}, 1000)
		},
	},
}
</script>

<style></style>
