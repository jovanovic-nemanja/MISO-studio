<template>
	<div class="navbar-minimize-fixed" style="opacity: 1">
		<fade-transition>
			<sidebar-toggle-button v-if="showButton" class="text-muted" />
		</fade-transition>
	</div>
</template>
<script>
import { FadeTransition } from 'vue2-transitions'
import SidebarToggleButton from './SidebarToggleButton'

export default {
	name: 'SidebarFixedToggleButton',
	components: {
		SidebarToggleButton,
		FadeTransition,
	},
	data() {
		return {
			showScrollThreshold: 50,
			currentScroll: 0,
			scrollTicking: false,
		}
	},
	computed: {
		showButton() {
			return this.currentScroll > this.showScrollThreshold
		},
	},
	mounted() {
		window.addEventListener('scroll', this.handleScroll)
	},
	methods: {
		handleScroll() {
			this.currentScroll = window.scrollY

			if (!this.scrollTicking) {
				window.requestAnimationFrame(() => {
					this.scrollTicking = false
				})

				this.scrollTicking = true
			}
		},
	},
}
</script>
<style></style>
