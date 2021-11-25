<template>
	<div
		class="wrapper-box"
		:class="[itemLength > 4 ? 'scroll scroll-x' : '', { 'wrapper-box-min': minSide }]"
	>
		<div class="container-fluid pt-5 px-4">
			<div ref="list" class="row flex-md-nowrap">
				<div class="col-11 m-auto col-sm-3">
					<div class="section_box text-white">
						<div class="section_box-header d-flex justify-content-between">
							<span class="pb-1 fs-1">N° 1</span>
							<span class="pb-1 fs-1">AUCTIONS</span>
						</div>
						<div class="section_box-content d-flex justify-content-between pt-4">
							<span class="pb-1 w-50 fs-4 d-flex align-items-center fs-md-2">
								Number of Auctions
							</span>
							<span class="pb-1 fs-20 fs-md-12 fs-sm-10 d-flex align-items-center">
								09
							</span>
						</div>
					</div>
				</div>
				<div class="col-11 m-auto col-sm-3">
					<div class="section_box text-white">
						<div class="section_box-header d-flex justify-content-between">
							<span class="pb-1 fs-1">N° 1</span>
							<span class="pb-1 fs-1">AUCTIONS</span>
						</div>
						<div class="section_box-content d-flex justify-content-between pt-4">
							<span class="pb-1 w-50 fs-4 d-flex align-items-center fs-md-2">
								Number of Tokens
							</span>
							<span class="pb-1 fs-20 fs-md-12 fs-sm-10 d-flex align-items-center">
								01
							</span>
						</div>
					</div>
				</div>
				<div class="col-11 m-auto col-sm-3">
					<div class="section_box text-white">
						<div class="section_box-header d-flex justify-content-between">
							<span class="pb-1 fs-1">N° 1</span>
							<span class="pb-1 fs-1">AUCTIONS</span>
						</div>
						<div class="section_box-content d-flex justify-content-between pt-4">
							<span class="pb-1 w-50 fs-4 d-flex align-items-center fs-md-2">
								Auctions in Process
							</span>
							<span class="pb-1 fs-20 fs-md-12 fs-sm-10 d-flex align-items-center">
								07
							</span>
						</div>
					</div>
				</div>
				<div class="col-11 m-auto col-sm-3">
					<div class="section_box text-white">
						<div class="section_box-header d-flex justify-content-between">
							<span class="pb-1 fs-1">N° 1</span>
							<span class="pb-1 fs-1">AUCTIONS</span>
						</div>
						<div class="section_box-content d-flex justify-content-between pt-4">
							<span class="pb-1 w-50 fs-4 d-flex align-items-center fs-md-2">
								Finished Auctions
							</span>
							<span class="pb-1 fs-20 fs-md-12 fs-sm-10 d-flex align-items-center">
								09
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			itemLength: null,
			minSide: false,
		}
	},
	watch: {
		'$sidebar.isMinimized'(val) {
			this.minSide = val
		},
	},
	mounted() {
		this.itemLength = this.$refs.list.childElementCount
	},
}
</script>

<style lang="scss" scoped>
.wrapper-box {
	background: #000a35;
	position: relative;
	margin-left: -15px;
	margin-right: -30px;
	position: relative;
	padding-bottom: 40px;
	transition: 0.3s linear;
	@media screen and (max-width: 1200px) {
		margin-left: -30px;
	}
	&-min {
		margin-left: -30px !important;
	}
	&::after {
		content: '';
		position: absolute;
		display: inline-block;
		width: 100%;
		left: 0;
		bottom: 0;
		height: 3px;
		background: rgba(255, 255, 255, 0.2);
	}
	.section_box {
		width: 100%;
		&-header {
			position: relative;

			&::after {
				content: '';
				display: inline-block;
				background: rgba(255, 255, 255, 0.2);
				height: 3px;
				position: absolute;
				bottom: 0;
				width: 100%;
			}
			span {
				border-bottom: 3px solid #fff;
			}
		}
	}
}
</style>
