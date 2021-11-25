<template>
	<card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
		<template slot="header">
			<!-- <div class="border-0 card-header"> -->
			<div class="row align-items-center">
				<h4 class="mb-0 ml-3 mt-3 font-weight-bold text-uppercase">Commitments</h4>
			</div>
		</template>
		<div>
			<div class="col-12 d-flex justify-content-between flex-wrap mb-3">
				<el-select
					v-model="pagination.perPage"
					class="select-primary pagination-select rowperPageWidth"
					placeholder="Per page"
				>
					<el-option
						v-for="item in pagination.perPageOptions"
						:key="item"
						class="select-primary"
						:label="item"
						:value="item"
					></el-option>
				</el-select>
				<div v-if="coinbase">
					<base-switch
						v-model="isAll"
						on-text="ALL"
						off-text="MY"
						type="primary"
						@input="handleSwitch($event)"
					></base-switch>
				</div>
			</div>
			<el-table
				ref="tableRef"
				class="table-responsive table-flush"
				:data="queriedData"
				row-key="id"
				header-row-class-name="thead"
				@sort-change="sortChange"
			>
				<el-table-column
					v-for="(column, index) in columns"
					:key="index"
					:label="column.label"
					:min-width="column.width"
					:prop="column.address"
					:sortable="column.sortable"
				>
					<template v-if="column.label === 'Address'" #default="{ row }">
						<eth-image
							class="avatar avatar-xs mr-2"
							:opts="{
								seed: row.address,
								size: 10,
								scale: 5,
							}"
						/>
						<span>{{ shortenAddress(row.address) }}</span>
					</template>
					<template
						v-else-if="column.label === 'Amount Committed'"
						#default="{ row }"
					>
						<span>{{ row.amount }} {{ shortCurrency }}</span>
					</template>
					<template
						v-else-if="column.label === 'Tokens Claimable'"
						#default="{ row }"
					>
						<span>
							{{ row.amount / currentPrice }}
						</span>
					</template>
					<template v-else-if="column.label === 'Tx Hash'" #default="{ row }">
						<a :href="`${txUrl}${row.txHash}`" target="_blank">
							{{ shortenAddress(row.txHash) }}
						</a>
					</template>
					<template v-else-if="column.label === 'Block Number'" #default="{ row }">
						<span>{{ row.timestamp }}</span>
					</template>
				</el-table-column>
			</el-table>

			<div class="col-12 d-flex justify-content-end flex-wrap mb-3 downloadCSV">
				<download-excel
					class="btn mr-3"
					:data="json_data"
					:fields="json_fields"
					worksheet="Commitments"
					name="commitments.xls"
				>
					Download CSV
				</download-excel>
			</div>
		</div>
		<div
			slot="footer"
			class="
				col-12
				d-flex
				justify-content-center justify-content-sm-between
				flex-wrap
				pagination-area
			"
		>
			<div class>
				<p class="card-category">
					Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
				</p>
			</div>
			<base-pagination
				v-model="pagination.currentPage"
				class="pagination-no-border"
				:per-page="pagination.perPage"
				:total="total"
			></base-pagination>
		</div>
	</card>
</template>

<script>
import { mapGetters } from 'vuex'
import { Table, TableColumn, Select, Option } from 'element-ui'
import EthImage from '@/components/web3-core/eth-identication/EthImage.vue'
import * as moment from 'moment'
import { shortenAddress } from '@/util'
import clientPaginationMixin from '@/components/Tables/PaginatedTables/clientPaginationMixin'
import { BasePagination, BaseSwitch } from '@/components'
import JsonExcel from 'vue-json-excel'

export default {
	components: {
		[Select.name]: Select,
		[Option.name]: Option,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
		EthImage,
		BasePagination,
		BaseSwitch,
		DownloadExcel: JsonExcel,
	},
	mixins: [clientPaginationMixin],
	props: {
		commitments: {
			type: Array,
			required: true,
		},
		shortCurrency: {
			type: String,
			required: true,
		},
		totalTokens: {
			type: String,
			required: true,
		},
		totalTokensCommitted: {
			type: [String, Number],
			required: true,
		},
		currentPrice: {
			type: String,
			required: true,
		},
		// minimumPrice: {
		// 	type: String,
		// 	required: true,
		// },
	},
	data() {
		return {
			isAll: true,
			tableData: [],
			json_fields: {
				address: 'address',
				amount: 'amount',
				claimable: 'claimable',
				txHash: 'txHash',
			},
			json_data: [],
			columns: [
				{
					label: 'Address',
					width: '200px',
					address: 'address',
					sortable: false,
				},
				{
					label: 'Amount Committed',
					width: '150px',
					address: 'commitment',
					sortable: false,
				},
				{
					label: 'Tokens Claimable',
					width: '130px',
					address: 'totalTokens',
					sortable: false,
				},
				{
					label: 'Tx Hash',
					width: '100px',
					address: 'txHash',
					sortable: false,
				},
				{
					label: 'Block Number',
					width: '100px',
					address: 'timestamp',
					sortable: true,
				},
			],
		}
	},
	computed: {
		...mapGetters({
			txUrl: 'ethereum/txUrl',
			coinbase: 'ethereum/coinbase',
		}),
	},
	watch: {
		coinbase() {
			this.handleSwitch(this.isAll)
		},
		commitments(data) {
			this.setTableData(data)
		},
	},
	mounted() {
		this.setTableData(this.commitments)
	},
	methods: {
		shortenAddress(addr) {
			return shortenAddress(addr, 8)
		},
		formatTimestamp(timestamp) {
			return `${moment(timestamp).format('MM/DD/YYYY LT')}`
		},
		setTableData(data) {
			this.tableData = data

			data.forEach((element) => {
				this.json_data.push({
					address: element.address,
					amount: element.amount,
					claimable: element.amount / this.currentPrice,
					txHash: element.txHash,
				})
			})
		},
		handleSwitch(isAll) {
			if (isAll) {
				this.setTableData(this.commitments)
			} else {
				const currentAccountCommitments = this.commitments.filter(
					(commitment) =>
						commitment.address.toLowerCase() === this.coinbase.toLowerCase()
				)
				this.setTableData(currentAccountCommitments)
			}
		},
	},
}
</script>

<style>
@media screen and (max-width: 768px) {
	div.table-responsive.table-flush {
		width: 100%;
		overflow-x: scroll;
	}
	div.table-responsive.table-flush > div {
		width: fit-content;
	}
	.rowperPageWidth {
		width: 50%;
	}
	.bootstrap-switch {
		width: 100px !important;
		height: 100% !important;
	}
	.bootstrap-switch .bootstrap-switch-label {
		width: 25px !important;
		height: 25px !important;
		border-radius: 50px;
		top: 7px;
		left: 80%;
	}
	.bootstrap-switch-handle-on {
		margin-top: 7px;
		margin-left: 15px;
		font-size: 14px !important;
	}
	.bootstrap-switch-handle-off.bootstrap-switch-default {
		margin-top: 7px;
		margin-left: 15px;
		font-size: 14px !important;
	}
	.el-table__header {
		min-width: 1366px;
	}
	.el-table__body {
		min-width: 1366px;
	}
	.downloadCSV {
		display: none !important;
	}
	.pagination-area {
		display: block !important;
		text-align: center !important;
	}
	.pagination-area .pagination-no-border {
		justify-content: center !important;
		text-align: center !important;
	}
}
</style>
