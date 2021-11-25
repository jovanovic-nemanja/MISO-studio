<template>
	<ul
		class="pagination d-flex align-items-baseline fs-9 fs-md-6"
		:class="paginationClass"
	>
		<li
			v-if="showArrows"
			class="page-item prev-page"
			:class="{ disabled: value === 1 }"
		>
			<a class="page-link" aria-label="Previous" @click="prevPage">
				<svg-icon icon="pagArrow" :fill="false" dir="down" hight="20" width="20" />
			</a>
		</li>
		<li
			v-for="item in range(minPage, maxPage)"
			:key="item"
			class="page-item"
			:class="{ active: value === item }"
		>
			<span class="page-link font-weight-bold" @click="changePage(item)">
				{{ item }}
			</span>
		</li>
		<li
			v-if="showArrows"
			class="page-item page-pre next-page"
			:class="{ disabled: value === totalPages }"
		>
			<a class="page-link" aria-label="Next" @click="nextPage">
				<svg-icon icon="pagArrow" :fill="false" hight="20" width="20" />
			</a>
		</li>
	</ul>
</template>
<script>
export default {
	name: 'BasePagination',
	props: {
		pageCount: {
			type: Number,
			default: 0,
		},
		perPage: {
			type: Number,
			default: 10,
		},
		showArrows: {
			type: Boolean,
			default: true,
		},
		total: {
			type: Number,
			default: 0,
		},
		value: {
			type: Number,
			default: 1,
		},
		pagesToDisplay: {
			type: Number,
			default: 5,
		},
	},
	computed: {
		paginationClass() {
			return `pagination-default`
		},
		totalPages() {
			if (this.pageCount > 0) return this.pageCount
			if (this.total > 0) {
				return Math.ceil(this.total / this.perPage)
			}
			return 1
		},
		defaultPagesToDisplay() {
			if (this.totalPages > 0 && this.totalPages < this.pagesToDisplay) {
				return this.totalPages
			}
			return this.pagesToDisplay
		},
		minPage() {
			if (this.value >= this.defaultPagesToDisplay) {
				const pagesToAdd = Math.floor(this.defaultPagesToDisplay / 2)
				const newMaxPage = pagesToAdd + this.value
				if (newMaxPage > this.totalPages) {
					return this.totalPages - this.defaultPagesToDisplay + 1
				}
				return this.value - pagesToAdd
			} else {
				return 1
			}
		},
		maxPage() {
			if (this.value >= this.defaultPagesToDisplay) {
				const pagesToAdd = Math.floor(this.defaultPagesToDisplay / 2)
				const newMaxPage = pagesToAdd + this.value
				if (newMaxPage < this.totalPages) {
					return newMaxPage
				} else {
					return this.totalPages
				}
			} else {
				return this.defaultPagesToDisplay
			}
		},
	},
	watch: {
		perPage() {
			this.$emit('input', 1)
		},
		total() {
			this.$emit('input', 1)
		},
	},
	methods: {
		range(min, max) {
			const arr = []
			for (let i = min; i <= max; i++) {
				arr.push(i)
			}
			return arr
		},
		changePage(item) {
			this.$emit('input', item)
		},
		nextPage() {
			if (this.value < this.totalPages) {
				this.$emit('input', this.value + 1)
			}
		},
		prevPage() {
			if (this.value > 1) {
				this.$emit('input', this.value - 1)
			}
		},
	},
}
</script>
