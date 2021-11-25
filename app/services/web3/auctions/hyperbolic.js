import { hyperbolicAuction } from '@/constants/contracts'

const abi = hyperbolicAuction.abi
let contract

export const getContractInstance = (address) => {
	if (!contract || web3.currentProvider !== contract.currentProvider) {
		contract = new web3.eth.Contract(abi, address)
	} else if (contract.options.address.toLowerCase() !== address.toLowerCase()) {
		contract.options.address = address
	}

	return contract
}
