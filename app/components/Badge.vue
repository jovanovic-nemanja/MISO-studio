<template>
	<component :is="tag" class="badge" :class="`badge-${type}`">
		<slot></slot>
	</component>
</template>
<script>
export default {
	name: 'Badge',
	props: {
		tag: {
			type: String,
			default: 'span',
			description: 'Badge tag',
		},
		type: {
			type: String,
			default: 'default',
			validator: (value) => {
				const acceptedValues = [
					'primary',
					'info',
					'success',
					'warning',
					'danger',
					'default',
				]
				return acceptedValues.includes(value)
			},
			description: 'Badge type (primary|info|success|warning|danger|default)',
		},
	},
}
</script>
<style></style>
