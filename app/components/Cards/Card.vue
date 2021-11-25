<template>
	<div class="card" :class="[type && `card-${type}`]">
		<div v-if="$slots.image" class="card-image"><slot name="image"></slot></div>
		<div v-if="$slots.header || title" class="card-header" :class="headerClasses">
			<slot name="header">
				<h4 class="card-title">{{ title }}</h4>
				<p v-if="subTitle" class="card-category">{{ subTitle }}</p>
			</slot>
		</div>
		<div v-if="$slots.default" class="card-body" :class="bodyClasses">
			<slot></slot>
		</div>
		<div v-if="$slots['image-bottom']" class="card-image">
			<slot name="image-bottom"></slot>
		</div>
		<slot name="raw-content"></slot>
		<div v-if="$slots.footer" class="card-footer" :class="footerClasses">
			<hr v-if="showFooterLine" />
			<slot name="footer"></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Card',
	props: {
		title: {
			type: String,
			description: 'Card title',
		},
		subTitle: {
			type: String,
			description: 'Card subtitle',
		},
		type: {
			type: String,
			description: 'Card type (e.g primary/danger etc)',
		},
		showFooterLine: {
			type: Boolean,
			default: false,
		},
		headerClasses: {
			type: [String, Object, Array],
			description: 'Card header css classes',
		},
		bodyClasses: {
			type: [String, Object, Array],
			description: 'Card body css classes',
		},
		footerClasses: {
			type: [String, Object, Array],
			description: 'Card footer css classes',
		},
	},
}
</script>
<style></style>
