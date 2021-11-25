<template>
	<div>
		<div class="row">
			<div v-if="error.statusCode === 404" class="col-12">
				<div class="error-wrapper w-100">
					<div class="error-banner">
						<svg
							class="cursor-pointer"
							xmlns="http://www.w3.org/2000/svg"
							width="312"
						>
							<g id="group-1-cube-1">
								<path
									fill="#1D2125"
									d="M210.6 0l-20 11.2v22.4l20 11.2 20-11.2V11.2L210.6 0z"
								/>
								<path
									fill="#DADEDE"
									d="M210.6 5.3l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-1-cube-2">
								<path
									fill="#1D2125"
									d="M170.6 22.4l-20 11.2V56l20 11.2 20-11.2V33.6l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M170.6 27.7l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-1-cube-3">
								<path
									fill="#1D2125"
									d="M230.6 11.2l-20 11.2v22.4l20 11.2 20-11.2V22.4l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M230.6 16.5L215.3 25l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-1-cube-4">
								<path
									fill="#1D2125"
									d="M250.6 22.4l-20 11.2V56l20 11.2 20-11.2V33.6l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M250.6 27.7l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-1-cube-5">
								<path
									fill="#1D2125"
									d="M190.6 33.6l-20 11.2v22.4l20 11.2 20-11.2V44.8l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M190.6 38.9l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-1-cube-6">
								<path
									fill="#1D2125"
									d="M230.6 33.6l-20 11.2v22.4l20 11.2 20-11.2V44.8l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M230.6 38.9l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-1-cube-7">
								<path
									fill="#1D2125"
									d="M210.6 44.8l-20 11.2v22.4l20 11.2 20-11.2V56l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M210.6 50.1l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-1-cube-8">
								<path
									fill="#1D2125"
									d="M270.6 33.6l-20 11.2v22.4l20 11.2 20-11.2V44.8l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M270.6 38.9l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-1-cube-9">
								<path
									fill="#1D2125"
									d="M290.6 44.8l-20 11.2v22.4l20 11.2 20-11.2V56l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M290.6 50.1l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-1">
								<path
									fill="#1D2125"
									d="M135.3 42.2l-20 11.2v22.4l20 11.2 20-11.2V53.4l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M135.3 47.5L120 56l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-2">
								<path
									fill="#1D2125"
									d="M115.3 53.4l-20 11.2V87l20 11.2 20-11.2V64.6l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M115.3 58.7L100 67.2l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-3">
								<path
									fill="#1D2125"
									d="M95.3 64.6l-20 11.2v22.4l20 11.2 20-11.2V75.8l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M95.3 69.9L80 78.4 95.3 87l15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-4">
								<path
									fill="#1D2125"
									d="M155.3 53.4l-20 11.2V87l20 11.2 20-11.2V64.6l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M155.3 58.7L140 67.2l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-5">
								<path
									fill="#1D2125"
									d="M175.3 64.6l-20 11.2v22.4l20 11.2 20-11.2V75.8l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M175.3 69.9L160 78.4l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-6">
								<path
									fill="#1D2125"
									d="M115.3 75.8L95.3 87v22.4l20 11.2 20-11.2V87l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M115.3 81.1L100 89.6l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-7">
								<path
									fill="#1D2125"
									d="M135.3 87l-20 11.2v22.4l20 11.2 20-11.2V98.2l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M135.3 92.3l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-8">
								<path
									fill="#1D2125"
									d="M155.3 98.2l-20 11.2v22.4l20 11.2 20-11.2v-22.4l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M155.3 103.5L140 112l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-9">
								<path
									fill="#1D2125"
									d="M195.3 75.8l-20 11.2v22.4l20 11.2 20-11.2V87l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M195.3 81.1L180 89.6l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-10">
								<path
									fill="#1D2125"
									d="M215.3 87l-20 11.2v22.4l20 11.2 20-11.2V98.2l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M215.3 92.3l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-11">
								<path
									fill="#1D2125"
									d="M195.3 98.2l-20 11.2v22.4l20 11.2 20-11.2v-22.4l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M195.3 103.5L180 112l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-2-cube-12">
								<path
									fill="#1D2125"
									d="M175.3 109.4l-20 11.2V143l20 11.2 20-11.2v-22.4l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M175.3 114.7l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-3-cube-1">
								<path
									fill="#1D2125"
									d="M60 84.4L40 95.6V118l20 11.2L80 118V95.6L60 84.4z"
								/>
								<path
									fill="#DADEDE"
									d="M60 89.7l-15.3 8.5 15.3 8.6 15.3-8.6L60 89.7"
								/>
							</g>
							<g id="group-3-cube-2">
								<path
									fill="#1D2125"
									d="M20 106.8L0 118v22.4l20 11.2 20-11.2V118l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M20 112.1l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-3-cube-3">
								<path
									fill="#1D2125"
									d="M80 95.6l-20 11.2v22.4l20 11.2 20-11.2v-22.4L80 95.6z"
								/>
								<path
									fill="#DADEDE"
									d="M80 100.9l-15.3 8.5L80 118l15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-3-cube-4">
								<path
									fill="#1D2125"
									d="M100 106.8L80 118v22.4l20 11.2 20-11.2V118l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M100 112.1l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-3-cube-5">
								<path
									fill="#1D2125"
									d="M40 118l-20 11.2v22.4l20 11.2 20-11.2v-22.4L40 118z"
								/>
								<path
									fill="#DADEDE"
									d="M40 123.3l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-3-cube-6">
								<path
									fill="#1D2125"
									d="M80 118l-20 11.2v22.4l20 11.2 20-11.2v-22.4L80 118z"
								/>
								<path
									fill="#DADEDE"
									d="M80 123.3l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-3-cube-7">
								<path
									fill="#1D2125"
									d="M60 129.2l-20 11.2v22.4L60 174l20-11.2v-22.4l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M60 134.5L44.7 143l15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-3-cube-8">
								<path
									fill="#1D2125"
									d="M120 118l-20 11.2v22.4l20 11.2 20-11.2v-22.4L120 118z"
								/>
								<path
									fill="#DADEDE"
									d="M120 123.3l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
							<g id="group-3-cube-9">
								<path
									fill="#1D2125"
									d="M140 129.2l-20 11.2v22.4l20 11.2 20-11.2v-22.4l-20-11.2z"
								/>
								<path
									fill="#DADEDE"
									d="M140 134.5l-15.3 8.5 15.3 8.6 15.3-8.6-15.3-8.5"
								/>
							</g>
						</svg>
						<div class="error-message d-flex flex-column justify-content-center">
							<h2 class="text-center font-weight-bold">Not Found.</h2>
							<div class="text-center pt-3">
								<span class="font-weight-bold">
									If there is a pending transaction, refresh the page.
								</span>
							</div>
							<nuxt-link to="/" class="btn mt-4">Go Back</nuxt-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	layout: 'error',
	props: ['error'],
}
</script>

