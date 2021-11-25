import { ERC20 } from "../../constants/contracts"

const fixedTokenAbi = ERC20.abi
let contractInstance

export const getContractInstance = (address) => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !==
			contractInstance.currentProvider.isMetaMask
	) {
		contractInstance = new web3.eth.Contract(fixedTokenAbi, address)
	} else if (
		contractInstance.options.address.toLowerCase() !== address.toLowerCase()
	) {
		contractInstance.options.address = address
	}
	return contractInstance
}

export const isErc20Token = async (tokenAddress) => {
	try {
		getContractInstance(tokenAddress)
		const name = await contractInstance.methods.name().call()
		const symbol = await contractInstance.methods.symbol().call()
		const decimals = await contractInstance.methods.decimals().call()

		return { name, symbol, decimals }
	} catch (err) {
		return false
	}
}
