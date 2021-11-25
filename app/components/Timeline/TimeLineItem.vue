<template>
	<div
		class="
			rounded-circle
			step-circle
			d-flex
			justify-content-center
			align-items-center
			step-item
		"
		:style="{ width: badgeWidth + 'px', height: badgeHeight + 'px' }"
	>
		<span
			class="
				font-weight-bold
				text-white
				d-flex
				justify-content-center
				align-items-center
			"
		>
			{{ badgeText }}
		</span>
	</div>
</template>
<script>
export default {
	name: 'TimeLineItem',
	props: {
		badgeText: {
			type: String,
			default: '',
		},
		badgeHeight: {
			type: Number,
			default: 30,
		},
		badgeWidth: {
			type: Number,
			default: 30,
		},
	},
}
</script>
<style lang="scss" scoped>
.step-item {
	position: relative;
	z-index: 10;
}
</style>
