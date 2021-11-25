<template>
	<div v-if="loading" class="loading-page" :style="[space]">
		<circle5 :style="[size]" class="spinner" />
	</div>
</template>

<script>
import Circle5 from 'vue-loading-spinner/src/components/Circle5'
export default {
	name: 'Loader',
	components: {
		Circle5,
	},
	props: {
		loading: {
			type: Boolean,
			default: true,
		},
		height: {
			type: [Number, String],
			default: 60,
		},
		width: {
			type: [Number, String],
			default: 60,
		},
		y: {
			type: [Number, String],
			default: 20,
		},
		x: {
			type: [Number, String],
			default: 20,
		},
	},
	computed: {
		size() {
			return {
				height: this.height + 'px',
				width: this.width + 'px',
			}
		},
		space() {
			return {
				padding: `${this.y}px ${this.x}px`,
			}
		},
	},
}
</script>

<style lang="scss">
.loading-page {
	position: relative;
	display: flex;
	justify-content: center;
	width: 100%;
	height: 100%;
	text-align: center;
	font-size: 30px;
	font-family: sans-serif;
	.spinner {
		background-color: #e0836c !important;
		height: 80px !important;
		width: 80px !important;
		&::before {
			background: #ec583b !important;
		}
		&::after {
			background: #ec4422 !important;
		}
	}
}
</style>
