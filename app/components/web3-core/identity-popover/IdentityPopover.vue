<template>
	<el-popover placement="top">
		<div>
			<p class="lh-100">{{ entity }}</p>
			<a v-if="!partition" :href="getUrl()" target="_blank">See on Etherscan</a>
		</div>
		<span slot="reference" class="cursor-pointer text-underline">
			<span v-if="address">{{ entity | shortenAddress }}</span>
			<span v-else-if="transaction">{{ entity | shortenAddress(5) }}</span>
			<span v-else-if="partition">{{ entity | shortenAddress(5) }}</span>
		</span>
	</el-popover>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	props: {
		entity: String,
		address: {
			type: Boolean,
			default: false,
		},
		transaction: {
			type: Boolean,
			default: false,
		},
		partition: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		getUrl() {
			const explorer = this.explorer
			if (this.address) {
				return explorer.root + explorer.address + this.entity
			} else if (this.transaction) {
				return explorer.root + explorer.tx + this.entity
			}
			return ''
		},
	},
	computed: {
		...mapGetters({
			explorer: 'ethereum/explorer',
		}),
	},
}
</script>

<style></style>
