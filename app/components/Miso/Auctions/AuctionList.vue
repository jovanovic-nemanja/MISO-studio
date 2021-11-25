<template>
	<div class="table-section">
		<el-table :data="listData">
			<el-table-column min-width="180" label="ADDRESS">
				<div slot-scope="{ row }" class="py-2">
					<span>{{ row.addr | truncate(6) }}</span>
				</div>
			</el-table-column>
			<el-table-column
				min-width="130"
				prop="tokenInfo.name"
				label="TOKEN NAME"
			></el-table-column>
			<el-table-column
				min-width="140"
				prop="tokenInfo.symbol"
				label="TOKEN SYMBOL"
			></el-table-column>
			<el-table-column min-width="150" label="STATUS">
				<div slot-scope="{ row }">
					<div class="d-flex align-items-baseline">
						<span
							class="status-marker"
							:class="[
								isLive(row.startTime, row.endTime)
									? 'bg-green'
									: isEnd(row)
									? 'bg-red'
									: 'bg-warning',
							]"
						></span>
						<span
							v-if="isLive(row.startTime, row.endTime)"
							class="pl-3 text-capitalize"
						>
							Live
						</span>
						<span v-else-if="isEnd(row)" class="pl-3 text-capitalize">Finished</span>
						<span v-else class="pl-3 text-capitalize">Upcoming</span>
					</div>
				</div>
			</el-table-column>
			<el-table-column min-width="180" label="Progress">
				<div slot-scope="{ row }">
					<div class="d-flex justify-content-start align-items-center w-100">
						<span
							class="progress-line"
							:style="{ width: getPeriodValue(row) + '%' }"
						></span>
					</div>
				</div>
			</el-table-column>
			<el-table-column header-align="right" min-width="180" label="AUCTION INFO">
				<div slot-scope="{ row }" class="d-flex justify-content-end">
					<nuxt-link v-slot="{ navigate }" :to="`/auctions/${row.addr}`" custom>
						<button class="btn info-button" role="link" @click="navigate">
							View Info
						</button>
					</nuxt-link>
				</div>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import { Table, TableColumn } from 'element-ui'

export default {
	components: {
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},
	props: {
		listData: {
			type: [Array, Object],
			required: true,
			description: 'data to display perPage in Auction table',
		},
	},
	methods: {
		getPeriodValue(row) {
			const startTime = new Date(parseInt(row.startTime) * 1000)
			const endTime = new Date(parseInt(row.endTime) * 1000)
			const now = new Date()
			if (now >= endTime) {
				return 100
			} else if (startTime > now) {
				return 0
			} else {
				const fullPeriod = Math.ceil(Math.abs(endTime - startTime) / (60 * 1000))

				const periodForNow = Math.ceil(Math.abs(now - startTime) / (60 * 1000))
				const res = (periodForNow * 100) / fullPeriod

				return res
			}
		},
		isLive(startTime, endTime) {
			const currentTimestamp = Date.parse(new Date()) / 1000
			return (
				currentTimestamp >= parseInt(startTime) &&
				currentTimestamp < parseInt(endTime)
			)
		},
		isEnd(row) {
			const currentTimestamp = Date.parse(new Date()) / 1000
			return currentTimestamp >= parseInt(row.endTime)
		},
	},
}
</script>

<style lang="scss" scoped>
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
		#ee4c49 0%,
		#ee4424 25%,
		#f0544a 50%,
		#e5317e 85%,
		#b924a7 100%
	);
	height: 4px;
	box-shadow: none;
}
</style>
