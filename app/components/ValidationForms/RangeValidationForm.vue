<template>
	<form class="form-horizontal">
		<card>
			<h4 slot="header" class="card-title">Range Validation</h4>
			<div>
				<div class="row">
					<label class="col-sm-2 col-form-label">Min Length</label>
					<div class="col-sm-7">
						<base-input
							v-model="model.minLength"
							v-validate="modelValidations.minLength"
							name="minLength"
							:error="getError('minLength')"
						></base-input>
					</div>
					<label class="col-sm-3 label-on-right"><code>min="5"</code></label>
				</div>

				<div class="row">
					<label class="col-sm-2 col-form-label">Max Length</label>
					<div class="col-sm-7">
						<base-input
							v-model="model.maxLength"
							v-validate="modelValidations.maxLength"
							name="maxLength"
							:error="getError('maxLength')"
						></base-input>
					</div>
					<label class="col-sm-3 label-on-right"><code>max="5"</code></label>
				</div>

				<div class="row">
					<label class="col-sm-2 col-form-label">Range</label>
					<div class="col-sm-7">
						<base-input
							v-model="model.range"
							v-validate="modelValidations.range"
							name="range"
							:error="getError('range')"
						></base-input>
					</div>
					<label class="col-sm-3 label-on-right">
						<code>min_value="6", max_value="10"</code>
					</label>
				</div>

				<div class="row">
					<label class="col-sm-2 col-form-label">Min Value</label>
					<div class="col-sm-7">
						<base-input
							v-model="model.minValue"
							v-validate="modelValidations.minValue"
							name="minValue"
							:error="getError('minValue')"
						></base-input>
					</div>
					<label class="col-sm-3 label-on-right"><code>min_value="6"</code></label>
				</div>

				<div class="row">
					<label class="col-sm-2 col-form-label">Max Value</label>
					<div class="col-sm-7">
						<base-input
							v-model="model.maxValue"
							v-validate="modelValidations.maxValue"
							name="maxValue"
							:error="getError('maxValue')"
						></base-input>
					</div>
					<label class="col-sm-3 label-on-right"><code>max_value="6"</code></label>
				</div>
			</div>
			<div class="text-center">
				<base-button
					native-type="submit"
					type="primary"
					@click.native.prevent="validate"
				>
					Validate inputs
				</base-button>
			</div>
		</card>
	</form>
</template>
<script>
export default {
	data() {
		return {
			model: {
				minLength: '',
				maxLength: '',
				range: '',
				minValue: '',
				maxValue: '',
			},
			modelValidations: {
				minLength: {
					required: true,
					min: 5,
				},
				maxLength: {
					required: true,
					max: 5,
				},
				range: {
					required: true,
					min_value: 6,
					max_value: 10,
				},
				minValue: {
					required: true,
					min_value: 6,
				},
				maxValue: {
					required: true,
					max_value: 6,
				},
			},
		}
	},
	methods: {
		getError(fieldName) {
			return this.errors.first(fieldName)
		},
		validate() {
			this.$validator.validateAll().then((isValid) => {
				this.$emit('on-submit', this.model, isValid)
			})
		},
	},
}
</script>
<style></style>
