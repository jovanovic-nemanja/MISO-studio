<template>
	<card>
		<h5 slot="header" class="title">Edit Profile</h5>
		<form @submit.prevent="updateProfile">
			<div class="row">
				<div class="col-md-5">
					<base-input
						v-model="user.company"
						type="text"
						label="Company"
						:disabled="true"
						placeholder="Company"
					></base-input>
				</div>
				<div class="col-md-3">
					<base-input
						v-model="user.username"
						type="text"
						label="Username"
						placeholder="Username"
					></base-input>
				</div>
				<div class="col-md-4">
					<base-input
						v-model="user.email"
						type="email"
						label="Email address"
						placeholder="mike@email.com"
					></base-input>
				</div>
			</div>

			<div class="row">
				<div class="col-md-6">
					<base-input
						v-model="user.firstName"
						type="text"
						label="First Name"
						placeholder="First Name"
					></base-input>
				</div>
				<div class="col-md-6">
					<base-input
						v-model="user.lastName"
						type="text"
						label="Last Name"
						placeholder="Last Name"
					></base-input>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<base-input
						v-model="user.address"
						type="text"
						label="Address"
						placeholder="Home Address"
					></base-input>
				</div>
			</div>

			<div class="row">
				<div class="col-md-4">
					<base-input
						v-model="user.city"
						type="text"
						label="City"
						placeholder="City"
					></base-input>
				</div>
				<div class="col-md-4">
					<base-input
						v-model="user.country"
						type="text"
						label="Country"
						placeholder="Country"
					></base-input>
				</div>
				<div class="col-md-4">
					<base-input
						v-model="user.postalCode"
						label="Postal Code"
						placeholder="ZIP Code"
					></base-input>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12">
					<base-input label="About Me">
						<textarea
							v-model="user.aboutMe"
							class="form-control"
							placeholder="ZIP Code"
						></textarea>
					</base-input>
				</div>
			</div>

			<base-button native-type="submit" type="primary" class="btn-fill">
				Save
			</base-button>
		</form>
	</card>
</template>
<script>
export default {
	data() {
		return {
			user: {
				company: 'Creative Code Inc.',
				username: 'michael23',
				email: '',
				firstName: 'Mike',
				lastName: 'Andrew',
				address: 'Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09',
				city: 'New York',
				country: 'USA',
				postalCode: '',
				aboutMe: `Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo.`,
			},
		}
	},
	methods: {
		updateProfile() {
			alert('Your data: ' + JSON.stringify(this.user))
		},
	},
}
</script>
<style></style>
