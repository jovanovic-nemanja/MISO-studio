<template>
	<slide-y-up-transition :duration="animationDuration">
		<div
			v-show="show"
			ref="modal"
			class="modal fade"
			:class="[
				{ 'show d-block': show },
				{ 'd-none': !show },
				{ 'modal-mini': type === 'mini' },
			]"
			tabindex="-1"
			role="dialog"
			:aria-hidden="!show"
			@click.self="closeModal"
		>
			<div
				class="modal-dialog"
				role="document"
				:class="[
					{ 'modal-notice': type === 'notice' },
					{ 'modal-dialog-centered': centered },
					modalClasses,
				]"
			>
				<div
					class="modal-content sc-bwzfXH sxwjV"
					:class="[gradient ? `bg-gradient-${gradient}` : '', modalContentClasses]"
				>
					<div v-if="$slots.header" class="modal-header" :class="[headerClasses]">
						<slot name="header"></slot>
						<slot name="close-button">
							<button
								v-if="showClose"
								type="button"
								class="close"
								data-dismiss="modal"
								aria-label="Close"
								@click="closeModal"
							>
								<i class="tim-icons icon-simple-remove"></i>
							</button>
						</slot>
					</div>

					<div
						v-if="$slots.default"
						class="bg-gradient-to-r from-blue to-pink w-100 rounded p-px"
						:class="bodyClasses"
					>
						<slot></slot>
					</div>

					<div v-if="$slots.footer" class="modal-footer" :class="footerClasses">
						<slot name="footer"></slot>
					</div>
				</div>
			</div>
		</div>
	</slide-y-up-transition>
</template>
<script>
import { SlideYUpTransition } from 'vue2-transitions'

export default {
	name: 'NetworkModal',
	components: {
		SlideYUpTransition,
	},
	props: {
		show: Boolean,
		showClose: {
			type: Boolean,
			default: true,
		},
		centered: {
			type: Boolean,
			default: false,
		},
		appendToBody: {
			type: Boolean,
			default: true,
			description: 'Whether modal should be appended to document body',
		},
		scrollToBottom: {
			type: Boolean,
			default: true,
			description: "Whether modal should scroll to it's bottom automatically",
		},
		type: {
			type: String,
			default: '',
			validator(value) {
				const acceptedValues = ['', 'notice', 'mini']
				return acceptedValues.includes(value)
			},
			description: 'Modal type (notice|mini|"") ',
		},
		modalClasses: {
			type: [Object, String],
			description: 'Modal dialog css classes',
			default: '',
		},
		modalContentClasses: {
			type: [Object, String],
			description: 'Modal dialog content css classes',
			default: '',
		},
		gradient: {
			type: String,
			description: 'Modal gradient type (danger, primary etc)',
			default: '',
		},
		headerClasses: {
			type: [Object, String],
			description: 'Modal Header css classes',
			default: '',
		},
		bodyClasses: {
			type: [Object, String],
			description: 'Modal Body css classes',
			default: '',
		},
		footerClasses: {
			type: [Object, String],
			description: 'Modal Footer css classes',
			default: '',
		},
		animationDuration: {
			type: Number,
			default: 500,
			description: 'Modal transition duration',
		},
	},
	watch: {
		show(val) {
			const documentClasses = document.body.classList
			if (val) {
				documentClasses.add('modal-open')
				this.$nextTick(this.scrollModalToBottom)
			} else {
				documentClasses.remove('modal-open')
			}
		},
	},
	mounted() {
		if (this.appendToBody) {
			document.body.appendChild(this.$el)
		}
	},
	destroyed() {
		if (this.appendToBody && this.$el && this.$el.parentNode) {
			this.$el.parentNode.removeChild(this.$el)
		}
	},
	methods: {
		closeModal() {
			this.$emit('update:show', false)
			this.$emit('close')
		},
		scrollModalToBottom() {
			if (!this.scrollToBottom) return
			const elm = this.$refs.modal
			elm.scrollTop = elm.scrollHeight - elm.clientHeight
		},
	},
}
</script>
<style>
.modal.show {
	background-color: rgba(0, 0, 0, 0.3);
}
.sxwjV {
	margin: 0 0 2rem 0;
	background-color: #202231;
	padding: 0px;
	overflow-y: hidden;
	overflow-x: hidden;
	align-self: center;
	max-width: 420px;
	max-height: 90vh;
	display: flex;
	border-radius: 10px;
}
</style>
