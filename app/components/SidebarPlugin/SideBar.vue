<template>
	<div class="sidebar" :class="{ 'sidebar-bg': darkModeBg }">
		<div
			ref="sidebarScrollArea"
			class="sidebar-wrapper position-relative"
			@mouseenter="showBar = true"
			@mouseleave="showBar = false"
		>
			<div class="logo pl-4" :class="[darkModeBg ? 'sidebar-divider' : 'dark_bg']">
				<div class="pt-2 d-flex justify-content-between align-items-center w-100">
					<nuxt-link to="/">
						<svg-icon icon="miso" height="15" width="150" color="#ffffff" />
					</nuxt-link>
					<div v-if="breackpoint === 'xl'" class="navbar-wrapper" @click="toggleBar">
						<div class="burger d-inline" :class="{ toggled: slidebar }">
							<div type="button" class="toggler">
								<span class="bar line1"></span>
								<span class="bar line2"></span>
								<span class="bar line3"></span>
							</div>
						</div>
					</div>
					<!-- <svg-icon icon="toggle" height="15" width="40" color="#ffffff" :fill="false" /> -->
				</div>
			</div>
			<slot></slot>
			<div v-if="!darkModeBg" class="dark-mode_bg">
				<ul v-if="!slidebar" ref="links" class="nav">
					<!-- nav item section -->
					<li v-for="(navItem, i) in computedNetworkNav" :key="i" class="nav-items">
						<p
							class="d-flex mt-0 justify-content-between align-items-center"
							@mouseenter="navItem.hover = true"
							@mouseleave="navItem.hover = false"
							@click="toggleNavItem(navItem)"
						>
							<span class="font-weight-bold">{{ navItem.name }}</span>
							<span v-if="!navItem.active">
								<svg-icon
									v-if="!navItem.hover"
									icon="menu-down"
									height="10"
									width="10"
									color="#ffffff #ffffff"
									:fill="false"
								/>
								<svg-icon
									v-else
									icon="menu-down"
									height="10"
									width="10"
									:color="svgColor"
									:fill="false"
								/>
							</span>
							<span v-else>
								<svg-icon
									icon="menu-up"
									height="10"
									width="10"
									:color="svgColor"
									:fill="false"
								/>
							</span>
						</p>
						<transition name="slide" mode="out-in">
							<div v-show="navItem.active" class="section-dropdown">
								<ul>
									<nuxt-link
										v-for="(link, indx) in navItem.childLinks"
										:key="indx"
										:to="link.path"
										tag="li"
									>
										{{ link.name }}
									</nuxt-link>
								</ul>
							</div>
						</transition>
					</li>
				</ul>
				<div class="socials">
					<ul v-if="!slidebar" class="nav mb-3">
						<li class="nav-item text-white">
							<a
								href="https://instantmiso.gitbook.io/miso/"
								target="_blank"
								class="mt-3 mb-0 py-0 d-flex align-items-center"
							>
								<svg-icon icon="docs" height="18" width="18" />
								<span class="pl-2 font-weight-bold fs-1">Documentation</span>
							</a>
						</li>
						<li class="nav-item text-white">
							<a
								href="https://github.com/sushiswap"
								target="_blank"
								class="mt-3 mb-0 py-0 d-flex align-items-center"
							>
								<svg-icon icon="github" height="18" width="18" />
								<span class="pl-2 font-weight-bold fs-1">Github</span>
							</a>
						</li>
						<li class="nav-item text-white">
							<a
								href="https://discord.gg/CD2YdZzb7Z"
								target="_blank"
								class="mt-3 mb-0 py-0 d-flex align-items-center"
							>
								<svg-icon icon="discord" height="18" width="18" />
								<span class="pl-2 font-weight-bold fs-1">Discord</span>
							</a>
						</li>
						<li class="nav-item text-white">
							<a
								href="https://twitter.com/SushiSwap"
								target="_blank"
								class="mt-3 mb-0 py-0 d-flex align-items-center"
							>
								<svg-icon icon="twitt-side" height="16" width="16" />
								<span class="pl-2 font-weight-bold fs-1">Twitter</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div v-else class="image_bg">
				<fade-transition>
					<ul v-show="showSidebar" class="nav">
						<!-- nav item section -->
						<li v-for="(navItem, i) in computedNetworkNav" :key="i" class="nav-items">
							<p
								class="d-flex mt-0 justify-content-between align-items-center"
								@mouseenter="navItem.hover = true"
								@mouseleave="navItem.hover = false"
								@click="toggleNavItem(navItem)"
							>
								<span class="font-weight-bold">{{ navItem.name }}</span>
								<span v-if="!navItem.active">
									<svg-icon
										v-if="!navItem.hover"
										icon="menu-down"
										height="10"
										width="10"
										color="#ffffff #ffffff"
										:fill="false"
									/>
									<svg-icon
										v-else
										icon="menu-down"
										height="10"
										width="10"
										:color="svgColor"
										:fill="false"
									/>
								</span>
								<span v-else>
									<svg-icon
										icon="menu-up"
										height="10"
										width="10"
										:color="svgColor"
										:fill="false"
									/>
								</span>
							</p>
							<transition name="slide" mode="out-in">
								<div v-show="navItem.active" class="section-dropdown">
									<ul>
										<nuxt-link
											v-for="(link, index) in navItem.childLinks"
											:key="index"
											:to="link.path"
											tag="li"
										>
											{{ link.name }}
										</nuxt-link>
									</ul>
								</div>
							</transition>
						</li>
					</ul>
				</fade-transition>
				<div class="socials">
					<fade-transition>
						<ul v-show="showSidebar" class="nav mb-3">
							<li class="nav-item text-white">
								<a
									href="https://instantmiso.gitbook.io/miso"
									target="_blank"
									class="mt-3 mb-0 py-0 d-flex align-items-center"
								>
									<svg-icon icon="docs" height="18" width="18" />
									<span class="pl-2 font-weight-bold fs-1">Documentation</span>
								</a>
							</li>
							<li class="nav-item text-white">
								<a
									href="https://github.com/sushiswap"
									target="_blank"
									class="mt-3 mb-0 py-0 d-flex align-items-center"
								>
									<svg-icon icon="github" height="18" width="18" />
									<span class="pl-2 font-weight-bold fs-1">Github</span>
								</a>
							</li>
							<li class="nav-item text-white">
								<a
									href="https://discord.gg/CD2YdZzb7Z"
									target="_blank"
									class="mt-3 mb-0 py-0 d-flex align-items-center"
								>
									<svg-icon icon="discord" height="18" width="18" />
									<span class="pl-2 font-weight-bold fs-1">Discord</span>
								</a>
							</li>
							<li class="nav-item text-white">
								<a
									href="https://twitter.com/SushiSwap"
									target="_blank"
									class="mt-3 mb-0 py-0 d-flex align-items-center"
								>
									<svg-icon icon="twitt-side" height="16" width="16" />
									<span class="pl-2 font-weight-bold fs-1">Twitter</span>
								</a>
							</li>
						</ul>
					</fade-transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { FadeTransition } from 'vue2-transitions'
