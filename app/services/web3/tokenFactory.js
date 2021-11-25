import { tokenFactory } from '@/constants/contracts'
import { getEvents, getNetworkId, unix2datetime } from './base'

const tokenFactoryAbi = tokenFactory.abi
const tokenFactoryAddress = tokenFactory.address
let contractInstance

export const getContractInstance = () => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask
	) {
		const address = tokenFactoryAddress[getNetworkId()]
		contractInstance = new web3.eth.Contract(tokenFactoryAbi, address)
	}

	return contractInstance
}

export const getCreatedTokens = async (fromBlock) => {
	getContractInstance()
	const events = await getEvents(contractInstance, 'TokenCreated', fromBlock)
	const tokens = []
	for (let i = 0; i < events.length; i++) {
		const token = await getFixedTokenDetailFromEvent(events[i])
		tokens.push(token)
	}
	return tokens
}

export const subscribeToTokenCreatedEvent = (fromBlock = 0) => {
	getContractInstance()
	return contractInstance.events.TokenCreated({
		fromBlock,
	})
}

const getFixedTokenDetailFromEvent = async (event) => {
	const symbol = event.returnValues.symbol
	const name = event.returnValues.name
	const tokenTemplate = event.returnValues.tokenTemplate
	const address = event.returnValues.addr
	const blockNumber = event.blockNumber
	const block = await web3.eth.getBlock(blockNumber)
	const createdAt = unix2datetime(block.timestamp)

	const token = { address, name, symbol, tokenTemplate, createdAt, blockNumber }
	return token
}
