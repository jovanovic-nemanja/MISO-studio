<template>
	<validation-provider
		v-slot="{ errors, valid, invalid, validated }"
		:rules="rules"
		:name="name"
		v-bind="$attrs"
	>
		<div class="form-group">
			<slot name="label">
				<label v-if="label" :class="labelClasses">{{ label }}</label>
			</slot>
			<div
				:class="[
					{ 'input-group': hasIcon },
					{ focused: focused },
					{ 'input-group-alternative': alternative },
					{ 'has-label mt-2': label || $slots.label },
					inputGroupClasses,
				]"
			>
				<div
					v-if="prependIcon || $slots.prepend"
					class="input-group-prepend"
					:class="{ 'input-group-prepend_round': rounded }"
				>
					<span
						class="input-group-text px-2"
						:class="{ 'prepend-rounded-icon': rounded }"
					>
						<slot name="prepend"></slot>
					</span>
				</div>
				<slot v-bind="slotData">
					<input
						:value="value"
						:type="type"
						v-bind="$attrs"
						:valid="valid"
						:required="required"
						:style="inputBgColor"
						class="form-control font-weight-bold text-bg-white"
						:class="[
							{ 'is-valid': valid && validated && successMessage },
							{ 'is-invalid': invalid && validated },
							{ 'is-rounded': rounded && (!prependIcon || !$slots.prepend) },
							{ 'prepend-rounded-input': rounded && (prependIcon || $slots.prepend) },
							inputClasses,
						]"
						v-on="listeners"
					/>
				</slot>
				<div v-if="appendIcon || $slots.append" class="input-group-append">
					<span class="input-group-text">
						<slot name="append">
							<i :class="appendIcon"></i>
						</slot>
					</span>
				</div>
				<slot name="infoBlock"></slot>
			</div>
			<slot name="success">
				<div v-if="valid && validated" class="valid-feedback">
					{{ successMessage }}
				</div>
			</slot>
			<slot name="error">
				<div v-if="errors[0]" class="invalid-feedback" style="display: block">
					{{ errors[0] }}
				</div>
			</slot>
			<slot name="subLabel">
				<label v-if="subLabel" :class="subLabelClasses">{{ subLabel }}</label>
			</slot>
			<slot name="svgIcon"></slot>
			<slot name="custom"></slot>
			<slot name="timestemp"></slot>
			<div class="position-absolute right-0 top-0 h-100">
				<slot name="sub-button"></slot>
			</div>
		</div>
	</validation-provider>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
	name: 'BaseInput',
	inheritAttrs: false,
	props: {
		required: {
			type: Boolean,
			description: 'Whether input is required (adds an asterix *)',
		},
		group: {
			type: Boolean,
			description:
				'Whether input is an input group (manual override in special cases)',
		},
		alternative: {
			type: Boolean,
			description: 'Whether input is of alternative layout',
		},
		label: {
			type: String,
			description: 'Input label (text before input)',
		},
		subLabel: {
			type: String,
			description: 'Input label (text after input)',
		},
		error: {
			type: String,
			description: 'Input error (below input)',
		},
		successMessage: {
			type: String,
			description: 'Input success message',
			default: '',
		},
		labelClasses: {
			type: String,
			description: 'Input label css classes',
			default: 'form-control-label',
		},
		subLabelClasses: {
			type: String,
			description: 'Input label css classes',
			default: 'form-control-label text-muted small',
		},
		inputClasses: {
			type: String,
			description: 'Input css classes',
		},
		inputGroupClasses: {
			type: String,
			description: 'Input group css classes',
		},
		value: {
			type: [String, Number],
			description: 'Input value',
		},
		type: {
			type: String,
			description: 'Input type',
			default: 'text',
		},
		appendIcon: {
			type: String,
			description: 'Append icon (right)',
		},
		prependIcon: {
			type: String,
			description: 'Prepend icon (left)',
		},
		rules: {
			type: [String, Array, Object],
			description: 'Vee validate validation rules',
			default: '',
		},
		name: {
			type: String,
			description: 'Input name (used for validation)',
			default: '',
		},
		rounded: {
			type: Boolean,
			description: 'add roder radius to input',
			default: false,
		},
		bgColor: {
			type: Array,
			description: 'inputs background color light/dark',
			default: undefined,
		},
	},
	data() {
		return {
			focused: false,
		}
	},
	computed: {
		...mapGetters('theme', ['getMode']),
		inputBgColor() {
			if (this.bgColor && this.getMode) {
				return {
					background: this.bgColor[0],
				}
			} else if (this.bgColor && !this.getMode) {
				return {
					background: this.bgColor[1],
				}
			}
			return ''
		},
		listeners() {
			return {
				...this.$listeners,
				input: this.updateValue,
				focus: this.onFocus,
				blur: this.onBlur,
			}
		},
		slotData() {
			return {
				focused: this.focused,
				error: this.error,
				...this.listeners,
			}
		},
		hasIcon() {
			const { append, prepend } = this.$slots
			return (
				append !== undefined ||
				prepend !== undefined ||
				this.appendIcon !== undefined ||
				this.prependIcon !== undefined ||
				this.group
			)
		},
	},
	methods: {
		updateValue(evt) {
			const value = evt.target.value
			this.$emit('input', value)
		},
		onFocus(evt) {
			this.focused = true
			this.$emit('focus', evt)
		},
		onBlur(evt) {
			this.focused = false
			this.$emit('blur', evt)
		},
	},
}
</script>
<style lang="scss">
.invalid-feedback {
	width: 100%;
	margin-top: 0.25rem;
	font-size: 80%;
	color: #cc0044;
}
.is-rounded {
	border-radius: 345123px !important;
}
.prepend-rounded {
	&-input {
		border-radius: 345123px !important;
		border-top-left-radius: 0 !important;
		border-bottom-left-radius: 0 !important;
	}
	&-icon {
		border-radius: 345123px !important;
		border-top-right-radius: 0 !important;
		border-bottom-right-radius: 0 !important;
	}
}
.input-group-prepend_round {
	border-top-left-radius: 50%;
	border-bottom-left-radius: 50%;
}
</style>
