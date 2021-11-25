<template>
	<div class="wizard-container">
		<div id="wizardProfile" class="card card-wizard active">
			<form @submit.prevent>
				<!--
          You can switch " data-color="primary" "  with one of the next bright colors: "green", "orange", "red", "blue"
        -->
				<div class="card-header text-center">
					<div class="wizard-navigation">
						<div class="progress-with-circle">
							<div
								class="progress-bar"
								role="progressbar"
								aria-valuenow="1"
								aria-valuemin="1"
								aria-valuemax="3"
								:style="{ width: `${progress}%` }"
							></div>
						</div>
						<ul class="nav nav-pills">
							<li
								v-for="(tab, index) in tabs"
								:id="`step-${tab.tabId}`"
								:key="tab.title"
								:ref="`tab-${index}`"
								role="tab"
								:tabindex="tab.checked ? 0 : ''"
								:aria-controls="tab.tabId"
								:aria-disabled="!tab.active"
								:aria-selected="tab.active"
								class="nav-item wizard-tab-link"
								:style="linkWidth"
							>
								<a
									class="nav-link"
									:class="[
										{ 'disabled-wizard-link': !tab.checked },
										{ active: tab.active },
										{ checked: tab.checked },
									]"
									data-toggle="tab"
									@click="navigateToTab(index)"
								>
									<tab-item-content :tab="tab"></tab-item-content>
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div class="card-body">
					<div class="tab-content">
						<slot :activeIndex="activeTabIndex" :activeTab="activeTab"></slot>
					</div>
				</div>

				<div class="card-footer">
					<slot name="footer" :next-tab="nextTab" :prev-tab="prevTab">
						<div class="d-flex justify-content-between step">
							<base-button
								v-if="activeTabIndex < tabCount - 1"
								:round="true"
								wide
								:type="computedButtonType"
								:disabled="activeTabIndex === 0 || nextBtnLoading"
								class="btn btn-previous"
								@click.native="prevTab"
							>
								{{ prevButtonText }}
							</base-button>
							<base-button
								v-if="activeTabIndex < tabCount - 1"
								:round="true"
								:loading="nextBtnLoading"
								type="primary"
								class="btn btn-next"
								@click.native="nextTab"
							>
								{{ nextButtonText }}
							</base-button>
						</div>
						<div class="clearfix"></div>
					</slot>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import { throttle } from './throttle'

export default {
	name: 'SimpleWizard',
	components: {
		TabItemContent: {
			functional: true,
			props: ['tab'],
			render(h, { props }) {
				const content = props.tab.$slots.label
				if (content && content.length) {
					return content
				}
				return h('span', [props.tab.$slots.label, props.tab.label])
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
		startIndex: {
			type: Number,
			default: 0,
		},
		title: {
			type: String,
			default: 'Title',
		},
		subTitle: {
			type: String,
			default: 'Subtitle',
		},
		prevButtonText: {
			type: String,
			default: 'Previous',
		},
		nextButtonText: {
			type: String,
			default: 'Next',
		},
		nextBtnLoading: {
			type: Boolean,
			default: false,
		},
		finishButtonText: {
			type: String,
			default: 'Finish',
		},
		vertical: {
			type: Boolean,
		},
	},
	data() {
		return {
			tabs: [],
			activeTabIndex: 0,
			tabLinkWidth: 0,
			tabLinkHeight: 50,
		}
	},
	computed: {
		tabCount() {
			return this.tabs.length
		},
		computedButtonType() {
			if (this.activeTabIndex !== 0 || this.nextBtnLoading) {
				return 'primary'
			}
			return ''
		},
		linkWidth() {
			let width = 100
			if (this.tabCount > 0) {
				width = 100 / this.tabCount
			}
			if (this.vertical) {
				width = 100
			}
			return { width: `${width}%` }
		},
		activeTab() {
			return this.tabs[this.activeTabIndex]
		},
		stepPercentage() {
			return (1 / (this.tabCount * 2)) * 100
		},
		progress() {
			let percentage = 0
			if (this.activeTabIndex > 0) {
				const stepsToAdd = 1
				const stepMultiplier = 2
				percentage =
					this.stepPercentage * (this.activeTabIndex * stepMultiplier + stepsToAdd)
			} else {
				percentage = this.stepPercentage
			}
			return percentage
		},
	},
	watch: {
		activeTabIndex(newValue, oldValue) {
			if (newValue !== oldValue) {
				const oldTab = this.tabs[oldValue]
				const newTab = this.tabs[newValue]
				oldTab.active = false
				newTab.active = true

				if (!newTab.checked) {
					newTab.checked = true
				}
				this.$emit('tab-change', oldTab, newTab)
				this.$emit('update:startIndex', newValue)
			}
		},
	},
	mounted() {
		this.activeTabIndex = this.startIndex
		this.$nextTick(() => {
			this.tabs[this.activeTabIndex].active = true
			this.tabs[this.activeTabIndex].checked = true
			this.onResize()
		})
		window.addEventListener(
			'resize',
			() => {
				throttle(this.onResize, 40)
			},
			false
		)
	},
	methods: {
		addTab(tab) {
			const index = this.$slots.default.indexOf(tab.$vnode)
			const tabTitle = tab.title || ''
			tab.tabId = `${tabTitle.replace(/ /g, '')}${index}`
			if (!this.activeTab && index === 0) {
				tab.active = true
				tab.checked = true
			}
			if (this.activeTab === tab.name) {
				tab.active = true
				tab.checked = true
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
		validate(tab) {
			const tabToValidate = tab || this.activeTab
			const beforeChange = tabToValidate.beforeChange
			if (beforeChange) {
				return Promise.resolve(beforeChange())
					.then((res) => {
						this.activeTab.hasError = !res
						return res
					})
					.catch(() => {
						this.activeTab.hasError = true
					})
			} else {
				return Promise.resolve(true)
			}
		},
		async nextTab() {
			const isValid = await this.validate()
			if (isValid && this.activeTabIndex < this.tabCount - 1) {
				this.activeTabIndex++
			}
			return isValid
		},
		prevTab() {
			this.activeTabIndex--
		},
		async navigateToTab(index) {
			if (this.tabs[index].checked) {
				// recursively validate each tab
				if (index > this.activeTabIndex) {
					const valid = await this.nextTab()
					if (valid) {
						this.navigateToTab(index)
					}
				} else {
					this.activeTabIndex = index
				}
			}
		},
		onResize() {
			const tabLinks = document.getElementsByClassName('wizard-tab-link')
			if (tabLinks.length > 0 && this.tabCount > 0) {
				const { clientWidth, clientHeight } = tabLinks[0]
				this.tabLinkWidth = clientWidth
				this.tabLinkHeight = clientHeight
			}
		},
	},
}
</script>
<style lang="scss">
/* Tab content animation */
.tab-content {
	display: flex; // to avoid horizontal scroll when animating
	.tab-pane {
		display: block;
		animation: fadeIn 0.5s;
		width: 100%;
	}
}

/**
      Extra niceties. Display error tabs and disable navigation unvisited tabs
     */
.wizard-navigation .nav-link {
	&.active,
	&.checked {
		cursor: pointer;
	}
}

.disabled-wizard-link {
	cursor: not-allowed;
}
</style>
