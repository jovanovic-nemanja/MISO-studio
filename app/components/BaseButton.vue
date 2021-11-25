<template>
	<component
		:is="tag"
		:type="tag === 'button' ? nativeType : ''"
		:disabled="disabled || loading"
		class="btn"
		:to="to"
		:style="{ 'min-width': minWidth + 'px' }"
		:class="[
			{ 'is-rounded': round },
			{ 'btn-block': block },
			{ 'btn-wd': wide },
			{ 'btn-icon btn-fab': icon },
			{ [`btn-${type}`]: type },
			{ [`btn-${size}`]: size },
			{ 'py-3': !size },
			{ 'btn-simple': simple },
			{ 'btn-link': link },
			{ disabled: disabled && tag !== 'button' },
		]"
		@click="handleClick"
	>
		<slot name="pre-icon"></slot>
		<slot name="loading">
			<i v-if="loading" class="fas fa-spinner fa-spin"></i>
		</slot>
		<slot></slot>
	</component>
</template>
<script>
export default {
	name: 'BaseButton',
	props: {
		tag: {
			type: String,
			default: 'button',
			description: 'Button html tag',
		},
		to: {
			type: [String, Object],
			default: undefined,
		},
		round: {
			type: Boolean,
			default: undefined,
		},
		minWidth: {
			type: [String, Number],
			default: 120,
		},
		icon: Boolean,
		block: Boolean,
		loading: Boolean,
		wide: Boolean,
		disabled: Boolean,
		type: {
			type: String,
			default: 'default',
			description: 'Button type (primary|secondary|danger etc)',
		},
		nativeType: {
			type: String,
			default: 'button',
			description: 'Button native type (e.g button, input etc)',
		},
		size: {
			type: String,
			default: undefined,
			description: 'Button size (sm|lg)',
		},
		simple: {
			type: Boolean,
			description: 'Whether button is simple (outlined)',
		},
		link: {
			type: Boolean,
			description: 'Whether button is a link (no borders or background)',
		},
	},
	methods: {
		handleClick(evt) {
			this.$emit('click', evt)
		},
	},
}
</script>
<style scoped lang="scss">
.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	/deep/ i {
		padding: 0 3px;
	}
}
</style>
