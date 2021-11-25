<template>
	<card>
		<div slot="header" class="row">
			<div class="col-sm-2 text-right">
				<eth-image
					class="avatar avatar mr-2 mt-3"
					:opts="{
						seed: address,
						size: 10,
						scale: 5,
					}"
				/>
			</div>
			<div class="col-sm-6">
				<h6 class="text-uppercase text-muted ls-1 mb-0">{{ title }}</h6>
				<span class="d-block h1">{{ name }}</span>
			</div>
			<div class="col-sm-4 col-md-4 text-center">
				<h6 class="surtitle text-muted mb-0">Symbol</h6>
				<span class="d-block h1">{{ symbol }}</span>
			</div>
		</div>

		<div v-if="owner">
			<span class="h6 surtitle text-muted">Owner</span>
			<span class="d-block h4">{{ owner }}</span>
		</div>
		<div>
			<span class="h6 surtitle text-muted">Contract Address</span>
			<span class="d-block h4">{{ address }}</span>
		</div>
		<div v-if="totalTokens">
			<span class="h6 surtitle text-muted">Total Tokens</span>
			<span class="d-block h4">{{ totalTokens }}</span>
		</div>
		<div v-if="createdDate">
			<span class="h6 surtitle text-muted">Created At</span>
			<span class="d-block h4">{{ createdDate }}</span>
		</div>
		<!-- <div v-if="!totalTokens" class="row">
      <div class="col-md-12 mt-3">
        <n-link :to="`/tokens/${address}`" class="float-right btn btn-outline-primary">View Token</n-link>
      </div>
    </div> -->
	</card>
</template>
<script>
import EthImage from '../eth-identication/EthImage'
export default {
	components: {
		EthImage,
	},
	props: {
		title: {
			type: String,
			required: false,
			default: 'Token Info',
		},
		address: {
			type: String,
			required: true,
		},
		owner: {
			type: String,
			required: false,
		},
		name: {
			type: String,
			required: true,
		},
		symbol: {
			type: String,
			required: true,
		},
		totalTokens: {
			type: String,
			required: false,
		},
		createdDate: {
			type: String,
			required: false,
		},
		externalToken: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
}
</script>
