<template>
	<div>
		<validation-observer v-slot="{ invalid }">
			<div v-for="(element, index) of inputs" :key="index">
				<base-input group class="mb-3" :rules="rules">
					<input
						v-model="inputs[index]"
						class="form-control"
						:placeholder="placeholder"
						:name="name"
						:type="type"
					/>
					<div class="input-group-append">
						<button
							class="btn btn-outline-primary"
							:disabled="inputs.length == 1"
							type="button"
							@click="removeInput(inputs[index])"
						>
							<i class="far fa-trash-alt"></i>
						</button>
					</div>
				</base-input>
			</div>
			<base-button
				size="sm"
				type="primary"
				outline
				:disabled="invalid"
				@click="addInput()"
			>
				<i class="ni ni-fat-add"></i>
				Add More
			</base-button>
		</validation-observer>
	</div>
</template>

<script>
import { Select, Option } from 'element-ui'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
export default {
	name: 'MultipleInputs',
	components: {
		[Select.name]: Select,
		[Option.name]: Option,
		ValidationObserver,
		ValidationProvider,
	},
	props: {
		inputs: {
			type: Array,
			default: [''],
		},
		rules: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: ' ',
		},
		type: {
			type: String,
			default: 'string',
		},
	},
	methods: {
		addInput() {
			this.inputs.push('')
		},
		removeInput(item) {
			const index = this.inputs.indexOf(item)
			if (index !== -1) this.inputs.splice(index, 1)
		},
	},
}
</script>
