import { listFactory } from '@/constants/contracts'
import { getNetworkId } from './base'

const listFactoryAbi = listFactory.abi
const listFactoryAddress = listFactory.address
let contractInstance

export const getContractInstance = () => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask
	) {
		const address = listFactoryAddress[getNetworkId()]
		contractInstance = new web3.eth.Contract(listFactoryAbi, address)
	}

	return contractInstance
}

export const subscribeToPointListDeployedEvent = (fromBlock = 0) => {
	getContractInstance()
	return contractInstance.events.PointListDeployed({
		fromBlock,
	})
}
