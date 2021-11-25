<template>
	<div
		v-if="active"
		class="position-absolute sidebar-card"
		:style="{ top: top + '%' }"
	>
		<div class="sidebar-card_notification">
			<div class="sidebar-card_notification-bg radius-lg">
				<div class="fs-4 font-weight-bold text-neutral">
					{{ title }}
				</div>
				<p v-if="type === 'html'" class="text-neutral" v-html="description"></p>
				<p v-else class="text-neutral">
					{{ description }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Notification',
	props: {
		active: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		top: {
			type: Number,
			default: 0,
		},
		type: {
			type: String,
			default: '',
		},
	},
}
</script>

<style lang="scss" scoped>
.text-neutral {
	white-space: pre-line;
}
.sidebar-card {
	display: none;
}
@media screen and (min-width: 1200px) {
	.sidebar-card {
		display: block;
		left: 0;
		&_notification {
			padding-left: 54px;
			padding-right: 54px;
			&-bg {
				max-width: 360px;
				position: relative;
				z-index: 5;
				padding: 20px 30px;
				background: linear-gradient(90deg, #4c186d -1%, #170e45 79.31%);
				min-height: 220px;
			}
			&::before {
				content: '';
				display: block;
				clip-path: polygon(100% 0, 0 50%, 100% 100%);
				background: #4c186d;
				width: 54px;
				height: 54px;
				position: absolute;
				top: 86px;
				left: 0;
			}
		}
	}
}
</style>
