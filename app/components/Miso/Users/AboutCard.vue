<template>
	<card class="pt-2 pb-4 mb-1 h-100 about-project">
		<div class="d-flex flex-column">
			<div class="d-flex">
				<svg-icon icon="sooper" height="60" width="52" />
				<!-- <img class="is-60x60" src="s3/img/S.png" /> -->
				<div class="pl-4 d-flex flex-column">
					<h4 class="card-title font-weight-bold text-capitalize fs-5 mb-1">
						{{ info.title }}
					</h4>
					<p class="font-weight-bold text-uppercase fs-2">
						{{ info.token }}:
						<span class="text-white">{{ info.tokenQuantity }}</span>
					</p>
				</div>
			</div>

			<base-divider class="mb-4 mt-2 py-1" />
			<div class="pt-2">
				<h5 class="fs-1 mb-0 font-weight-bold text-uppercase">WEBSITE:</h5>
				<a
					:href="info.website"
					target="_blank"
					class="font-weight-bold text-white pt-0 mt-0 fs-3"
				>
					<u>{{ info.website }}</u>
				</a>
				<div class="pt-3 mt-1 pr-5">
					<h5 class="fs-1 font-weight-bold text-uppercase mb-0">CONTRACT:</h5>
					<div class="d-flex align-items-center">
						<p class="font-weight-bold text-white text-uppercase fs-3 mb-0">
							{{ $route.params.address | truncate(6) }}
						</p>
						<div class="copy-box d-flex align-items-center ml-2">
							<div class="copy-box_icon">
								<svg-icon
									class="cursor-pointer"
									icon="copy"
									height="20"
									width="20"
									color="#F46E41"
									:fill="false"
									@click="copyToClipboard($route.params.address)"
								/>
							</div>
							<span class="font-weight-bolder text-white fs-2 pl-1">copy</span>
						</div>
					</div>
				</div>
				<div v-if="info.icons.social" class="pt-3">
					<h5 class="fs-1 font-weight-bold mb-2">SOCIAL:</h5>
					<div class="d-block">
						<a
							v-for="(item, index) in info.icons.social"
							:key="index"
							:href="item"
							class="socials-icon svg-color"
							target="_blank"
						>
							<svg-icon class="mr-2" :icon="index" height="26" width="26" />
						</a>
					</div>
				</div>
			</div>

			<base-divider class="my-4 py-2" />
			<div class="pr-5">
				<h5 class="fs-1 mb-1 font-weight-bold">RECIPE:</h5>
				<p class="fs-4 font-weight-bold">{{ info.recipe }}</p>
			</div>
			<div v-if="info.icons.ingredient.length" class="pt-4 mt-3 pr-5">
				<h5 class="fs-1 font-weight-bold text-uppercase">auction type:</h5>
				<div class="d-flex">
					<el-popover
						v-for="(item, i) in info.icons.ingredient"
						:key="i"
						:close-delay="60"
						trigger="hover"
						placement="top"
						class="vue-icon p-1"
					>
						<div>
							<div class="font-weight-bold p-0 text-center">
								{{ item.text }}
							</div>
						</div>

						<svg-icon
							slot="reference"
							class="mr-2 cursor-pointer"
							:icon="item.icon"
							height="48"
							width="48"
							:original="true"
							:color="computedIconColor"
						/>
					</el-popover>
				</div>
			</div>
		</div>
	</card>
</template>

<script>
import { Card, BaseDivider } from '@/components'
import { Popover } from 'element-ui'
import { theme } from '@/mixins/theme'

export default {
	components: {
		Card,
		BaseDivider,
		[Popover.name]: Popover,
	},
	mixins: [theme],
	props: {
		info: {
			type: [Object, Array],
			required: true,
			description: 'full data for about card',
		},
	},
	data() {
		return {
			theme: false,
			hoverIcon: {},
		}
	},
	methods: {
		// copy data to clipboard on click & display message
		copyToClipboard(value) {
			navigator.clipboard.writeText(value).then(() => {
				this.$notify({
					type: 'success',
					verticalAlign: 'bottom',
					horizontalAlign: 'right',
					message: 'successfully copied to clipboard!',
				})
			})
		},
	},
}
</script>

<style lang="scss" scoped>
// remove when icon
.is-60x60 {
	height: 60px;
	width: 60px;
}
.copy-box {
	padding: 4px 6px;
	position: relative;
	span {
		z-index: 2;
		opacity: 0;
		transition: all 0.3s ease-in;
	}
	svg {
		position: relative;
		z-index: 2;
	}
	&_icon::after {
		position: absolute;
		border-radius: 2px;
		content: '';
		transition: all 0.3s ease-in;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: transparent;
	}
	&_icon:hover {
		& ~ span {
			opacity: 1;
			transition: all 0.3s ease-in;
		}
		&:after {
			content: '';
			opacity: 1;
			background: #111b47;
			transition: all 0.3s ease-in;
		}
	}
}
.about-project {
	@media screen and (max-width: 450px) {
		h4 {
			font-size: 16px;
		}
		p {
			font-size: 12px;
		}
	}
	@media screen and (min-width: 1200px) and (max-width: 1362px) {
		h4 {
			font-size: 15px;
		}
	}
}
</style>

<style>
.el-popover {
	min-width: auto !important;
}
.popper__arrow::after {
	background: transparent !important;
}
</style>
