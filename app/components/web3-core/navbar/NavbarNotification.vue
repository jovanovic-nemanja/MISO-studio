<template>
	<base-dropdown
		:has-toggle="true"
		:corner-point="unread"
		class="nav-item"
		tag="li"
		title-classes="nav-link"
		title-tag="a"
		icon="ni ni-bell-55 text-primary"
		menu-classes="dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden text-primary"
		@dropDownToggled="handleDropDown"
	>
		<template>
			<div class="px-3 py-3">
				<h6 class="text-sm text-muted m-0">
					<span v-if="transactions.length > 0">
						You have
						<strong class="text-primary">{{ numberOfPendingTxs }}</strong>
						pending
						<span v-if="numberOfPendingTxs > 1">transactions</span>
						<span v-else>transaction</span>
						.
					</span>
					<span v-else>No transactions here yet.</span>
				</h6>
			</div>
			<div v-for="transaction in transactions" :key="transaction.transactionHash">
				<!-- Dropdown header -->
				<!-- List group -->
				<div class="list-group list-group-flush">
					<a
						:href="etherscanUrl.root + 'tx/' + transaction.transactionHash"
						target="_blank"
						class="list-group-item list-group-item-action"
					>
						<div class="row align-items-center">
							<div class="col-auto">
								<!-- Avatar -->
								<i
									class="fas"
									:class="[
										{
											'fa-check-circle text-success':
												transaction.status == 'CONFIRMED',
										},
										{ 'fa-spinner fa-spin fa-fw': transaction.status == 'PENDING' },
										{ 'fa-times-circle text-danger': transaction.status == 'FAILED' },
									]"
								/>
							</div>
							<div class="col ml--2">
								<div class="d-flex justify-content-between align-items-center">
									<div>
										<h4 class="mb-0 text-sm">
											{{ transaction.transactionHash | shortenAddress(10) }}
										</h4>
									</div>
									<div class="text-right text-muted">
										<small>{{ formatTimestamp(transaction.createdAt) }}</small>
									</div>
								</div>
								<span
									class="text-sm mb-0"
									:class="[
										{ 'text-success': transaction.status == 'CONFIRMED' },
										{ 'text-danger': transaction.status == 'FAILED' },
									]"
								>
									{{ transaction.status }}
								</span>
							</div>
						</div>
					</a>
				</div>
			</div>
			<!-- View all -->
			<a
				v-if="transactions.length > 0"
				href="#!"
				class="dropdown-item text-center text-primary font-weight-bold py-3"
			>
				View all
			</a>
		</template>
	</base-dropdown>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { format } from 'timeago.js'

export default {
	props: {
		coinbase: {
			type: String,
		},
	},
	computed: {
		...mapGetters({
			transactions: 'notification/transactions',
			unread: 'notification/unread',
			etherscanUrl: 'ethereum/explorer',
		}),
		numberOfPendingTxs() {
			return this.transactions.filter((tx) => tx.status.includes('PENDING')).length
		},
	},
	mounted() {
		if (this.coinbase) {
			this.getTransactions(this.coinbase)
		}
	},
	methods: {
		...mapActions({
			getTransactions: 'notification/getTransactions',
			setUnread: 'notification/setUnread',
		}),
		formatTimestamp(timestamp) {
			return format(timestamp)
		},
		handleDropDown() {
			this.setUnread({ coinbase: this.coinbase, status: false })
		},
	},
	watch: {
		coinbase() {
			this.getTransactions(this.coinbase)
		},
	},
}
</script>

<style></style>
