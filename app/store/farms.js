// import { getFarmCreated } from "@/services/web3/farmFactory"
import { makeBatchCall } from '@/services/web3/base'
import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'
// import { getContractInstance as misoHelperContract } from "@/services/web3/misoHelper"

const getDefaultState = () => ({
	farms: [],
	lastBlockNumber: 0,
	loading: false,
})

export const state = () => getDefaultState()

export const mutations = {
	SET_FARMS: (state, farms) => {
		state.farms = farms
	},
	MERGE_FARMS: (state, farms) => {
		state.farms = farms.concat(state.farms)
	},
	SET_LOADING: (state, loading) => {
		state.loading = loading
	},
	RESET_STATE: (state) => {
		Object.assign(state, getDefaultState())
	},
}

export const actions = {
	async getFarms({ commit, state }) {
		commit('SET_LOADING', true)
		const methods = [{ methodName: 'getFarms' }]
		const [farms] = await makeBatchCall(misoHelperContract(), methods)
		commit('SET_FARMS', farms)
		commit('SET_LOADING', false)
	},
	// async setFarms({ commit, state }) {
	// 	commit("SET_LOADING", true)
	// 	// const methods = [
	// 	// 	{
	// 	// 		methodName: "getFarms",
	// 	// 		args: ["0x0000000000000000000000000000000000000000"],
	// 	// 	},
	// 	// ]
	// 	const farms = await getFarmCreated(state.lastBlockNumber + 1)
	// 	// const farms = await makeBatchCall(misoHelperContract(), methods)
	// 	if (farms.length > 0) {
	// 		const sortedFarms = sort(farms, "createdAt", "desc")
	// 		if (state.lastBlockNumber !== 0) {
	// 			commit("MERGE_FARMS", sortedFarms)
	// 		} else {
	// 			commit("SET_FARMS", sortedFarms)
	// 		}
	// 	}
	// 	commit("SET_LOADING", false)
	// },
}

export const getters = {
	list: (state) => {
		return state.farms
	},
	size: (state) => {
		return state.farms.length
	},
	loading: (state) => {
		return state.loading
	},
}

// const sort = (arr, obj, orderBy) => {
// 	if (orderBy === "desc") {
// 		return arr.sort((current, next) =>
// 			current[obj] < next[obj] ? 1 : current[obj] > next[obj] ? -1 : 0
// 		)
// 	} else {
// 		return arr.sort((current, next) =>
// 			current[obj] > next[obj] ? 1 : current[obj] < next[obj] ? -1 : 0
// 		)
// 	}
// }
