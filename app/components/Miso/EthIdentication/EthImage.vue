<template>
	<img :src="dataurl" />
</template>

<script>
import blockies from 'ethereum-blockies-updated'
export default {
	name: 'EthImage',
	props: {
		opts: Object,
	},
	computed: {
		dataurl() {
			const options = this.opts
			options.seed = options.seed.toLowerCase()
			const icon = blockies.create(options)
			return icon.toDataURL()
		},
	},
}
</script>
