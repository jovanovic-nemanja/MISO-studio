import { masterChefTemplate } from '@/constants/contracts'

const masterChefAbi = masterChefTemplate.abi
let contractInstance

export const getContractInstance = (address) => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask
	) {
		contractInstance = new web3.eth.Contract(masterChefAbi, address)
	} else if (
		contractInstance.options.address.toLowerCase() !== address.toLowerCase()
	) {
		contractInstance.options.address = address
	}

	return contractInstance
}
