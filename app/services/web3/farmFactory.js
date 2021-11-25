import { farmFactory } from "@/constants/contracts"
import {
	sendTransaction as _sendTransaction,
	makeBatchCall as _makeBatchCall,
	getNetworkId,
	getEvents,
	unix2datetime,
} from './base'

const farmFactoryAbi = farmFactory.abi
const farmFactoryAddress = farmFactory.address
let contractInstance

const initContractInstance = () => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask
	) {
		const address = farmFactoryAddress[getNetworkId()]
		contractInstance = new web3.eth.Contract(farmFactoryAbi, address)
	}
}

export const sendTransaction = async (methodName, args, options) => {
	initContractInstance()
	const method = contractInstance.methods[methodName](...args)
	return await _sendTransaction(method, options)
}

export const getFarmCreated = async (fromBlock) => {
	initContractInstance()
	const events = await getEvents(contractInstance, "FarmCreated", fromBlock)
	const farms = []
	for (let i = 0; i < events.length; i++) {
		const token = await getFixedFarmDetailFromEvent(events[i])
		farms.push(token)
	}
	return farms
}

export const makeBatchCall = async (methods) => {
	initContractInstance()
	return await _makeBatchCall(contractInstance, methods)
}

export const subscribeToFarmCreatedEvent = (fromBlock = 0, store) => {
	initContractInstance()
	return contractInstance.events.FarmCreated({
		fromBlock,
	})
}

const getFixedFarmDetailFromEvent = async (event) => {
	console.log("event", event)
	const address = event.returnValues.addr
	const blockNumber = event.blockNumber
	const owner = event.returnValues.owner
	const block = await web3.eth.getBlock(blockNumber)
	const createdAt = unix2datetime(block.timestamp)
	const farmTemplate = event.returnValues.farmTemplate

	const farm = {
		address,
		owner,
		farmTemplate,
		blockNumber,
		createdAt,
	}
	return farm
}