import { mapGetters } from 'vuex'

export default {
	name: 'Sidebar',
	components: {
		FadeTransition,
	},
	provide() {
		return {
			autoClose: this.autoClose,
		}
	},
	props: {
		title: {
			type: String,
			default: 'Instant MISO',
			description: 'Sidebar title',
		},
		shortTitle: {
			type: String,
			default: 'CT',
			description: 'Sidebar short title',
		},
		logo: {
			type: String,
			default:
				'http://demos.creative-tim.com/nuxt-black-dashboard-pro/img/icon-nuxt.svg',
			description: 'Sidebar app logo',
		},
		darkModeBg: {
			type: Boolean,
			required: true,
			description: 'rander background image with them mode condion',
		},
		sidebarLinks: {
			type: Array,
			default: () => [],
			description:
				"List of sidebar links as an array if you don't want to use components for these.",
		},
		autoClose: {
			type: Boolean,
			default: true,
			description: 'Whether sidebar should autoclose on mobile when clicking an item',
		},
	},
	data() {
		return {
			showBar: false,
			initHeight: 0,
			navItems: [
				{
					name: 'Marketplace',
					active: false,
					hover: false,
					childLinks: [
						{
							name: 'Live Sales',
							path: '/auctions/live',
						},
						{
							name: 'Upcoming Sales',
							path: '/auctions/upcoming',
						},
						{
							name: 'Past Sales',
							path: '/auctions/finished',
						},
						// {
						// 	name: "Manage Lists",
						// 	path: "/points-list",
						// },
					],
				},
				// {
				// 	name: 'Farms',
				// 	active: false,
				// 	hover: false,
				// 	childLinks: [
				// 		{
				// 			name: 'Active Farms',
				// 			path: '/farms',
				// 		},
				// 	],
				// },
				{
					name: 'Tokens',
					active: false,
					hover: false,
					childLinks: [
						{
							name: 'Deployed Tokens',
							path: '/tokens',
						},
					],
				},
				// {
				// 	name: "Recipes",
				// 	active: false,
				// 	hover: false,
				// 	childLinks: [
				// 		{
				// 			name: "Chefs Special",
				// 			path: "/factory",
				// 		},
				// 		,
				// 		{
				// 			name: "Builder",
				// 			path: "/recipes",
				// 		},
				// 	],
				// },
				{
					name: 'Factory',
					active: false,
					hover: false,
					childLinks: [
						{
							name: 'New Token',
							path: '/factory/token',
						},
						{
							name: 'New Sale',
							path: '/factory/auctions/new',
						},
						{
							name: 'New List',
							path: '/factory/points-list',
						},
						{
							name: 'New Launcher',
							path: '/factory/liquidity',
						},
						// {
						// 	name: "New Farm",
						// 	path: "/factory/farm",
						// },
					],
				},
			],
			breackpoint: null,
			slidebar: false,
		}
	},
	computed: {
		...mapGetters({ networkID: 'ethereum/networkId' }),
		svgColor() {
			return !this.darkModeBg ? '#F25462 #F25462' : '#000000 #000000'
		},
		showSidebar() {
			if (this.slidebar) {
				return !!this.showBar
			}
			return true
		},
		computedNetworkNav() {
			let networkList = this.navItems
			if (this.networkID === 1) {
				networkList = networkList.filter((item) => {
					return item.name !== 'Farms' && item.name !== 'Factory'
				})
			}
			// in future we can add new filters
			return networkList
		},
	},
	watch: {
		'$screen.breakpoint'(val) {
			this.breackpoint = val
		},
	},
	mounted() {
		this.initHeight = this.$refs.sidebarScrollArea.clientHeight
		this.breackpoint = this.$screen.breakpoint
	},
	beforeDestroy() {
		if (this.$sidebar.showSidebar) {
			this.$sidebar.showSidebar = false
		}
	},
	methods: {
		minimizeSidebar() {
			if (this.$sidebar) {
				this.$sidebar.toggleMinimize()
			}
		},
		toggleNavItem(item) {
			this.navItems = this.navItems.map((el) => {
				if (item.name === el.name) {
					el.active = !el.active
				} else {
					el.active = false
				}
				return el
			})
		},
		toggleBar() {
			this.$sidebar.toggleMinimize()
			this.slidebar = !this.slidebar
			// console.log(this.$sidebar.isMinimized);
			this.$emit('minBar', this.$sidebar.isMinimized)
		},
	},
}
</script>

