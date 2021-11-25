import Web3 from 'web3'
import { DEFAULT_NETWORK, EXPLORERS } from '../constants/networks'

export default async ({ store }) => {
	if (window.ethereum) {
		window.ethereum.autoRefreshOnNetworkChange = false
		await store.dispatch('ethereum/setProvider', window.ethereum)
	} else {
		window.web3 = getHttpWeb3Provider()
	}
	window.web3socket = getWssWeb3Provider()
}

const getHttpWeb3Provider = () => {
	const httpProvider = EXPLORERS[DEFAULT_NETWORK].httpProvider
	return new Web3(new Web3.providers.HttpProvider(httpProvider))
}

const getWssWeb3Provider = () => {
	const wssProvider = EXPLORERS[DEFAULT_NETWORK].wssProvider
	return new Web3(new Web3.providers.WebsocketProvider(wssProvider))
}
