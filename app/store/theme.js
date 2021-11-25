export const state = () => ({
	theme: JSON.parse(localStorage.getItem('miso-theme')) || true,
})

export const mutations = {
	SET_THEME(state, value) {
		state.theme = value
	},
}

export const getters = {
	getMode(state) {
		return state.theme
	},
}
