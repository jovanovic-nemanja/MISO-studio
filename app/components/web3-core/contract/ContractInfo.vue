<template>
	<div>
		<div class="row">
			<div v-for="(element, index) in data" :key="index" class="col-xl-4 col-md-6">
				<stats-card class="bg-gradient-primary">
					<!-- Card body -->
					<div class="row">
						<div class="col">
							<h5 class="card-title text-uppercase text-muted mb-0 text-white">
								{{ element.title }}
							</h5>
							<span class="h3 font-weight-bold mb-0 text-white">
								{{ element.value }}
							</span>
						</div>
						<slot name="title-container" :is-open="isOpen"></slot>
					</div>
				</stats-card>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		data: {
			type: Array,
			default: [],
		},
	},
}
</script>

<style></style>
