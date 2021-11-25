<template>
	<div class="fileinput text-center">
		<div class="fileinput-new thumbnail" :class="{ 'img-circle': type === 'avatar' }">
			<img :src="image" alt="preview" />
		</div>
		<div>
			<span class="btn btn-primary btn-simple btn-file">
				<span class="fileinput-new">{{ fileExists ? changeText : selectText }}</span>
				<input type="hidden" value="" name="" />
				<input
					accept="image/*"
					type="file"
					name="..."
					class="valid"
					:multiple="false"
					aria-invalid="false"
					@change="handlePreview"
				/>
			</span>
			<base-button v-if="fileExists" round type="danger" @click="removeFile">
				<i class="fas fa-times"></i>
				{{ removeText }}
			</base-button>
		</div>
	</div>
</template>
<script>
export default {
	name: 'ImageUpload',
	props: {
		type: {
			type: String,
			default: '',
			description: 'Image upload type (""|avatar)',
		},
		src: {
			type: String,
			default: '',
			description: 'Initial image to display',
		},
		selectText: {
			type: String,
			default: 'Select image',
		},
		changeText: {
			type: String,
			default: 'Change',
		},
		removeText: {
			type: String,
			default: 'Remove',
		},
	},
	data() {
		const avatarPlaceholder =
			'http://demos.creative-tim.com/nuxt-black-dashboard-pro/img/placeholder.jpg'
		const imgPlaceholder =
			'http://demos.creative-tim.com/nuxt-black-dashboard-pro/img/image_placeholder.jpg'
		return {
			placeholder: this.type === 'avatar' ? avatarPlaceholder : imgPlaceholder,
			imagePreview: null,
		}
	},
	computed: {
		fileExists() {
			return this.imagePreview !== null
		},
		image() {
			return this.imagePreview || this.src || this.placeholder
		},
	},
	methods: {
		handlePreview(event) {
			const file = event.target.files[0]
			this.imagePreview = URL.createObjectURL(file)
			this.$emit('change', file)
		},
		removeFile() {
			this.imagePreview = null
			this.$emit('change', null)
		},
	},
}
</script>
<style></style>
