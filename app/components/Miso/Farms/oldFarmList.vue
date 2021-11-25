<template>
	<div>
		<div class="hero-section mt-5 pt-2 mb-3 pb-1 text-white">
			<div class="d-flex justify-content-between">
				<p class="fs-4 fs-xs-1 fs-sm-2 pb-1 mb-0 position-relative">LIST OF FARMS</p>
				<p class="fs-4 fs-xs-1 fs-sm-2 pb-1 mb-0 position-relative">
					DISPLAYING {{ total }} of {{ total }}
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
								:fill="false"
							/>
							<select id="select1" v-model.number="perPage" class="form-control">
								<option
									v-for="item in pagination.perPageOptions"
									:key="item"
									:label="item"
									:value="item"
									class="select-primary"
								></option>
							</select>
						</base-input>
						<!-- number of item to display in table -->
					</div>
				</div>
			</div>

			<div class="col-12">
				<div class="table-section">
					<!-- <loading-main-panel /> -->
					<el-table
						v-loading="loading"
						:data="queriedData"
						border
						style="width: 100%"
					>
						<el-table-column min-width="180" label="ADDRESS">
							<div slot-scope="{ row }" class="py-2">
								<span>{{ row.address | truncate(6) }}</span>
							</div>
						</el-table-column>
						<el-table-column
							min-width="130"
							prop="name"
							label="NAME"
						></el-table-column>
						<el-table-column
							min-width="140"
							prop="symbol"
							label="SYMBOL"
						></el-table-column>
						<el-table-column prop="info" min-width="180" label="TOKEN INFO">
							<div>
								<button class="btn info-button">
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
					<span class="fs-2">Showing 1 to {{ perPage }} of {{ total }} entries</span>
					<base-pagination
						v-model="currentPage"
						class="mb-0"
						:total="total"
						:per-page="perPage"
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
// import LoadingMainPanel from "~/components/Layout/LoadingMainPanel"
import clientPaginationMixin from '~/components/Tables/PaginatedTables/clientPaginationMixin'
export default {
	components: {
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
		BaseInput,
		BasePagination,
		// LoadingMainPanel,
	},
	mixins: [clientPaginationMixin],
	data() {
		return {
			loading: true,
			searchQuery: '',
			propsToSearch: ['address', 'owner', 'farmTemplate'],
			perPage: 5,
			currentPage: 1,
			tableData: [],
		}
	},
	computed: {
		...mapGetters({
			farms: 'farms/list',
		}),
		total() {
			return this.tableData.length
		},
	},
	mounted() {
		this.getFarms()
	},
	methods: {
		...mapActions({
			setFarms: 'farms/setFarms',
		}),
		async getFarms() {
			await this.setFarms()
			this.tableData = this.farms
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
</style>

<style lang="scss">
.el-table {
	&::before,
	&::after {
		background: transparent !important;
	}
	&--border {
		border: 1px solid rgba(255, 255, 255, 0.1) !important;
	}
}
</style>
