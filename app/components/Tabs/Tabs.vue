<template>
	<div>
		<div
			:class="[
				{ 'col-md-4': vertical && !tabNavWrapperClasses },
				{ 'col-12': centered && !tabNavWrapperClasses },
				tabNavWrapperClasses,
			]"
		>
			<ul
				class="nav nav-pills"
				role="tablist"
				:class="[
					`nav-pills-${type}`,
					{ 'nav-pills-icons': square },
					{ 'flex-column': vertical },
					{ 'justify-content-center': centered },
					tabNavClasses,
				]"
			>
				<li
					v-for="tab in tabs"
					:key="tab.id"
					class="nav-item active"
					data-toggle="tab"
					role="tablist"
					aria-expanded="true"
				>
					<a
						data-toggle="tab"
						role="tablist"
						:href="`#${tab.id}`"
						:aria-expanded="tab.active"
						class="nav-link"
						:class="{ active: tab.active }"
						@click.prevent="activateTab(tab)"
					>
						<tab-item-content :tab="tab"></tab-item-content>
					</a>
				</li>
			</ul>
		</div>
		<div
			class="tab-content"
			:class="[
				{ 'tab-space': !vertical },
				{ 'col-md-8': vertical && !tabContentClasses },
				tabContentClasses,
			]"
		>
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Tabs',
	components: {
		TabItemContent: {
			props: ['tab'],
			render(h) {
				return h('div', [this.tab.$slots.label || this.tab.label])
			},
		},
	},
	provide() {
		return {
			addTab: this.addTab,
			removeTab: this.removeTab,
		}
	},
	props: {
		type: {
			type: String,
			default: 'primary',
			validator: (value) => {
				const acceptedValues = ['primary', 'info', 'success', 'warning', 'danger']
				return acceptedValues.includes(value)
			},
		},
		activeTab: {
			type: String,
			default: '',
		},
		tabNavWrapperClasses: {
			type: [String, Object],
			default: '',
		},
		tabNavClasses: {
			type: [String, Object],
			default: '',
		},
		tabContentClasses: {
			type: [String, Object],
			default: '',
		},
		vertical: Boolean,
		square: Boolean,
		centered: Boolean,
		value: String,
	},
	data() {
		return {
			tabs: [],
		}
	},
	watch: {
		value(newVal) {
			this.findAndActivateTab(newVal)
		},
	},
	mounted() {
		this.$nextTick(() => {
			if (this.value) {
				this.findAndActivateTab(this.value)
			}
		})
	},
	methods: {
		findAndActivateTab(label) {
			const tabToActivate = this.tabs.find((t) => t.label === label)
			if (tabToActivate) {
				this.activateTab(tabToActivate)
			}
		},
		activateTab(tab) {
			if (this.handleClick) {
				this.handleClick(tab)
			}
			this.deactivateTabs()
			tab.active = true
		},
		deactivateTabs() {
			this.tabs.forEach((tab) => {
				tab.active = false
			})
		},
		addTab(tab) {
			const index = this.$slots.default.indexOf(tab.$vnode)
			if (!this.activeTab && index === 0) {
				tab.active = true
			}
			if (this.activeTab === tab.name) {
				tab.active = true
			}
			this.tabs.splice(index, 0, tab)
		},
		removeTab(tab) {
			const tabs = this.tabs
			const index = tabs.indexOf(tab)
			if (index > -1) {
				tabs.splice(index, 1)
			}
		},
	},
}
</script>

<style scoped></style>
