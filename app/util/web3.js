import BigNumber from 'bignumber.js'
/**
 * Shorten an Ethereum address. `charsLength` allows to change the number of
 * characters on both sides of the ellipsis.
 *
 * Examples:
 *   shortenAddress('0x19731977931271')    // 0x1973…1271
 *   shortenAddress('0x19731977931271', 2) // 0x19…71
 *   shortenAddress('0x197319')            // 0x197319 (already short enough)
 *
 * @param {string} address The address to shorten
 * @param {number} [charsLength=4] The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
export const shortenAddress = (address, charsLength = 4) => {
	const prefixLength = 2 // "0x"
	if (!address) {
		return ''
	}
	if (address.length < charsLength * 2 + prefixLength) {
		return address
	}
	return (
		address.slice(0, charsLength + prefixLength) + '…' + address.slice(-charsLength)
	)
}

/**
 * Alias for shortenAddress (to generalize its use)
 */
export const shortenTransaction = shortenAddress

export const shortenPartition = shortenAddress

export const formatTokenAmount = (amount, decimals) => {
	toDecimals(amount, decimals)
}

export const toDecimals = (value, decimals = 18) => {
	const TENPOW_ = BigNumber(10).pow(decimals)
	return BigNumber(value).div(TENPOW_).toFixed()
}

export const to18Decimals = (value) => {
	const TENPOW18 = BigNumber(10).pow(18)
	return BigNumber(value).multipliedBy(TENPOW18).toFixed(0)
}

export const toNDecimals = (value, decimals) => {
	const TENPOW = BigNumber(10).pow(decimals)
	return BigNumber(value).multipliedBy(TENPOW).toFixed(0)
}

export const toFixed = (value, decimals = 0, rounding = 1) => {
	return BigNumber(value).toFixed(decimals, rounding)
}

export const toPrecision = (value, precision) => {
	const number = BigNumber(value).toPrecision(precision)
	return BigNumber(number).toFixed()
}

export const multiplyNumbers = (a, b) => {
	if (!a || !b) return 0
	return BigNumber(a).multipliedBy(b).toFixed()
}

export const divNumbers = (a, b) => {
	if (!a || !b) return 0
	return BigNumber(a).dividedBy(b).toFixed()
}

export const toDecimalPlaces = (value, decimals = 5) => {
	return BigNumber(value).decimalPlaces(Number(decimals)).toString()
}
