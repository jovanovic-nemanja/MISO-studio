import { ERC20 } from '@/constants/contracts'
import { sendTransaction, sendTransactionAndWait, toWei } from './base'

const fixedTokenAbi = ERC20.abi
let contractInstance

const initContractInstance = (address) => {
	if (
		!contractInstance ||
		web3.currentProvider.isMetaMask !== contractInstance.currentProvider.isMetaMask
	) {
		contractInstance = new web3.eth.Contract(fixedTokenAbi, address)
	} else if (
		contractInstance.options.address.toLowerCase() !== address.toLowerCase()
	) {
		contractInstance.options.address = address
	}
}

export const approve = async (contractAddress, data, from) => {
	initContractInstance(contractAddress)
	const method = contractInstance.methods.approve(
		data.spender,
		toWei(data.amount, 'ether')
	)

	const txHash = await sendTransaction(method, from)

	return txHash
}

export const approveAndWait = async (contractAddress, data, from, callback) => {
	initContractInstance(contractAddress)
	const method = contractInstance.methods.approve(
		data.spender,
		toWei(data.amount, 'ether')
	)

	const receipt = await sendTransactionAndWait(method, from, 0, callback)

	return receipt
}

export const transfer = async (contractAddress, data, from) => {
	initContractInstance(contractAddress)
	const method = contractInstance.methods.transfer(
		data.to,
		toWei(data.amount, 'ether')
	)

	const txHash = await sendTransaction(method, from)

	return txHash
}

export const transferFrom = async (contractAddress, data, from) => {
	initContractInstance(contractAddress)
	const method = contractInstance.methods.transferFrom(
		data.from,
		data.to,
		toWei(data.amount, 'ether')
	)
	const txHash = await sendTransaction(method, from)

	return txHash
}

export const transferOwnership = async (contractAddress, data, from) => {
	initContractInstance(contractAddress)
	const method = contractInstance.methods.transferOwnership(data.newOwner)

	const txHash = await sendTransaction(method, from)

	return txHash
}

export const acceptOwnership = async (contractAddress, from) => {
	initContractInstance(contractAddress)
	const method = contractInstance.methods.acceptOwnership()

	const txHash = await sendTransaction(method, from)

	return txHash
}

export const call = async (contractAddress, methods) => {
	initContractInstance(contractAddress)
	const response = []
	for (const method of methods) {
		let result
		if (method.args) {
			result = await contractInstance.methods[method.methodName]
				.apply(null, method.args)
				.call(method.opts)
		} else {
			result = await contractInstance.methods[method.methodName]().call(method.opts)
		}
		response.push(result)
	}
	return response
}

export const subscribeToTokenDeployedEvent = (fromBlock = 0, store) => {
	initContractInstance()
	return contractInstance.events.TokenDeployed({
		fromBlock,
	})
}

export const isErc20Token = async (tokenAddress) => {
	try {
		initContractInstance(tokenAddress)
		const name = await contractInstance.methods.name().call()
		const symbol = await contractInstance.methods.symbol().call()

		return { name, symbol }
	} catch (err) {
		console.log('err:', err)
		return false
	}
}
