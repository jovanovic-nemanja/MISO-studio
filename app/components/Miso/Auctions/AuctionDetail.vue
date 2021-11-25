<template>
	<card header-classes="bg-transparent">
		<!--    <div slot="header" class="row align-items-center">-->
		<!--      <div class="col">-->
		<!--        <h6 class="text-uppercase text-muted ls-1 mb-1">Auction Detail</h6>-->
		<!--      </div>-->
		<!--    </div>-->
		<div>
			<div class="row">
				<div class="col-lg-7">
					<card>
						<div class="row">
							<div class="col-sm-2 text-right">
								<eth-image
									class="avatar avatar mr-2"
									:opts="{
										seed: tokenInfo.address,
										size: 10,
										scale: 5,
									}"
								/>
							</div>
							<div class="col-sm-6">
								<h6 class="text-uppercase text-muted ls-1 mb-0">Token info</h6>
								<span class="d-block h1">{{ tokenInfo.name }}</span>
							</div>
							<div class="col-sm-4 col-md-4 text-center">
								<h6 class="surtitle text-muted mb-0">Symbol</h6>
								<span class="d-block h1">{{ tokenInfo.symbol }}</span>
							</div>
						</div>
					</card>
				</div>
				<div class="col-lg-3">
					<card>
						<div class="row">
							<div class="col-sm-12">
								<h6 class="text-uppercase text-muted ls-1 mb-0">Contact Address</h6>
								<span class="d-block h3">
									{{ tokenInfo.address | shortenAddress }}
								</span>
							</div>
						</div>
					</card>
				</div>
				<!-- <div class="col-lg-2">
          <div class="row">
            <div class="col-md-12 mt-3">
              <n-link :to="`/tokens/${tokenInfo.address}`" class="float-right btn btn-outline-primary">View Token</n-link>
            </div>
          </div>
        </div> -->
				<!--        <div class="col-lg-6">-->
				<!-- <stats-card title="Token" type="gradient-default"></stats-card> -->
				<!--        </div>-->
				<div class="col-sm-6 col-lg-6">
					<card>
						<div class="row">
							<div class="col-lg-12">
								<h5 class="text-uppercase text-muted ls-1 mb-0">Start price</h5>
								<span class="d-block h2">{{ startPriceText }}</span>
							</div>
							<div class="col-lg-12 mt-2">
								<h5 class="text-uppercase text-muted ls-1 mb-0">Minimum Price</h5>
								<span class="d-block h2">{{ minPriceText }}</span>
							</div>
						</div>
					</card>
				</div>
				<div class="col-sm-6 col-lg-6">
					<card>
						<div class="row">
							<div class="col-lg-12">
								<h5 class="text-uppercase text-muted ls-1 mb-0">Clearing Price</h5>
								<span class="d-block h2">{{ clearingPriceText }}</span>
							</div>
							<div class="col-lg-12 mt-2">
								<h5 class="text-uppercase text-muted ls-1 mb-0">
									Buy remaining now price
								</h5>
								<span class="d-block h2">{{ priceAllNow }}</span>
							</div>
						</div>
					</card>
					w
				</div>
			</div>
			<card>
				<auction-chart
					:start-price="startPrice"
					:minimum-price="minimumPrice"
					:clearing-price="clearingPrice"
					:start-date="startDate"
					:end-date="endDate"
					:auction-started="auctionStarted"
					:auction-ended="auctionEnded"
					:commitments="commitments"
				></auction-chart>
				<div class="row mt-3">
					<div class="col-sm-6 col-lg-3">
						<span class="h4 text-muted">Start Date</span>
						<h4 class="text-primary">{{ format(startDate * 1000) }}</h4>
					</div>
					<div class="col-sm-6 col-lg-3">
						<span class="h4 text-muted">End Date</span>
						<h4 class="text-primary">{{ format(endDate * 1000) }}</h4>
					</div>
				</div>
			</card>
		</div>
	</card>
</template>

<script>
import IdentityPopover from '@/components/web3-core/identity-popover/IdentityPopover'
import * as moment from 'moment'
import AuctionStatus from '@/components/Miso/auctions/AuctionStatus'
import AuctionChart from '@/components/Miso/auctions/AuctionChart'
import { to18Decimals } from '@/util'
import EthImage from '../../web3-core/eth-identication/EthImage'
export default {
	components: {
		AuctionStatus,
		AuctionChart,
		IdentityPopover,
		EthImage,
	},
	props: {
		tokenInfo: {
			type: Object,
			required: true,
		},
		startDate: {
			required: true,
		},
		endDate: {
			required: true,
		},
		startPrice: {
			required: true,
		},
		minimumPrice: {
			required: true,
		},
		totalTokens: {
			required: true,
		},
		totalTokensCommitted: {
			required: true,
		},
		auctionStarted: {
			required: true,
		},
		auctionEnded: {
			required: true,
		},
		clearingPrice: {
			required: true,
		},
		shortCurrency: {
			required: true,
		},
		commitments: {
			type: Array,
			required: true,
		},
	},
	computed: {
		startPriceText() {
			return `${to18Decimals(this.startPrice)} ${this.shortCurrency}`
		},
		minPriceText() {
			return `${to18Decimals(this.minimumPrice)} ${this.shortCurrency}`
		},
		clearingPriceText() {
			return `${to18Decimals(this.clearingPrice)} ${this.shortCurrency}`
		},
		tokensRemaining() {
			return (this.totalTokens - this.totalTokensCommitted) / 10 ** 18
		},
		tokensRemainingInPercent() {
			return 100 - (this.totalTokensCommitted * 100) / this.totalTokens
		},
		priceAllNow() {
			return `${(this.tokensRemaining * this.clearingPrice) / 10 ** 18} ${
				this.shortCurrency
			}`
		},
	},
	methods: {
		format(timestamp) {
			return moment(timestamp).format('LLL')
		},
	},
}
</script>
<style lang="scss" scoped>
.btn {
	padding: 0.625rem 0.45rem;
}
</style>