<style lang="scss" scoped>
$drop-distance: 300px;
$error-animation-step: 0.5s;
.error-wrapper {
	height: 100vh;
}
.error-banner {
	top: 40%;
	left: 50%;
	transform: translate(-40%, -50%);
	position: absolute;
	display: inline-block;
	font-family: Helvetica-neue, Helvetica, Arial, sans-serif;
	color: #788392;

	svg {
		position: relative;
		overflow: visible;
		z-index: 2;
		transform: translate3d(0, 0, 0);
		margin: 3em;
	}
	.error-message {
		margin: 1em 0;
		position: relative;
	}

	h2 {
		font-size: 50px;
		font-weight: normal;
		margin: 0;
		animation: $error-animation-step * 3 ease-out fade-in-slowly;
	}
	span {
		font-size: 20px;
		margin: 8px;
		span {
			animation: $error-animation-step * 4 ease-out fade-in-slowly;
		}
	}
	svg:hover + .error-message {
		animation: error-party 0.9s linear infinite;
		h2 {
			font-size: 0;
			&:before {
				font-size: 20px;
				content: 'On the bright side, you found';
			}
		}
		span {
			font-size: 0;
			&:after {
				font-size: 50px;
				line-height: 1.2em;
				content: 'THE PARTY!';
			}
		}
		span {
			animation: zbounce 0.5s linear infinite;
		}
	}
}

@for $i from 1 through 12 {
	[id$='cube-#{$i}'],
	[id$='cube-#{$i + 12}'],
	[id$='cube-#{$i + 24}'] {
		animation: drop-cube-#{$i} 0.9s cubic-bezier(0.19, 1, 0.32, 1);
		path {
			animation: fade-cube-#{$i} 0.9s cubic-bezier(0.19, 1, 0.32, 1);
		}
	}
}

svg:hover {
	@for $i from 1 through 12 {
		[id$='cube-#{$i}'] path,
		[id$='cube-#{$i + 12}'] path,
		[id$='cube-#{$i + 24}'] path {
			animation: fade-out-cube-#{$i} 0.7s cubic-bezier(0.19, 1, 0.32, 1) infinite;
		}
	}
}

@for $i from 1 through 12 {
	@keyframes drop-cube-#{$i} {
		0%,
		#{7 * $i}% {
			transform: translateY($drop-distance);
		}
		100% {
			transform: translateY(0);
		}
	}
	@keyframes fade-cube-#{$i} {
		0%,
		#{7 * $i}% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes fade-out-cube-#{$i} {
		$start: 3 * $i;
		$mid: 100 - $start;
		0%,
		#{$start}% {
			opacity: 1;
		}
		#{$mid}% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
}

@keyframes error-party {
	0% {
		color: #8e55dd;
	}
	20% {
		color: #967adc;
	}
	40% {
		color: #fef0bd;
	}
	60% {
		color: #d4eef7;
	}
	80% {
		color: #82c1ed;
	}
	100% {
		color: #5d9cec;
	}
}

@keyframes fade-in-slowly {
	0% {
		opacity: 0;
	}
	80% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

@keyframes zbounce {
	0%,
	100% {
		transform: scale(0.95, 0.95);
	}
	50% {
		transform: scale(1, 1);
	}
}
</style>
