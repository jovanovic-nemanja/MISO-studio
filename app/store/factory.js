export const state = () => ({
	model: {},
})

export const mutations = {
	UPDATE_MODEL(state, payload) {
		Object.assign(state.model, payload)
	},
}

export const getters = {
	liquidModel(state) {
		return state.model
	},
}