<style>
@media (min-width: 992px) {
	.navbar-search-form-mobile,
	.nav-mobile-menu {
		display: none;
	}
}
</style>

<style lang="scss" scoped>
.toggle-menu {
	cursor: pointer;
	z-index: 1500;
	position: relative;
}
.app-versioin {
	border-top: 2px solid rgba(255, 255, 255, 0.2);
	padding: 30px 25px 10px;
}
.sidebar {
	overflow: hidden;
	&-bg {
		background: url('/s3/img/backgrounds/miso_bg.png') no-repeat center;
		background-size: cover;
	}
	&-divider {
		&:after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			height: 1px;
			width: 100%;
			background: hsla(208, 100%, 97%, 0.5);
		}
	}
}
.logo {
	height: 5.2rem;
}
.dark_bg {
	background: url('/s3/img/backgrounds/nav_bg-1.png') no-repeat right bottom !important;
	background-size: cover !important;
}
.dark-mode_bg {
	background: #000a35;
	position: absolute;
	width: 100%;
	left: 0;
	top: 5.2rem;
	bottom: 0;
	overflow-y: auto;
	overflow-x: hidden;
	.nav {
		padding-top: 30px;
		li.nuxt-link-exact-active {
			color: #f25462;
		}
	}
}
.image_bg {
	position: absolute;
	width: 100%;
	left: 0;
	top: 5.2rem;
	bottom: 0;
	overflow-y: auto;
	overflow-x: hidden;
	.nav {
		padding-top: 30px;
		li.nuxt-link-exact-active {
			color: #000a35;
		}
	}
}
.nav .nav-items {
	cursor: pointer;
	position: relative;
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		background: #ffffff;
		display: block;
		width: calc(100% - 31px);
		height: 2px;
		opacity: 0.35;
	}
	p {
		padding: 10px 8px;
		margin: 10px 15px 0;
		color: #ffffff;
		font-size: 22px;
		letter-spacing: 2px;
	}
	ul {
		list-style: none;
		li {
			padding: 8px 8px;
			margin: 0 15px;
			color: #fff;
			min-width: 200px;
			&:last-of-type {
				padding-bottom: 18px;
			}
		}
	}
	&:hover span {
		text-decoration: underline;
	}
}

