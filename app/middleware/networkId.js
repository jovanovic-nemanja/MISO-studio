export default function ({ store, route, redirect }) {
	// If the user is not authenticated
	console.log(route)
	const minnet = ['farms', 'factory']
	// for minnet redirect
	if (store.getters['ethereum/networkId'] === 1) {
		minnet.forEach((item) => {
			if (route.fullPath.includes(item)) {
				redirect('/')
			}
		})
	}
}
