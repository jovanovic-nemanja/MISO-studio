<template>
	<div>
		<div class="d-flex align-items-center py-3">
			<p class="fs-5 py-0 font-weight-bold d-flex mb-0">Tokens Deployed on MISO</p>
			<span
				class="
					tokenNumber
					ml-2
					d-flex
					justify-content-center
					align-items-center
					font-weight-bold
					px-3
					fs-1
					py-0
					radius-md
				"
			>
				{{ total }}
			</span>
		</div>
		<div class="hero-section pt-2 mb-3 pb-1 text-white">
			<div class="d-flex justify-content-between">
				<p class="fs-4 fs-xs-1 fs-sm-2 pb-1 mb-0 position-relative">LIST OF TOKENS</p>
				<p class="fs-4 fs-xs-1 fs-sm-2 pb-1 mb-0 position-relative">
					DISPLAYING {{ startItem }} to {{ endItem }} of {{ total }}
				</p>
			</div>
		</div>
		<div class="row no-gutters w-100">
			<div class="col-md-4 col-sm-5 col-12">
				<base-input
					v-model="searchQuery"
					addon-left-icon="tim-icons icon-zoom-split"
					placeholder="search tokens..."
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
						<div class="select_wrapper">
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
						</div>
						<!-- number of item to display in table -->
					</div>
				</div>
			</div>

			<div class="col-12">
				<div class="table-section">
					<!-- <loading-main-panel /> -->
					<loader v-if="loading" width="80" height="80" y="250" />
					<el-table :data="queriedData">
						<el-table-column min-width="100">
							<div slot-scope="{ row }" class="token-img mr-2">
								<img :src="computedTokenImg(row.icon)" class="img-fluid" />
							</div>
						</el-table-column>
						<el-table-column min-width="130" label="NAME">
							<div slot-scope="{ row }">
								<span class="text-white font-weight-bold">{{ row.name }}</span>
							</div>
						</el-table-column>
						<el-table-column min-width="140" label="SYMBOL">
							<div slot-scope="{ row }">
								<span class="text-white font-weight-bold">{{ row.symbol }}</span>
							</div>
						</el-table-column>
						<el-table-column min-width="370" label="Address">
							<div slot-scope="{ row }" class="py-2">
								<span>{{ row.addr }}</span>
								<svg-icon
									class="cursor-pointer"
									icon="copy"
									height="20"
									width="20"
									color="#F46E41"
									:fill="false"
									@click="copyToClipboard(row.addr)"
								/>
							</div>
						</el-table-column>
						<el-table-column min-width="180" label="TOKEN INFO" header-align="center">
							<div slot-scope="{ row }" class="d-flex justify-content-center">
								<button class="btn info-button" @click="ethLink(row.addr)">
									<span class="fs-2">View Info</span>
								</button>
							</div>
						</el-table-column>
					</el-table>
				</div>
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
						:show-arrows="false"
						:per-page="pagination.perPage"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Table, TableColumn } from 'element-ui'
import { BaseInput, BasePagination } from '@/components'
import { EXPLORERS } from '@/constants/networks'
// import LoadingMainPanel from "~/components/Layout/LoadingMainPanel"
import { theme } from '@/mixins/theme'
import clientPaginationMixin from '~/components/Tables/PaginatedTables/clientPaginationMixin'

export default {
	components: {
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
		BaseInput,
		BasePagination,
		// LoadingMainPanel,
	},
	mixins: [clientPaginationMixin, theme],
	data() {
		return {
			loading: true,
			searchQuery: '',
			propsToSearch: ['token', 'name', 'symbol'],
			tableData: [],
		}
	},
	computed: {
		...mapGetters({ tokens: 'tokens/list', networkId: 'ethereum/networkId' }),
		total() {
			return this.tableData.length
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
		this.initTokens()
	},
	methods: {
		...mapActions({
			getTokens: 'tokens/getTokens',
		}),
		computedTokenImg(link) {
			if (link) {
				return link
			}
			return require('static/s3/img/token_placeholder.png')
		},
		// copy data to clipboard on click & display message
		copyToClipboard(value) {
			navigator.clipboard.writeText(value).then(() => {
				this.$notify({
					type: 'success',
					verticalAlign: 'bottom',
					horizontalAlign: 'right',
					message: 'successfully copied to clipboard!',
				})
			})
		},
		ethLink(addr) {
			const url = EXPLORERS[this.networkId].explorer.root + 'token/' + addr
			window.open(url, '_blank').focus()
		},
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
		async initTokens() {
			await this.getTokens()
			this.tableData = this.tokens
			this.loading = false
		},
	},
}
</script>

<style lang="scss" scoped>
.tokenNumber {
	background: rgba(246, 102, 69, 0.4);
	color: white;
}
.token-img {
	height: 45px;
	width: 45px;
}
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
		bottom: 18px;
		right: 12px;
	}
}
#select1 {
	position: relative;
	appearance: none;
}
.white-content .table-section .info-button {
	border: 1px solid rgba(0, 0, 0, 0.3) !important;
	color: #000a35;
}
.padination-wrapper {
	border-top: 1px solid;
	border-color: rgba(255, 255, 255, 0.2);
}

.table-section {
	.status-marker {
		height: 10px;
		width: 10px;
		border-radius: 100%;
	}
	.info-button {
		border-radius: 30px;
		min-width: 150px;
		word-break: normal;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.3) !important;
		color: #fff;
		background-size: 210% 210%;
		background-position: top right;
		transition: all 0.1s ease-in;
		&:hover,
		&:focus,
		&:active {
			background-color: transparent !important;
			background-image: linear-gradient(
				to bottom left,
				#f46e41,
				#ba54f5,
				#f46e41
			) !important;
			color: #ffffff !important;
			transform: translateY(0);
			transition: all 0.1s ease-out;
		}
		span {
			padding: 4px 0;
		}
	}
}
.white-content .table-section .info-button {
	border: 1px solid rgba(0, 0, 0, 0.3) !important;
	color: #000a35;
}
.progress-line {
	border-radius: 4px;
	background: rgb(235, 66, 62);
	background: linear-gradient(
		90deg,
		rgba(235, 66, 62, 1) 0%,
		rgba(244, 95, 75, 1) 23%,
		rgba(237, 68, 34, 1) 49%,
		rgba(233, 59, 105, 1) 77%,
		rgba(181, 52, 156, 1) 100%
	);
	height: 4px;
	box-shadow: none;
}
.select-arrow {
	z-index: 999;
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
}
</style>
