import { poolLiquidityTemplate } from '@/constants/contracts'
import {
	getNetworkId,
	makeBatchCall as _makeBatchCall,
	sendTransaction as _sendTransaction,
} from '../base'

const poolLiquidityTemplateAbi = poolLiquidityTemplate.abi
const poolLiquidityTemplateAddress = poolLiquidityTemplate.address
let contractInstance

const initContractInstance = () => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask
	) {
		const address = poolLiquidityTemplateAddress[getNetworkId()]
		contractInstance = new web3.eth.Contract(poolLiquidityTemplateAbi, address)
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

export const subscribeToLiquidityAddedEvent = (fromBlock = 0, store) => {
	initContractInstance()
	return contractInstance.events.LiquidityAdded({
		fromBlock,
	})
}
