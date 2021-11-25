<template>
	<div>
		<div class="row">
			<div class="col-12 col-lg-9 col-xl-8 order-1 order-lg-0">
				<token-factory-form
					@active-step="onTabChanged($event)"
					@active-focus="allStepInputs($event)"
				></token-factory-form>
			</div>

			<div
				class="
					col-12 col-lg-3 col-xl-4
					bg-dark
					mb-sm-5 mb-md-0
					darker-side
					order-0
					position-relative
				"
			>
				<div class="d-flex align-items-center mt-5 mb-2 pl-3">
					<div class="text-white fs-7 text-capitalize font-weight-bold pr-3">
						{{ sidebarTitles[tabIndex] }}
					</div>
					<p
						class="
							bg-brown
							fs-3
							py-1
							px-3
							mb-0
							d-flex
							align-items-center
							radius-lg
							text-white
							font-weight-bold
						"
					>
						Step {{ tabIndex + 1 }} of 3
					</p>
				</div>
				<div class="pl-3">
					* indicates required step
					<br />
					<span class="text-white fs-3">
						Create your own Token at the Token Factory. For details on all current
						Token types, please visit our
						<a href="https://instantmiso.gitbook.io/miso/tokens" target="_blank">
							Documentation
						</a>
					</span>
				</div>

				<div v-if="tabIndex === 0">
					<template v-for="(item, index) in allSteps">
						<zoom-y-transition :key="index" :duration="300">
							<notificatoin
								:active="item.active"
								:title="item.title"
								:description="item.desctiption"
								:top="item.top"
							/>
						</zoom-y-transition>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Vue } from 'vue-property-decorator'
import { ZoomYTransition } from 'vue2-transitions'
import { tokenFactory } from '@/constants/contracts'
import TokenFactoryForm from '@/components/Miso/Tokens/TokenFactoryForm'
import Notificatoin from '@/components/Miso/Factory/Liquidity/sidebarNotification'

const tokenFactoryAddress = tokenFactory.address

export default {
	components: {
		TokenFactoryForm,
		Notificatoin,
		ZoomYTransition,
	},
	layout: 'DashboardLayout',
	data() {
		return {
			contractAddress: '',
			deploymentFee: 0.1,
			tabIndex: 0,
			allSteps: [
				{
					active: false,
					top: 32,
					title: 'TOKEN TYPE*',
					desctiption:
						'Select a token type. For details on our current token types, please visit the Documentation',
				},
				{
					active: false,
					top: 42,
					title: 'TOKEN NAME*',
					desctiption:
						'This will be the name of your token. Choose wisely, this cannot be changed later',
				},
				{
					active: false,
					top: 52,
					title: 'TOKEN SYMBOL*',
					desctiption:
						'This will be the symbol of your token, normally a short version of your token name.',
				},
				{
					active: false,
					top: 61.5,
					title: 'INITIAL SUPPLY*',
					desctiption: 'This will be the number of tokens initially minted.',
				},
				{
					active: false,
					top: 61.5,
					title: 'TOTAL SUPPLY*',
					desctiption:
						'This will be the number of tokens ever minted. This number is fixed.',
				},
			],

			sidebarTitles: ['TOKEN DETAILS', 'DEPLOYMENT', 'RESULT'],
		}
	},
	computed: {
		...mapGetters({
			currentProvidersNetworkId: 'ethereum/currentProvidersNetworkId',
		}),
	},
	mounted() {
		this.contractAddress = this.getTokenFactoryAddress()
	},
	methods: {
		getTokenFactoryAddress() {
			return tokenFactoryAddress[this.currentProvidersNetworkId]
		},
		onTabChanged(newValue) {
			this.tabIndex = newValue
		},
		allStepInputs(event) {
			let i = 0
			for (const key in event) {
				Vue.set(this.allSteps[i], 'active', event[key])
				i++
			}
		},
	},
}
</script>
