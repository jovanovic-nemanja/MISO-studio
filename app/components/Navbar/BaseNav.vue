<template>
	<nav :class="classes" class="navbar">
		<div :class="containerClasses">
			<slot name="brand"></slot>
			<slot name="logo"></slot>
			<slot name="toggle-button">
				<button
					v-if="hasMenu"
					class="navbar-toggler collapsed"
					type="button"
					aria-expanded="false"
					aria-label="Toggle navigation"
					@click="toggleMenu"
				>
					<span class="navbar-toggler-bar navbar-kebab"></span>
					<span class="navbar-toggler-bar navbar-kebab"></span>
					<span class="navbar-toggler-bar navbar-kebab"></span>
				</button>
			</slot>

			<collapse-transition
				@after-leave="onTransitionEnd"
				@before-enter="onTransitionStart"
			>
				<div v-show="show" class="collapse navbar-collapse show" :class="menuClasses">
					<slot></slot>
				</div>
			</collapse-transition>
		</div>
	</nav>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions'

export default {
	name: 'BaseNav',
	components: {
		CollapseTransition,
	},
	model: {
		prop: 'show',
		event: 'change',
	},
	props: {
		show: {
			type: Boolean,
			default: false,
			description:
				'Whether navbar menu is shown (valid for viewports < specified by `expand` prop)',
		},
		transparent: {
			type: Boolean,
			default: false,
			description: 'Whether navbar is transparent',
		},
		expand: {
			type: String,
			default: 'lg',
			description: 'Breakpoint where nav should expand',
		},
		menuClasses: {
			type: [String, Object, Array],
			default: '',
			description:
				'Navbar menu (items) classes. Can be used to align menu items to the right/left',
		},
		containerClasses: {
			type: [String, Object, Array],
			default: 'container-fluid',
			description:
				'Container classes. Can be used to control container classes (contains both navbar brand and menu items)',
		},
		type: {
			type: String,
			default: 'white',
			validator(value) {
				return [
					'dark',
					'success',
					'danger',
					'warning',
					'white',
					'primary',
					'info',
					'vue',
				].includes(value)
			},
			description: 'Navbar color type',
		},
	},
	data() {
		return {
			transitionFinished: true,
		}
	},
	computed: {
		classes() {
			const color = `bg-${this.type}`
			const classes = [
				{ 'navbar-transparent': !this.show && this.transparent },
				{ [`navbar-expand-${this.expand}`]: this.expand },
			]
			if (this.position) {
				classes.push(`navbar-${this.position}`)
			}
			if (
				!this.transparent ||
				(this.show && !this.transitionFinished) ||
				(!this.show && !this.transitionFinished)
			) {
				classes.push(color)
			}
			return classes
		},
		hasMenu() {
			return this.$slots.default
		},
	},
	methods: {
		toggleMenu() {
			this.$emit('change', !this.show)
		},
		onTransitionStart() {
			this.transitionFinished = false
		},
		onTransitionEnd() {
			this.transitionFinished = true
		},
	},
}
</script>
