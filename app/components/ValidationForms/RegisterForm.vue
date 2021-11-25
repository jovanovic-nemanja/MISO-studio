<template>
	<form>
		<card footer-classes="text-right">
			<div slot="header"><h4 class="card-title">Register Form</h4></div>
			<div>
				<base-input
					v-model="model.email"
					v-validate="modelValidations.email"
					type="email"
					required
					name="email"
					label="Email address"
					:error="getError('email')"
				></base-input>

				<base-input
					v-model="model.password"
					v-validate="modelValidations.password"
					label="Password"
					required
					type="password"
					name="password"
					:error="getError('password')"
				></base-input>

				<base-input
					v-model="model.confirmPassword"
					v-validate="modelValidations.confirmPassword"
					label="Confirm Password"
					required
					type="password"
					name="confirm"
					:error="getError('confirm')"
				></base-input>
				<div class="category form-category">* Required fields</div>
			</div>
			<template slot="footer" class="text-right">
				<base-checkbox v-model="model.subscribe" class="pull-left" name="subscribe">
					Accept terms & conditions
				</base-checkbox>
				<base-button native-type="submit" type="primary" @click.prevent="validate">
					Register
				</base-button>
			</template>
		</card>
	</form>
</template>
<script>
import { BaseCheckbox } from '@/components/index'

export default {
	components: {
		BaseCheckbox,
	},
	data() {
		return {
			model: {
				email: '',
				password: '',
				confirmPassword: '',
				subscribe: false,
			},
			modelValidations: {
				email: {
					required: true,
					email: true,
				},
				password: {
					required: true,
					min: 5,
				},
				confirmPassword: {
					required: true,
					confirmed: 'password',
				},
				subscribe: {
					required: true,
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
				this.$emit('on-submit', this.registerForm, isValid)
			})
		},
	},
}
</script>
<style></style>
