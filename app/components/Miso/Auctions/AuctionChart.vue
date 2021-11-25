<template>
	<line-chart :chart-data="chartData()" :extra-options="extraOptions"></line-chart>
</template>

<script>
import * as chartConfigs from '@/components/argon-core/Charts/config'
import BarChart from '@/components/argon-core/Charts/BarChart'
import LineChart from '@/components/argon-core/Charts/LineChart'
import { formatDecimals } from '@/util'
export default {
	components: {
		LineChart,
		BarChart,
	},
	props: {
		startPrice: {
			required: true,
		},
		clearingPrice: {
			required: true,
		},
		startDate: {
			required: true,
		},
		minimumPrice: {
			type: String,
		},
		endDate: {
			required: true,
		},
		auctionStarted: {
			type: Boolean,
			required: true,
		},
		auctionEnded: {
			type: Boolean,
			required: true,
		},
		commitments: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			chart: {
				data: [],
				labels: [],
			},
			extraOptions: {
				responsive: true,
				lineTension: 1,
				scales: {
					xAxes: [
						{
							type: 'time',
							time: {
								unit: 'day',
								displayFormats: {
									day: 'YYYY-MM-DD hh:mm',
								},
							},
							ticks: {
								callback(value, index, values) {
									return value
								},
							},
						},
					],
					yAxes: [
						{
							ticks: {
								beginAtZero: true,
								// min: this.minPriceDecimal,
								callback(value, index, values) {
									return value
								},
							},
						},
					],
				},
			},
		}
	},
	async mounted() {
		await this.initChart()
	},
	methods: {
		chartData() {
			return {
				datasets: [
					{
						label: 'Price',
						data: this.chart.data,
						pointStyle: 'circle',
						fill: false,
						borderWidth: 3,
						borderJoinStyle: 'miter',
						pointBorderColor: '#8b9bac',
						pointBorderWidth: 5,
						pointHoverRadius: 5,
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
					},
				],
				eventListener: null,
				labels: this.chart.labels,
				options: {
					responsive: true,
					maintainAspectRatio: false,
				},
			}
		},
		async initChart() {
			const data = []
			const labels = []

			data.push(this.startPrice / Math.pow(10, 18))
			labels.push(this.startDate * 1000)

			for (const commitment of this.commitments) {
				data.push(commitment.price / Math.pow(10, 18))
				labels.push(commitment.timestamp)
			}

			data.push(this.clearingPrice / Math.pow(10, 18))
			if (!this.auctionEnded && this.auctionStarted) {
				labels.push(Date.now())
			}
			if (this.auctionStarted) {
				labels.push(this.endDate * 1000)
			}
			// for (const commitment of this.commitments) {
			//   data.push(commitment.price / Math.pow(10, 18));
			//   labels.push(commitment.timestamp);
			// }
			// console.log(this.minimumPrice / Math.pow(10, 18));
			if (!this.auctionEnded && this.auctionStarted) {
				data.push(this.minimumPrice / Math.pow(10, 18))
				labels.push(this.endDate * 1000)
			}
			this.chart = { data, labels }
			this.loading = false
		},
	},
}
</script>

<style></style>
