export default function ({ store, redirect }) {
	// If the user is not authenticated
	console.log(store.state.factory)
	if (Object.keys(store.state.factory.model).length === 0) {
		return redirect('/factory/liquidity')
	}
}
