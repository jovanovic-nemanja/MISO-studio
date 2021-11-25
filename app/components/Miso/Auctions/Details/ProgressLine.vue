<template>
	<span class="w-100 progress-status_line d-inline-block position-relative">
		<span
			class="bg-success fill position-absolute"
			:style="{ width: progress + '%' }"
		></span>
		<span
			v-if="progress !== 0"
			class="text-box d-flex align-items-end"
			:style="{ left: progress + '%' }"
		>
			<span class="line" :class="[getMode ? 'bg-dark' : 'bg-light']"></span>
			<span class="font-weight-bold pl-2 price">
				<span class="text-white">{{ price[0].toLocaleString('en-US') }}</span>
				/
				<span>{{ price[1].toLocaleString('en-US') }}</span>
			</span>
		</span>
	</span>
</template>

<script>
export default {
	name: 'ProgressLine',
	props: {
		progress: {
			type: [Number, String],
			default: 0,
		},
		getMode: {
			type: Boolean,
			require: true,
		},
		// will change with actual data type
		price: Array,
	},
}
</script>

<style lang="scss" scoped>
.progress-status {
	&_line {
		height: 4px;
		border-radius: 4px;
		background: hsla(142, 19%, 23%, 0.741);
		.fill {
			display: inline-block;
			height: 4px;
			border-radius: 4px;
		}
		.text-box {
			position: absolute;
			height: 25px;
			top: 10px;
			.line {
				position: absolute;
				top: 0;
				height: 78%;
				width: 2px;
			}
		}
	}
}
</style>
