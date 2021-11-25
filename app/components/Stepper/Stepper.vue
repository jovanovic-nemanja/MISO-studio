<template>
	<card class="card-timeline card-plain overflow-hidden">
		<div class="container">
			<ul class="progressbar">
				<li
					v-for="(step, index) in steps"
					:key="step"
					class="fs-2"
					:class="[active >= index + 1 ? 'active' : '']"
				>
					{{ step }}
					<span
						:class="{ 'is-pointer': clicable }"
						@click="stepActivator(index + 1)"
					></span>
				</li>
			</ul>
		</div>
	</card>
</template>
<script>
export default {
	name: 'TimeLine',
	props: {
		steps: {
			type: [Array, Object],
			required: true,
		},
		active: {
			type: Number,
			default: 1,
		},
		clicable: {
			type: Boolean,
			default: undefined,
		},
	},
	methods: {
		stepActivator(item) {
			if (this.clicable) {
				this.$emit('changeActive', item)
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.container {
	width: 100%;
	position: relative;
	z-index: 1;
}
.is-pointer {
	cursor: pointer;
}
.progressbar {
	counter-reset: step;
	display: flex;
	margin: 0;
	padding: 0;
	li {
		position: relative;
		text-align: center;
		list-style-type: none;
		flex: 1;
		font-size: 12px;
		position: relative;
		text-transform: uppercase;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.7);
		span {
			position: absolute;
			top: 0;
			height: 36px;
			width: 36px;
			border-radius: 100%;
		}
		&.active {
			color: #ffffff;
			&:after {
				animation: progress 0.03s ease-in-out;
				background: #f46e41 !important;
			}
			&:before {
				transition: background 0.2s linear;
				border-color: #f46e41;
				background: #f46e41 !important;
				color: white;
			}
		}
		&:nth-child(1) {
			text-align: left;
			span {
				left: 0;
			}
			&::before {
				margin: 0 auto 10px 0;
			}
		}
		&:nth-child(2) {
			text-align: center;
			span {
				left: 50%;
				transform: translateX(-50%);
			}
		}
		&:last-child {
			text-align: right;
			span {
				right: 0;
			}
			&::before {
				margin: 0 0 10px auto;
			}
			&::after {
				left: -50%;
			}
		}
		&:before {
			content: counter(step);
			cursor: pointer;
			counter-increment: step;
			width: 36px;
			height: 36px;
			border: 2px solid white;
			display: block;
			font-size: 18px;
			margin: 0 auto 10px auto;
			padding-top: 4px;
			border-radius: 50%;
			line-height: 27px;
			background: #f2f2f4;
			color: #000a35;
			text-align: center;
			font-weight: bold;
		}
		&:after {
			content: '';
			position: absolute;
			width: 150%;
			height: 3px;
			background: rgba(255, 255, 255, 0.2);
			top: 15px;
			left: -100%;
			z-index: -1;
			animation: revert 0.03s ease-in-out;
		}
		&:first-child::after {
			content: none;
		}
	}
}
.step:not(:last-child) {
	width: 100%;
	&::after {
		content: '';
		position: absolute;
		top: 50%;
		width: 100%;
		height: 2px;
		transform: translateY(-50%);
		background: rgba(255, 255, 255, 0.2);
	}
}

@keyframes progress {
	0% {
		width: 0%;
	}
	50% {
		width: 50%;
	}
	100% {
		width: 100%;
	}
}
@keyframes revert {
	100% {
		width: 100%;
	}
	50% {
		width: 50%;
	}
	0% {
		width: 0%;
	}
}
</style>
