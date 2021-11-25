<template>
	<div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
		<notifications></notifications>
		<sidebar-fixed-toggle-button />
		<side-bar :dark-mode-bg="darkMode" @minBar="slideBar = $event"></side-bar>
		<!--Share plugin (for demo purposes). You can remove it if don't plan on using it-->
		<!-- <div class="light-mode_bg" v-if="darkMode"></div> -->
		<!-- <sidebar-share > </sidebar-share> -->
		<div class="main-panel">
			<dashboard-navbar
				:slide-bar="slideBar"
				@darkMode="setThemMode($event)"
			></dashboard-navbar>
			<router-view name="header"></router-view>

			<div :class="{ content: !isFullScreenRoute }" @click="toggleSidebar">
				<zoom-center-transition :duration="200" mode="out-in">
					<!-- your content here -->
					<nuxt></nuxt>
				</zoom-center-transition>
			</div>
			<content-footer
				v-if="!isFullScreenRoute"
				:slide-bar="slideBar"
			></content-footer>
		</div>
	</div>
</template>
<script>
/* eslint-disable no-new */
import { mapGetters } from 'vuex'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
// import SidebarShare from "@/components/Layout/SidebarSharePlugin"

import DashboardNavbar from '@/components/Layout/DashboardNavbar.vue'
import ContentFooter from '@/components/Layout/ContentFooter.vue'
// import DashboardContent from "@/components/Layout/Content.vue"
import SidebarFixedToggleButton from '@/components/Layout/SidebarFixedToggleButton.vue'
import { ZoomCenterTransition } from 'vue2-transitions'
function hasElement(className) {
	return document.getElementsByClassName(className).length > 0
}

function initScrollbar(className) {
	if (hasElement(className)) {
		new PerfectScrollbar(`.${className}`)
	} else {
		// try to init it later in case this component is loaded async
		setTimeout(() => {
			initScrollbar(className)
		}, 100)
	}
}

export default {
	components: {
		DashboardNavbar,
		ContentFooter,
		SidebarFixedToggleButton,
		// DashboardContent,
		// SlideYDownTransition,
		ZoomCenterTransition,
		// SidebarShare,
	},
	// middleware: 'networkId',
	data() {
		return {
			// darkMode: "",
			slideBar: false,
		}
	},
	computed: {
		...mapGetters({ darkMode: 'theme/getMode' }),
		isFullScreenRoute() {
			return this.$route.path === '/maps/full-screen'
		},
	},
	mounted() {
		this.initScrollbar()
		/* if (process.browser) {
			const pageThem = JSON.parse(localStorage.getItem("miso-theme"))
			if (pageThem !== null) {
				this.darkMode = pageThem
			}
		} */
	},

	methods: {
		toggleSidebar() {
			if (this.$sidebar.showSidebar) {
				this.$sidebar.displaySidebar(false)
			}
		},
		initScrollbar() {
			const docClasses = document.body.classList
			const isWindows = navigator.platform.startsWith('Win')
			if (isWindows) {
				// if we are on windows OS we activate the perfectScrollbar function
				initScrollbar('sidebar')
				initScrollbar('main-panel')
				initScrollbar('sidebar-wrapper')

				docClasses.add('perfect-scrollbar-on')
			} else {
				docClasses.add('perfect-scrollbar-off')
			}
		},
		setThemMode(event) {
			localStorage.setItem('miso-theme', event)
			// this.darkMode = this.mode
		},
	},
}
</script>
<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
	from {
		opacity: 0;
		transform: scale3d($scaleSize, $scaleSize, $scaleSize);
	}
	to {
		opacity: 1;
	}
}

.main-panel .zoomIn {
	animation-name: zoomIn95;
}

@keyframes zoomOut95 {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
		transform: scale3d($scaleSize, $scaleSize, $scaleSize);
	}
}
.light-mode_bg {
	background: url('/s3/img/backgrounds/nav_bg.png') no-repeat left center !important;
	background-size: cover !important;
	position: fixed;
	left: 0;
	top: 0;
	height: 5.2rem;
	width: 100%;
	z-index: 5;
}
.main-panel .zoomOut {
	animation-name: zoomOut95;
}
</style>

<style lang="scss" scoped>
.wrapper {
	overflow-x: hidden;
}
</style>