.socials {
	position: absolute;
	bottom: 10px;
	@media screen and(max-height: 850px) {
		bottom: inherit;
		position: relative;
		//margin-top: 200px;
	}
}
.navbar-wrapper {
	padding: 10px 0 10px;
	cursor: pointer;
	.burger {
		.toggler {
			border: none;
		}
		.bar {
			z-index: 50;
			height: 3px;
			display: block;
			&.line1 {
				width: 12px;
				margin-left: auto;
				position: relative;
				background: #ffffff;
			}
			&.line2 {
				margin-top: 4px;
				width: 18px;
				margin-left: auto;
				position: relative;
				background: #ffffff;
			}
			&.line3 {
				margin-top: 4px;
				position: relative;
				width: 22px;
				margin-left: auto;
				background: #ffffff;
			}
		}
		&.toggled {
			.line1 {
				top: -3px;
				width: 22px;
				margin-left: auto;
				animation: topbar-x 0.5s linear;
				transform: rotate(-135deg);
			}
			.line2 {
				display: none;
			}
			.line3 {
				width: 22px;
				margin-top: -6px;
				margin-left: auto;
				animation: bottombar-x 0.5s linear;
				transform: rotate(135deg);
			}
		}
	}
}
@keyframes topbar-x {
	0% {
		bottom: 0px;
		transform: rotate(0deg);
	}
	45% {
		bottom: 6px;
		transform: rotate(-145deg);
	}
	75% {
		transform: rotate(-130deg);
	}
	100% {
		transform: rotate(-135deg);
	}
}
@keyframes bottombar-x {
	0% {
		top: 0px;
		transform: rotate(0deg);
	}
	45% {
		top: 0px;
		transform: rotate(145deg);
	}
	75% {
		transform: rotate(130deg);
	}
	100% {
		transform: rotate(135deg);
	}
}
</style>
