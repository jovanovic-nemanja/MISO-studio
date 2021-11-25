<template>
	<div v-if="!loading" class="p-2 card-hight">
		<a :href="linkurl" target="_blank">
			<img :src="require(`@/assets/images/${headerimage}`)" class="ama-header" />
			<div class="ama-card-description pl-4">
				<div class="row">
					<div class="col-7">
						<p v-if="youtubeflag" class="ama-watch pt-1 font-weight-bold">
							Watch On
							<br />
							Youtube
						</p>
						<p v-if="!youtubeflag" class="ama-watch pt-3 pb-2 font-weight-bold">
							Read On Medium
						</p>
					</div>
					<div
						class="col-5 ama-watch font-weight-bold pt-3 pb-2"
						v-html="pubdate"
					></div>
				</div>
				<p class="ama-title font-weight-bold pb-1" v-html="title"></p>
			</div>
		</a>
	</div>
</template>

<script>
import { theme } from '@/mixins/theme'

export default {
	components: {},
	mixins: [theme],
	props: {
		headerimage: {
			type: String,
			default: '',
		},
		youtubeflag: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		pubdate: {
			type: String,
			default: '',
		},
		linkurl: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			loading: true,
		}
	},
	computed: {},
	mounted() {
		this.loading = false
	},
	beforeDestroy() {},
	methods: {},
}
</script>

<style lang="scss" scoped>
.card-hight {
	min-height: 300px;
}
.counter-line {
	font-size: 33px;
	max-width: 288px;
}

.ama-card-description {
	background: #161522;
	border-radius: 0 0 12px 12px;
	text-align: left;
	position: relative;
	padding-bottom: 0.5rem;
}

.ama-title {
	color: #e3e3e3;
	font-size: 14px;
	height: 3.5rem;
	padding-top: 0.5rem;
	padding-right: 0.5rem;
}

.ama-watch {
	color: #7f7f7f;
	font-size: 8px;
	height: 25px;
	margin-top: 0.5rem !important;
}

.ama-header {
	border-radius: 0px !important;
	width: 100%;
}

.ama-play {
	font-size: 4.5rem;
	color: white;
	position: absolute;
	transform: translateY(-50%) scale(1);
	right: 15px;
	width: 60px;
	&:hover {
		transition: all 0.4s ease-in-out;
		transform: translateY(-50%) scale(1.1);
		cursor: pointer;
	}
}
</style>
