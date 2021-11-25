<template>
	<form>
		<card footer-classes="text-left">
			<div slot="header"><h4 class="card-title">Login Form</h4></div>
			<div>
				<base-input
					v-model="model.fullName"
					v-validate="modelValidations.fullName"
					label="Full Name"
					required
					:error="getError('full name')"
					name="full name"
				></base-input>

				<base-input
					v-model="model.email"
					v-validate="modelValidations.email"
					label="Email address"
					required
					:error="getError('email')"
					name="email"
					type="email"
				></base-input>

				<base-input
					v-model="model.password"
					v-validate="modelValidations.password"
					label="Passowrd"
					required
					name="password"
					:error="getError('password')"
					type="password"
				></base-input>
				<div class="category form-category">* Required fields</div>
			</div>

			<template slot="footer">
				<base-button
					native-type="submit"
					type="primary"
					@click.native.prevent="validate"
				>
					Login
				</base-button>
				<a href="javascript:void(0)" class="pull-right">Forgot password?</a>
			</template>
		</card>
	</form>
</template>
<script>
export default {
	data() {
		return {
			model: {
				email: '',
				password: '',
				fullName: '',
			},
			modelValidations: {
				fullName: {
					required: true,
				},
				email: {
					required: true,
					email: true,
				},
				password: {
					required: true,
					min: 5,
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
