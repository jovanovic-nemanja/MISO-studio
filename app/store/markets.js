import { getFarmCreated } from '@/services/web3/farmFactory'

const getDefaultState = () => ({
	markets: [],
	lastBlockNumber: 0,
	loading: false,
})

export const state = () => getDefaultState()

export const mutations = {
	SET_FARMS: (state, markets) => {
		state.markets = markets
		state.lastBlockNumber = markets[0].blockNumber
	},
	MERGE_FARMS: (state, markets) => {
		state.markets = markets.concat(state.markets)
		state.lastBlockNumber = markets[0].blockNumber
	},
	SET_LOADING: (state, loading) => {
		state.loading = loading
	},
	RESET_STATE: (state) => {
		Object.assign(state, getDefaultState())
	},
}

export const actions = {
	async setFarms({ commit, state }) {
		commit('SET_LOADING', true)
		const markets = await getFarmCreated(state.lastBlockNumber + 1)
		console.log('markets:', markets)
		if (markets.length > 0) {
			const sortedFarms = sort(markets, 'createdAt', 'desc')
			if (state.lastBlockNumber !== 0) {
				commit('MERGE_FARMS', sortedFarms)
			} else {
				commit('SET_FARMS', sortedFarms)
			}
		}
		commit('SET_LOADING', false)
	},
}

export const getters = {
	list: (state) => {
		return state.markets
	},
	size: (state) => {
		return state.markets.length
	},
	loading: (state) => {
		return state.loading
	},
}

const sort = (arr, obj, orderBy) => {
	if (orderBy === 'desc') {
		return arr.sort((current, next) =>
			current[obj] < next[obj] ? 1 : current[obj] > next[obj] ? -1 : 0
		)
	} else {
		return arr.sort((current, next) =>
			current[obj] > next[obj] ? 1 : current[obj] < next[obj] ? -1 : 0
		)
	}
}
