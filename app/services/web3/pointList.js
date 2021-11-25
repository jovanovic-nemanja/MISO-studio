import { pointList } from '../../constants/contracts'

const pointListAbi = pointList.abi
let contractInstance

export const getContractInstance = (address) => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask
	) {
		contractInstance = new web3.eth.Contract(pointListAbi, address)
	} else if (
		contractInstance.options.address.toLowerCase() !== address.toLowerCase()
	) {
		contractInstance.options.address = address
	}
	return contractInstance
}
