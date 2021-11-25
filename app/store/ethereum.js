import Web3 from 'web3'
import {
	EXPLORERS,
	RIGHT_NETWORKS,
	DEFAULT_NETWORK,
	CHAIN_IDS,
} from '@/constants/networks'
import walletProvider from '../services/walletProvider'

export const state = () => ({
	networkId: null,
	coinbase: null,
	metamask: false,
	defaultNetworkId: DEFAULT_NETWORK,
	explorer: {
		root: null,
		address: null,
		tx: null,
	},
	gasPrice: 0,
	nativeCurrency: {
		name: null,
		symbol: null,
		decimals: null,
	},
})

export const mutations = {
	SET_COINBASE: (state, account) => {
		state.coinbase = account
	},
	SET_NETWORK: (state, networkId) => {
		state.networkId = parseInt(networkId)

		const chainId = CHAIN_IDS.find(
			(chainId) => parseInt(chainId.chainId) === state.networkId
		)
		if (chainId) {
			state.nativeCurrency = chainId.nativeCurrency
		}
	},
	SET_LOADING: (state, loading) => {
		state.loading = loading
	},
	SET_EXPLORER: (state, payload) => {
		state.explorer = payload
	},
	SET_METAMASK: (state, payload) => {
		state.metamask = payload
	},
}

export const actions = {
	async enableAccount({ dispatch }) {
		const provider = await walletProvider.connectWallet()
		await dispatch('setProvider', provider)
	},
	async disconnectAccount({ commit }) {
		await walletProvider.disconnectProvider()
		commit('SET_COINBASE', null)
	},
	async changeWallet({ dispatch }) {
		const provider = await walletProvider.changeWallet()
		await dispatch('setProvider', provider)
	},
	async setProvider({ commit, state, dispatch }, provider) {
		if (provider) {
			if (provider.isMetaMask) {
				commit('SET_METAMASK', true)
			} else if (state.metamask) {
				commit('SET_METAMASK', false)
			}
			const [account] = await provider.request({ method: 'eth_accounts' })
			const networkId = await provider.request({ method: 'net_version' })

			provider.on('accountsChanged', (accounts) => {
				if (state.coinbase) {
					commit('SET_COINBASE', accounts[0])
				}
			})

			provider.on('chainChanged', (chainId) => {
				// dispatch('setNetwork', parseInt(chainId))
				location.reload()
			})

			commit('SET_COINBASE', account)
			dispatch('setNetwork', networkId)

			if (isRightNetwork(networkId)) {
				web3 = new Web3(provider)
			} else {
				const httpProvider = EXPLORERS[state.defaultNetworkId].httpProvider
				web3 = new Web3(new Web3.providers.HttpProvider(httpProvider))
			}
		}
	},

	setCoinbase({ commit }, payload) {
		commit('SET_COINBASE', payload)
	},

	setNetwork({ commit, state }, networkId) {
		commit('SET_NETWORK', networkId)
		if (isRightNetwork(networkId)) {
			commit('SET_EXPLORER', EXPLORERS[networkId].explorer)
		} else {
			commit('SET_EXPLORER', EXPLORERS[state.defaultNetworkId].explorer)
		}
	},

	setExplorer({ commit }, payload) {
		commit('SET_EXPLORER', payload)
	},
}

export const getters = {
	isOk: (state) => {
		return !!(isRightNetwork(state.networkId) && state.coinbase)
	},

	isRightNetwork: (state) => {
		return isRightNetwork(state.networkId)
	},

	rightNetwork: (state) => {
		return state.rightNetwork
	},

	networkId: (state) => {
		return state.networkId
	},

	nativeCurrency: (state) => {
		return state.nativeCurrency
	},

	defaultNetworkId: (state) => {
		return state.defaultNetworkId
	},

	currentProvidersNetworkId: (state) => {
		if (isRightNetwork(state.networkId)) {
			return state.networkId
		} else {
			return state.defaultNetworkId
		}
	},

	coinbase: (state) => {
		return state.coinbase
	},

	explorer: (state) => {
		return state.explorer
	},

	txUrl: (state) => {
		return state.explorer.root + state.explorer.tx
	},

	gasPrice: (state) => {
		return state.gasPrice
	},

	isMetamask: (state) => {
		return state.metamask
	},
}

const isRightNetwork = (netId) => {
	return RIGHT_NETWORKS.includes(parseInt(netId))
}
