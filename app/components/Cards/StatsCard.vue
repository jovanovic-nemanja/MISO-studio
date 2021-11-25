<template>
	<card class="card-stats" :show-footer-line="true">
		<div class="row">
			<div v-if="$slots.icon || icon" class="col-5">
				<div class="info-icon text-center" :class="`icon-${type}`">
					<slot name="icon"><i :class="icon"></i></slot>
				</div>
			</div>
			<div v-if="$slots.content || title || subTitle" class="col-7">
				<div class="numbers">
					<slot>
						<p v-if="subTitle" class="card-category">{{ subTitle }}</p>
						<h3 v-if="title" class="card-title">{{ title }}</h3>
					</slot>
				</div>
			</div>
		</div>
		<div v-if="$slots.footer" slot="footer" class="stats">
			<slot name="footer"></slot>
		</div>
	</card>
</template>
<script>
import Card from './Card.vue'

export default {
	name: 'StatsCard',
	components: {
		Card,
	},
	props: {
		type: {
			type: String,
			default: 'primary',
		},
		icon: String,
		title: String,
		subTitle: String,
	},
}
</script>
<style></style>
