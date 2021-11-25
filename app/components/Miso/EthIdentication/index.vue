<template>
	<div>
		<eth-image
			class="avatar avatar-sm mr-2"
			:opts="{
				seed: address,
				size: 10,
				scale: 5,
			}"
		/>
		<nuxt-link :to="{ name: to.name, params: to.params }">
			{{ address | truncate }}
		</nuxt-link>
	</div>
</template>
<script>
import EthImage from './EthImage.vue'

export default {
	components: {
		EthImage,
	},
	filters: {
		truncate(address, charsLength = 4) {
			const prefixLength = 2 // "0x"
			if (!address) {
				return ''
			}
			if (address.length < charsLength * 2 + prefixLength) {
				return address
			}
			return (
				address.slice(0, charsLength + prefixLength) +
				'…' +
				address.slice(-charsLength)
			)
		},
	},
	props: {
		to: Object,
		address: String,
	},
}
</script>
<style></style>
