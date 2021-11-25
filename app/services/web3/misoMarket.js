import { misoMarket } from '@/constants/contracts'
import {
	sendTransaction as _sendTransaction,
	getNetworkId,
	makeBatchCall as _makeBatchCall,
} from './base'

const misoMarketAbi = misoMarket.abi
const misoMarketAddress = misoMarket.address
let contractInstance

export const getContractInstance = () => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask
	) {
		const address = misoMarketAddress[getNetworkId()]
		contractInstance = new web3.eth.Contract(misoMarketAbi, address)
	}
	return contractInstance
}

export const sendTransaction = async (methodName, args, options) => {
	getContractInstance()
	const method = contractInstance.methods[methodName](...args)
	return await _sendTransaction(method, options)
}

export const makeBatchCall = async (methods) => {
	getContractInstance()
	return await _makeBatchCall(contractInstance, methods)
}

export const subscribeToMisoMarketCreatedEvent = (fromBlock = 0, store) => {
	getContractInstance()
	return contractInstance.events.MarketCreated({
		fromBlock,
	})
}

// export const misoMarketContract = getContractInstance()
