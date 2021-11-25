<template>
	<card class="card-timeline card-plain overflow-hidden">
		<div class="container">
			<ul class="progressbar">
				<li
					v-for="(step, index) in steps"
					:key="step"
					:class="[active >= index + 1 ? 'active' : '']"
				>
					{{ step }}
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
	},
}
</script>
<style lang="scss" scoped>
.container {
	width: 100%;
	position: relative;
	z-index: 1;
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
		text-align: center;
		text-transform: uppercase;
		&.active {
			&:after {
				background: #f46e41;
			}
			&:before {
				border-color: #f46e41;
				background: #f46e41;
				color: white;
			}
		}
		&:before {
			content: counter(step);
			counter-increment: step;
			width: 30px;
			height: 30px;
			border: 2px solid #bebebe;
			display: block;
			margin: 0 auto 10px auto;
			border-radius: 50%;
			line-height: 27px;
			background: white;
			color: #bebebe;
			text-align: center;
			font-weight: bold;
		}
		&:after {
			content: '';
			position: absolute;
			width: 100%;
			height: 3px;
			background: #979797;
			top: 15px;
			left: -50%;
			z-index: -1;
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
</style>
