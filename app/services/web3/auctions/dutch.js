import abi from "@/constants/abis/DutchAuction.json"

let contract

export const getContractInstance = (address) => {
	if (!contract || web3.currentProvider !== contract.currentProvider) {
		contract = new web3.eth.Contract(abi, address)
	} else if (contract.options.address.toLowerCase() !== address.toLowerCase()) {
		contract.options.address = address
	}

	return contract
}

export const tokenPrice = (marketInfo) => {
	return (marketInfo.commitmentsTotal * 1e18) / marketInfo.totalTokens
}

export const clearingPrice = (marketInfo) => {
	const tPrice = tokenPrice(marketInfo)
	const fPrice = priceFunction(marketInfo)
	if (tPrice > fPrice) {
		return tPrice
	}
	return fPrice
}

export const priceFunction = (marketInfo) => {
	if (marketInfo.currentTimestamp <= marketInfo.startTime) {
		return marketInfo.startPrice
	}
	if (marketInfo.currentTimestamp >= marketInfo.endTime) {
		return marketInfo.minimumPrice
	}
	return currentPrice(marketInfo)
}

const currentPrice = (marketInfo) => {
	const priceDiff =
		(marketInfo.currentTimestamp - marketInfo.startTime) * priceDrop(marketInfo)

	return marketInfo.startPrice - priceDiff
}

const priceDrop = (marketInfo) => {
	const numerator = marketInfo.startPrice - marketInfo.minimumPrice
	const denominator = marketInfo.endTime - marketInfo.startTime
	return parseInt(numerator / denominator)
}
