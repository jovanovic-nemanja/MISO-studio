import { misoLauncher } from '@/constants/contracts'
import {
	sendTransaction as _sendTransaction,
	makeBatchCall as _makeBatchCall,
	getNetworkId,
} from './base'

const misoLauncherAbi = misoLauncher.abi
const misoLauncherAddress = misoLauncher.address
let contractInstance

export const initContractInstance = () => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask
	) {
		const address = misoLauncherAddress[getNetworkId()]
		contractInstance = new web3.eth.Contract(misoLauncherAbi, address)
	}
	return contractInstance
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

export const subscribeToMisoLauncherCreatedEvent = (fromBlock = 0, store) => {
	initContractInstance()
	return contractInstance.events.LauncherCreated({
		fromBlock,
	})
}
