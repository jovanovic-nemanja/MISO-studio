<template>
	<div class="farmList">
		<div class="hero-section mt-4 pt-2 mb-3 pb-1 text-white">
			<p class="fs-4 fs-xs-1 fs-sm-2 pb-1 mb-0 position-relative font-weight-bold">
				LIST OF FARMS
			</p>
		</div>
		<div class="row">
			<div class="col-md-4 col-sm-5 col-12">
				<base-input
					v-model="searchQuery"
					placeholder="Search farms"
					addon-left-icon="tim-icons icon-single-02"
				>
					<template #svgIcon>
						<svg-icon
							icon="search"
							height="18"
							width="18"
							class="position-absolute right-0 search"
						/>
					</template>
				</base-input>
			</div>

			<div class="col-md-8 col-sm-7 col-12">
				<!-- number of item to display in table -->
				<div class="d-flex justify-content-end">
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
				</div>
				<!-- number of item to display in table -->
			</div>
			<div class="col-12">
				<div class="w-100 h-100 farmList_border">
					<el-table v-loading="loading" :data="queriedData" style="width: 100%">
						<!-- token with icon -->
						<el-table-column min-width="180" label="FARM">
							<div slot-scope="{ row }" class="py-2">
								<div class="d-flex">
									<div class="d-flex flex-column">
										<p class="fs-1 text-white">Reward Token: {{ row.rewardToken }}</p>
										<p class="fs-1 text-white">
											Staking Token: {{ row.stakingToken }}
										</p>
									</div>
								</div>
							</div>
						</el-table-column>
						<!-- token with icon -->

						<!-- Alloc Point -->
						<el-table-column min-width="180" label="Alloc Point">
							<div slot-scope="{ row }" class="py-2">
								<div class="d-flex flex-column">
									<p class="fs-1 text-white">
										{{ row.allocPoint }}
									</p>
								</div>
							</div>
						</el-table-column>
						<!-- Alloc Point -->

						<!-- Reward Per Block-->
						<el-table-column min-width="180" label="Reward">
							<div slot-scope="{ row }" class="py-2">
								<div class="d-flex flex-column">
									<p class="fs-1 text-white">{{ row.rewardsPerBlock }} per block</p>
								</div>
							</div>
						</el-table-column>
						<!-- Reward Per Block -->

						<!-- liquidity -->
						<el-table-column min-width="180" label="Liquidity">
							<div slot-scope="{ row }" class="py-2">
								<div class="d-flex flex-column">
									<p class="fs-1 text-white">{{ row.totalStaked }} total staked</p>
								</div>
							</div>
						</el-table-column>
						<!-- liquidity -->

						<!-- earning -->
						<el-table-column min-width="180" label="Earning">
							<div slot-scope="{ row }" class="py-2">
								<div class="d-flex flex-column">
									<div class="d-flex">
										<div class="d-flex flex-column">
											<p class="fs-1 text-white">{{ row.pendingRewards }} pending</p>
										</div>
									</div>
								</div>
							</div>
						</el-table-column>
						<!-- earning -->

						<!-- button -->
						<el-table-column min-width="180" label="info" header-align="center">
							<div slot-scope="{ row }" class="py-2 d-flex justify-content-center">
								<nuxt-link v-slot="{ navigate }" :to="`/farms/${row.addr}`" custom>
									<button class="btn info-button" role="link" @click="navigate">
										View Farm
									</button>
								</nuxt-link>
							</div>
						</el-table-column>
						<!-- button-->
					</el-table>
				</div>
			</div>
		</div>
		<div class="col-12 mt-5">
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
		</div>
	</div>
</template>

<script>
import { Table, TableColumn } from 'element-ui'
import { BaseInput, BasePagination } from '@/components'
import { fromWei, makeBatchCall } from '@/services/web3/base'
import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
import { ZERO_ADDRESS } from '@/constants/networks'

import BigNumber from 'bignumber.js'

// TODO data structure needs to be updated if this action is right one
import { mapActions, mapGetters } from 'vuex'
import { theme } from '@/mixins/theme'
import clientPaginationMixin from '~/components/Tables/PaginatedTables/clientPaginationMixin'

export default {
	components: {
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
		BaseInput,
		BasePagination,
	},
	mixins: [clientPaginationMixin, theme],
	data() {
		return {
			loading: true,
			searchQuery: '',
			tableData: [],
			propsToSearch: ['token', 'name', 'symbol'],
		}
	},
	computed: {
		...mapGetters({
			coinbase: 'ethereum/coinbase',
			farms: 'farms/list',
		}),
	},
	mounted() {
		this.initFarms()
	},
	methods: {
		...mapActions({
			getFarms: 'farms/getFarms',
		}),
		async initFarms() {
			// Get Farms
			await this.getFarms()

			// Get UserPoolsInfos
			const methods = [
				{
					methodName: 'getUserPoolsInfos',
					args: [this.coinbase || ZERO_ADDRESS],
				},
			]
			const [userPoolsInfos] = await makeBatchCall(misoHelperContract(), methods)

			// Get Farms & Pools TableData
			this.farms.forEach((farm) => {
				const userPoolsInfo = userPoolsInfos.find(
					(userPoolsInfo) => userPoolsInfo.farm === farm.addr
				)
				farm.pools.forEach((pool, index) => {
					this.tableData.push({
						addr: farm.addr,
						pid: index,
						rewardToken: farm.rewardToken.symbol,
						stakingToken: pool.stakingToken.symbol,
						allocPoint: pool.allocPoint,
						rewardsPerBlock: farm.rewardsPerBlock,
						totalStaked: BigNumber(
							fromWei(userPoolsInfo?.totalStaked[index] || 0)
						).toFixed(2),
						pendingRewards: BigNumber(
							fromWei(userPoolsInfo?.pendingRewards[index] || 0)
						).toFixed(2),
					})
				})
			})
			this.loading = false
		},
	},
}
</script>

<style lang="scss" scoped>
.farmList {
	&_border {
		border-radius: 4px;
		border-top: none !important;
		border: 1px solid rgba(84, 79, 79, 0.2) !important;
	}
	.search {
		position: absolute;
		z-index: 10;
		bottom: 50%;
		right: 12px;
		transform: translateY(50%);
	}
	.sushi_image {
		height: 40px;
		width: 40px;
		border-radius: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.info-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 30px;
		min-width: 150px;
		word-break: normal;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: #fff;
		transition: all 0.2s linear;
		background-size: 210% 210%;
		background-position: top right;
		&:hover,
		&:focus {
			background-color: transparent !important;
			background-image: linear-gradient(
				to bottom left,
				#f46e41,
				#ba54f5,
				#f46e41
			) !important;
			color: #ffffff !important;
			transition: all 0.2s linear;
		}
		span {
			padding: 4px 0;
		}
	}
	#select1 {
		position: relative;
		appearance: none;
	}
	.select {
		&_wrapper {
			width: 200px;
		}
		&-arrow {
			position: absolute;
			z-index: 10;
			bottom: 50%;
			right: 12px;
			transform: translateY(50%);
		}
	}
}
</style>
