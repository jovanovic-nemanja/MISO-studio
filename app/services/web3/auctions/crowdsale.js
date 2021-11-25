import CROWDSALE_ABI from "@/constants/abis/Crowdsale.json"

let contract

export const getContractInstance = (address) => {
	if (!contract || web3.currentProvider !== contract.currentProvider) {
		contract = new web3.eth.Contract(CROWDSALE_ABI, address)
	} else if (contract.options.address.toLowerCase() !== address.toLowerCase()) {
		contract.options.address = address
	}

	return contract
}
