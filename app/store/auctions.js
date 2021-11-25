// import { getAuctions } from "@/services/web3/auctionFactory"
import { makeBatchCall } from '@/services/web3/base'
import { getContractInstance as misoHelperContract } from '@/services/web3/misoHelper'

export const state = () => ({
	auctions: [],
	loading: false,
})

export const mutations = {
	SET_AUCTIONS: (state, auctions) => {
		state.auctions = auctions
	},
	MERGE_AUCTIONS: (state, auctions) => {
		state.auctions = auctions.concat(state.auctions)
	},
	SET_LOADING: (state, loading) => {
		state.loading = loading
	},
}

export const actions = {
	async getAuctions({ commit, state }) {
		commit('SET_LOADING', true)
		const methods = [{ methodName: 'getMarkets' }]
		const auctions = await makeBatchCall(misoHelperContract(), methods)
		if (auctions.length > 0) {
			// const sortedAuctions = sort(auctions, "createdAt", "desc")
			commit(
				'SET_AUCTIONS',
				auctions[0].filter(
					(auction) => auction.addr !== '0xEd4A285845f19945b0EbC04a3165e3DCAf62fEeD'
				)
			)
		}
		commit('SET_LOADING', false)
	},
	// async getAuctions({ commit, state }) {
	// 	commit("SET_LOADING", true)
	// 	const auctionsInStore = state.auctions
	// 	const fromBlock =
	// 		auctionsInStore.length > 0 ? auctionsInStore[0].blockNumber : 0
	// 	const auctions = await getAuctions(fromBlock + 1)
	// 	if (auctions.length > 0) {
	// 		const sortedAuctions = sort(auctions, "createdAt", "desc")
	// 		if (fromBlock === 0) {
	// 			commit("SET_AUCTIONS", sortedAuctions)
	// 		} else {
	// 			commit("MERGE_AUCTIONS", sortedAuctions)
	// 		}
	// 	}
	// 	commit("SET_LOADING", false)
	// },
}

export const getters = {
	list: (state) => {
		return state.auctions
	},
	size: (state) => {
		return state.auctions.length
	},
	loading: (state) => {
		return state.loading
	},
	auctionInProcess: (state) => {
		const finishedAuctions = state.auctions.filter((el) => el.status === 'in process')
		return finishedAuctions.length
	},
	finishedAuctions: (state) => {
		const finishedAuctions = state.auctions.filter((el) => el.status === 'finished')
		return finishedAuctions.length
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
