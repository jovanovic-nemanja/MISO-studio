<template>
	<div>
		<el-steps :active="active" finish-status="success" align-center>
			<el-step
				v-for="(step, index) in steps"
				:key="index"
				:title="step.title"
			></el-step>
		</el-steps>
		<hr />
		<slot></slot>
		<hr />
		<base-button
			v-if="!hidePrevBtn"
			class="float-left"
			type="primary"
			:disabled="active === 0 || prevBtnDisabled"
			@click="prev"
		>
			{{ prevBtnText }}
		</base-button>
		<slot v-if="!hideNextBtn" name="nextButton">
			<base-button class="float-right" type="primary" @click="next">
				{{ nextBtnText }}
			</base-button>
		</slot>
	</div>
</template>

<script>
import { Steps, Step } from 'element-ui'
export default {
	components: {
		[Steps.name]: Steps,
		[Step.name]: Step,
	},
	props: {
		steps: {
			type: Array,
			required: true,
		},
		active: {
			type: Number,
			default: 0,
		},
		parentRefs: {
			type: Object,
			required: false,
		},
		prevBtnText: {
			type: String,
			default: 'Back',
		},
		nextBtnText: {
			type: String,
			default: 'Next',
		},
		prevBtnDisabled: {
			type: Boolean,
			default: false,
		},
		hideNextBtn: {
			type: Boolean,
			default: false,
		},
		hidePrevBtn: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		activeLocal: {
			get() {
				return this.active
			},
			set(value) {
				this.$emit('stepChanged', value)
			},
		},
	},
	methods: {
		async next() {
			const currentStep = this.steps[this.activeLocal]
			const isValid = currentStep.needsValidation
				? await this.parentRefs[currentStep.refName].validate()
				: true
			if (isValid) {
				if (this.activeLocal++ >= this.steps.length - 1) this.activeLocal = 0
			}
		},
		prev() {
			if (this.activeLocal !== 0) this.activeLocal--
		},
	},
}
</script>

<style>
.el-step__head.is-process .el-step__icon.is-text {
	color: #fff;
	background-color: var(--primary);
	border-color: var(--primary);
}
.el-step__head.is-success {
	color: var(--primary);
	border-color: var(--primary);
}
.el-step__head.is-success .el-step__line {
	color: var(--primary);
	border-color: var(--primary);
	background-color: var(--primary);
}
.el-step__title.is-success {
	color: var(--primary);
}
</style>
