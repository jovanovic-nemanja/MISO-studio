<template>
	<div
		v-show="active"
		:id="tabId"
		class="tab-pane fade"
		role="tabpanel"
		:aria-hidden="!active"
		:aria-labelledby="`step-${tabId}`"
		:class="{ 'active show': active }"
	>
		<slot></slot>
	</div>
</template>
<script>
export default {
	name: 'WizardTab',
	inject: ['addTab', 'removeTab'],
	props: {
		label: String,
		id: String,
		beforeChange: Function,
	},
	data() {
		return {
			active: false,
			checked: false,
			hasError: false,
			tabId: '',
		}
	},
	mounted() {
		this.addTab(this)
	},
	destroyed() {
		if (this.$el && this.$el.parentNode) {
			this.$el.parentNode.removeChild(this.$el)
		}
		this.removeTab(this)
	},
}
</script>
<style></style>
