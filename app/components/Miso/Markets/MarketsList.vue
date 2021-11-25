<template>
	<card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
		<template slot="header">
			<h3 class="mb-0">List of Markets</h3>
		</template>
		<div>
			<div
				class="
					col-12
					d-flex
					justify-content-center justify-content-sm-between
					flex-wrap
				"
			>
				<el-select
					v-model="pagination.perPage"
					class="select-primary pagination-select"
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

				<div>
					<base-input
						v-model="searchQuery"
						prepend-icon="fas fa-search"
						placeholder="Search..."
					></base-input>
				</div>
			</div>
			<spinner v-if="loading" size="large" message="Loading..." />
			<el-table
				v-else
				class="table-responsive table-flush"
				:loading="loading"
				:data="queriedData"
				row-key="id"
				header-row-class-name="thead-light"
				@sort-change="sortChange"
			>
				<el-table-column label="Contract" min-width="200px" prop="contract">
					<template #default="{ row }">
						<eth-image
							class="avatar avatar-xs mr-2"
							:opts="{
								seed: row.address,
								size: 10,
								scale: 5,
							}"
						/>
						<nuxt-link :to="{ name: 'tokens-token', params: { token: row.address } }">
							{{ row.address | shortenAddress(8) }}
						</nuxt-link>
					</template>
				</el-table-column>

				<el-table-column
					v-for="column in columns"
					:key="column.label"
					min-width="180px"
					v-bind="column"
				></el-table-column>
			</el-table>
		</div>
		<div
			slot="footer"
			class="
				col-12
				d-flex
				justify-content-center justify-content-sm-between
				flex-wrap
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
import { mapGetters, mapActions } from 'vuex'
import { Table, TableColumn, Select, Option } from 'element-ui'
import EthImage from '@/components/web3-core/eth-identication/EthImage.vue'
import Spinner from '@/components/web3-core/spinner/Spinner.vue'
import clientPaginationMixin from '~/components/Tables/PaginatedTables/clientPaginationMixin'
export default {
	components: {
		[Select.name]: Select,
		[Option.name]: Option,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
		EthImage,
		Spinner,
	},
	mixins: [clientPaginationMixin],
	data() {
		return {
			propsToSearch: ['address', 'owner', 'devaddr'],
			columns: [
				{
					prop: 'owner',
					label: 'Owner',
					minWidth: 135,
					sortable: false,
				},
				{
					prop: 'devaddr',
					label: 'Devaddr',
					minWidth: 220,
					sortable: false,
				},
				{
					prop: 'createdAt',
					label: 'Created',
					minWidth: 150,
					sortable: true,
				},
			],
			tableData: [],
			loading: true,
		}
	},
	computed: {
		...mapGetters({
			markets: 'markets/list',
		}),
	},
	async mounted() {
		await this.getMarkets()
	},
	methods: {
		...mapActions({
			setMarkets: 'markets/setMarkets',
		}),
		async getMarkets() {
			await this.setMarkets()
			this.tableData = this.markets
			this.loading = false
		},
	},
}
</script>

<style scoped></style>
