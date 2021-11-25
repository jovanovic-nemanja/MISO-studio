import { recipe02 } from "../../../constants/contracts"
import {
	getNetworkId,
	makeBatchCall as _makeBatchCall,
	sendTransaction as _sendTransaction,
} from "../base"

const recipe02Abi = recipe02.abi
const recipe02Address = recipe02.address
let contractInstance

const initContractInstance = () => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !==
			contractInstance.currentProvider.isMetaMask
	) {
		const address = recipe02Address[getNetworkId()]
		contractInstance = new web3.eth.Contract(recipe02Abi, address)
	}
}

export const sendTransaction = async (methodName, args, options) => {
	initContractInstance()
	const method = contractInstance.methods[methodName](...args)
	return await _sendTransaction(method, options)
}

export const makeBatchCall = async (methods) => {
	initContractInstance()
	return await _makeBatchCall(contractInstance, methods)
}

export const subscribeToTokensPurchasedEvent = (fromBlock = 0, store) => {
	initContractInstance()
	return contractInstance.events.TokensPurchased({
		fromBlock,
	})
}
