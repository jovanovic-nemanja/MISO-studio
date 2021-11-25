<template>
	<div class="container-fluid">
		<div class="hero-section mt-5 pt-2 mb-3 pb-1 text-white">
			<div class="d-flex justify-content-between">
				<p class="fs-4 fs-xs-1 fs-sm-2 pb-1 mb-0 position-relative">
					LIST OF AUCTIONS
				</p>
				<p class="fs-4 fs-xs-1 fs-sm-2 pb-1 mb-0 position-relative">
					DISPLAYING 10 of 9
				</p>
			</div>
		</div>
		<div class="row no-gutters w-100">
			<div class="col-md-4 col-sm-5 col-12">
				<base-input
					v-model="searchQuery"
					addon-left-icon="tim-icons icon-zoom-split"
					placeholder="Search auctions..."
				></base-input>
			</div>
			<div class="col-md-8 col-sm-5 col-12">
				<div class="row no-gutters">
					<div
						class="
							col-xl-3
							offset-xl-9
							col-lg-4
							offset-lg-8
							col-md-4
							offset-md-8
							col-sm-10
							offset-sm-7
						"
					>
						<!-- number of item to display in table -->
						<base-input class="select-input position-relative">
							<svg-icon
								class="select-arrow"
								icon="menu-down"
								height="11"
								width="11"
								:color="computedIconColor"
								:fill="false"
							/>
							<select
								id="select1"
								v-model.number="pagination.perPage"
								class="form-control"
							>
								<option
									v-for="item in pagination.perPageOptions"
									:key="item"
									:label="item"
									:value="item"
								>
									{{ item }}
								</option>
							</select>
						</base-input>
						<!-- number of item to display in table -->
					</div>
				</div>
			</div>
			<div class="col-12">
				<!-- auction list -->
				<auction-list v-if="!loading" class="mt-3" :list-data="queriedData" />
				<loader v-else width="80" height="80" y="150" />
				<!-- pagination with settings -->
				<div
					class="
						padination-wrapper
						d-flex
						align-items-center
						justify-content-between
						pt-4
					"
				>
					<span class="fs-2">
						Showing {{ startItem }} to {{ endItem }} of {{ total }} entries
					</span>
					<base-pagination
						v-model="pagination.currentPage"
						class="mb-0"
						:total="total"
						:per-page="pagination.perPage"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BaseInput, BasePagination } from '@/components'
import AuctionList from '~/components/Miso/Auctions/AuctionList'
import clientPaginationMixin from '~/components/Tables/PaginatedTables/clientPaginationMixin'

export default {
	components: {
		BaseInput,
		BasePagination,
		AuctionList,
	},
	mixins: [clientPaginationMixin],
	data() {
		return {
			searchQuery: '',
			propsToSearch: ['address', 'name', 'symbol'],
			tableData: [],
			loading: true,
		}
	},
	computed: {
		...mapGetters({ auctions: 'auctions/list' }),
		...mapGetters('theme', ['getMode']),
		computedIconColor() {
			if (this.getMode) {
				return '#ffffff #ffffff'
			}
			return '#000000 #000000'
		},
		startItem() {
			if (this.pagination.currentPage === 1) {
				return 1
			}
			return 1 + (this.pagination.currentPage - 1) * this.pagination.perPage
		},
		endItem() {
			const endItem = this.pagination.currentPage * this.pagination.perPage
			if (endItem > this.total) {
				return this.total
			}
			return endItem
		},
	},
	mounted() {
		this.initAuctions()
	},
	methods: {
		...mapActions({
			getAuctions: 'auctions/getAuctions',
		}),
		getPeriodValue(row) {
			const dateStart = new Date(row.startDate)
			const dateEnd = new Date(row.endDate)
			const dateNow = new Date()

			const fullPeriod = Math.ceil(Math.abs(dateEnd - dateStart) / (60 * 1000))
			const periodForNow = Math.ceil(Math.abs(dateNow - dateStart) / (60 * 1000))

			const res = (periodForNow * 100) / fullPeriod

			if (row.status === 'finished') {
				return 100
			} else if (row.status === 'not started') {
				return 0
			} else {
				return res
			}
		},
		async initAuctions() {
			await this.getAuctions()
			this.tableData = this.auctions
			this.loading = false
		},
	},
}
</script>

<style lang="scss" scoped>
.hero-section {
	div {
		position: relative;
		&::after {
			content: '';
			position: absolute;
			display: inline-block;
			width: 100%;
			left: 0;
			bottom: 0;
			height: 3px;
		}
		p::after {
			content: '';
			position: absolute;
			display: inline-block;
			width: 100%;
			left: 0;
			bottom: 0;
			height: 3px;
		}
	}
}
.select {
	&-arrow {
		position: absolute;
		z-index: 10;
		bottom: 50%;
		right: 12px;
		transform: translateY(50%);
	}
}
#select1 {
	position: relative;
	appearance: none;
}
.table-section {
	.status-marker {
		height: 10px;
		width: 10px;
		border-radius: 100%;
	}
	.info-button {
		padding: 12px 48px;
		border-radius: 30px;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.3) !important;
		color: #fff;
		transition: all 0.2s linear;
		&:hover {
			background: linear-gradient(
				90deg,
				#f04a27 0%,
				#f67440 50%,
				#ec4422 100%
			) !important;
			color: #fff !important;
			transform: translateY(0);
			transition: all 0.2s linear;
		}
	}
}
.white-content .table-section .info-button {
	border: 1px solid rgba(0, 0, 0, 0.3) !important;
	color: #000a35;
}
.padination-wrapper {
	border-top: 1px solid;
	border-color: rgba(255, 255, 255, 0.2);
}
</style>
