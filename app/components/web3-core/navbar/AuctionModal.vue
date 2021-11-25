<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="modal-close">
						<i class="far fa-times-circle i-modal-close" @click="$emit('close')"></i>
					</div>
					<div class="modal-header font-weight-bold">
						<slot name="header">{{ title }}</slot>
					</div>
					<div class="modal-body">
						<slot name="body">
							<span v-html="description"></span>
						</slot>
					</div>
					<div class="modal-footer">
						<slot name="footer">
							<div class="modal-default-button px-5 py-2" @click="$emit('close')">
								OK
							</div>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import { theme } from '@/mixins/theme'

export default {
	components: {},
	mixins: [theme],
	props: {
		title: {
			type: String,
			required: false,
			default: 'Wrong Network',
		},
		description: {
			type: String,
			required: false,
			default:
				'MISO is not yet launched on this network.<br />Please connect your wallet to a network that MISO currently supports',
		},
	},
	data() {
		return {}
	},
	computed: {},
	mounted() {},
	beforeDestroy() {},
	methods: {},
}
</script>

<style lang="scss" scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.3s ease;
}
.modal-wrapper {
	display: table-cell;
	vertical-align: middle;
}
.modal-container {
	min-width: 400px;
	width: 30%;
	margin: 0px auto;
	padding: 20px 30px;
	background-image: linear-gradient(
		135deg,
		#521f78 46.5%,
		#ba1d75 62.9%,
		#bf4237 92.9%
	);
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
	font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
	margin-top: 0;
	color: #42b983;
}
.modal-body {
	margin: 20px 0;
}
.modal-default-button {
	text-align: center;
	background-image: linear-gradient(
		135deg,
		#ee4523 20%,
		#f26e3c 40%,
		#ee4523 60%,
		#f26e3c 80%
	);
	cursor: pointer;
	border-radius: 20px;
	color: white;
}
.modal-enter {
	opacity: 0;
}
.modal-leave-active {
	opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}

.modal-footer {
	justify-content: center;
	border-top: none;
}
.modal-header {
	border-bottom: none;
	justify-content: center;
	color: white;
	font-size: 24px;
	padding-top: 0px;
}
.modal-body {
	border-bottom: none;
	text-align: center;
	color: white;
	font-size: 14px;
	margin: 20px 0px 0px 0px;
	padding: 0px;
}
.modal-close {
	color: #f66645;
	text-align: right;
}
.i-modal-close {
	cursor: pointer;
	position: relative;
	right: -22px;
	top: -12px;
}
</style>
