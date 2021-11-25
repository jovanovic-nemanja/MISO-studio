/* eslint-disable no-async-promise-executor */
import Swal from 'sweetalert2'
import { EXPLORERS, RIGHT_NETWORKS, DEFAULT_NETWORK } from '~/constants/networks'

let store

if (process.browser) {
	window.onNuxtReady(({ $alert, $store }) => {
		store = $store
	})
}

export const sendTransaction = (method, options) => {
	return new Promise(async (resolve, reject) => {
		if (store.getters['ethereum/isOk']) {
			try {
				const gasPriceInWei = await getGasPrice()
				// const estimatedGas = await estimateGas(method, options.from, gasPriceInWei * 20);

				Object.assign(options, {
					gasPrice: toHex(gasPriceInWei),
					// gasLimit: estimatedGas,
				})

				method.send(options, (err, txHash) => {
					if (err) {
						console.log('err:', err)
						return resolve(false)
					}
					// store.dispatch('notification/addTransaction', { transaction: newTransaction, coinbase: from });
					showTransactionSentModal(txHash)
					return resolve(txHash)
				})
			} catch (error) {
				if (error.code !== 4001) showErrorModal(error.message)
				return resolve(false)
			}
		} else {
			// store.dispatch('ethereum/enableAccount')
			showConnectionModal()
			resolve(false)
		}
	})
}

export const sendTransactionAndWait = async (method, options, callback) => {
	if (store.getters['ethereum/isOk']) {
		try {
			const gasPriceInWei = await getGasPrice()
			Object.assign(options, {
				gasPrice: toHex(gasPriceInWei),
				// gasLimit: estimatedGas,
			})

			method
				.send(options, (err, txHash) => {
					if (err) {
						console.log('err:', err)
						return callback(false)
					}
					showTransactionSentModal(txHash)
				})
				.once('receipt', (receipt) => {
					return callback(receipt)
				})
				// eslint-disable-next-line node/handle-callback-err
				.on('error', (error) => {
					return callback(false)
				})
		} catch (error) {
			if (error.code !== 4001) showErrorModal(error.message)
			return callback(false)
		}
	} else {
		console.log('fire')
		showConnectionModal()
		return callback(false)
	}
}

/**
 * @desc calls contract functions
 * @param contractInstance
 * @param methods {
 *   methodName - name of method,
 *   args[] - method's arguments,
 *   opts - additional options
 * }
 * @return array - contract methods info
 */
export const makeBatchCall = async (contractInstance, methods) => {
	try {
		const promises = await methods.map(async (method) => {
			let methodToCall
			if (method.args) {
				methodToCall = contractInstance.methods[method.methodName].apply(
					null,
					method.args
				)
			} else {
				methodToCall = contractInstance.methods[method.methodName]()
			}

			const response = await methodToCall.call(method.opts)
			return response
		})
		const result = await Promise.all(promises)
		return result
	} catch (err) {
		console.log(err)
		return false
	}
}

const showTransactionSentModal = (txHash) => {
	const explorer = store.getters['ethereum/explorer']
	Swal.fire({
		icon: 'success',
		title: 'Your transaction has been sent...',
		html:
			'See on etherscan: ' +
			`<a href="${explorer.root}${explorer.tx}${txHash}" target="_blank">here</a>.`,
		buttonsStyling: false,
		showCancelButton: false,
		confirmButtonText: 'Close',
		confirmButtonClass: 'btn btn-fill',
	})
}

const showErrorModal = (errorMessage) => {
	Swal.fire({
		icon: 'error',
		title: 'An unexpected error occurred',
		// html: "Please try again or reload the page.",
		html: `<p>Description: ${errorMessage}</p>
                       <b>Please make sure you have entered the correct data.</b></br>
                       <b>You may also reload the page and try again.</b>`,
		buttonsStyling: false,
		showCancelButton: false,
		confirmButtonText: 'Close',
		confirmButtonClass: 'btn btn-fill',
	})
}

const showConnectionModal = () => {
	Swal.fire({
		icon: 'warning',
		title: getConnectionTitle(),
		html: getConnectionBody(),
		buttonsStyling: false,
		showCancelButton: false,
		confirmButtonText: 'CLOSE',
		confirmButtonClass: 'btn btn-fill',
	})
}

const getConnectionTitle = () => {
	const networkId = store.getters['ethereum/networkId']
	const isRightNetwork = store.getters['ethereum/isRightNetwork']
	if (store.getters['ethereum/isOk']) {
		return EXPLORERS[networkId].name
	} else if (!isRightNetwork && networkId === 1) {
		return 'Testnet only, Mainnet upgrade'
	} else if (!isRightNetwork) {
		return 'Wrong network'
	} else {
		return 'Account is not connected'
	}
}

const getConnectionBody = () => {
	const networkId = store.state.ethereum.networkId
	const isRightNetwork = store.getters['ethereum/isRightNetwork']
	const defaultNetworkName =
		EXPLORERS[store.getters['ethereum/defaultNetworkId']].name
	try {
		if (!isRightNetwork) {
			return `You are on ${EXPLORERS[networkId].name} . Please change your network to ${defaultNetworkName}.`
		} else {
			return `Please connect wallet to continue.`
		}
	} catch (error) {
		return 'An unexpected error occurred. Please try loading the page'
	}
}

export const getEvents = async (contractInstance, eventName, fromBlock) => {
	try {
		const events = await contractInstance.getPastEvents(eventName, {
			fromBlock,
			toBlock: 'latest',
		})
		return events
	} catch (error) {
		console.log('error:', error)
	}
}

// eslint-disable-next-line no-unused-vars
const estimateGas = (method, from, gas) => {
	return new Promise((resolve, reject) => {
		method.estimateGas(
			{
				from,
				gas,
			},
			(err, gasAmount) => {
				if (!err) {
					return resolve(gasAmount)
				}
				return reject(err)
			}
		)
	})
}

export const waitForReceipt = (txhash) => {
	return new Promise(async (resolve) => {
		try {
			const receipt = await web3.eth.getTransactionReceipt(txhash)
			if (receipt) {
				resolve(receipt)
			} else {
				window.setTimeout(() => {
					waitForReceipt(txhash)
				}, 1000)
			}
		} catch (err) {
			console.log('err:', err)
		}
	})
}

export const getTransactionDetail = async (transactionHash) => {
	try {
		const transactionDetail = await web3.eth.getTransaction(transactionHash)
		return transactionDetail
	} catch (error) {
		console.log('error:', error)
	}
}

export const getNetworkId = () => {
	if (web3.givenProvider) {
		const currentProvidersNetwork = parseInt(
			web3.givenProvider.chainId || web3.givenProvider.networkVersion
		)
		const isRightNetwork = RIGHT_NETWORKS.includes(currentProvidersNetwork)
		if (isRightNetwork) {
			return currentProvidersNetwork
		}
	}
	return DEFAULT_NETWORK
}

export const isContractExists = async (contractAddress) => {
	try {
		const code = await web3.eth.getCode(contractAddress)

		return code !== '0x'
	} catch {}
}

export const isAddress = (address) => {
	return web3.utils.isAddress(address)
}

export const toWei = (amount, unit) => {
	return web3.utils.toWei(amount.toString(), unit)
}

export const fromWei = (amount, unit = 'ether') => {
	return web3.utils.fromWei(amount.toString(), unit)
}

export const toHex = (value) => {
	return web3.utils.toHex(value)
}

export const getGasPrice = async () => {
	return await web3.eth.getGasPrice()
}

// TODO - move to utils
export const unix2datetime = (unixtime) => {
	const date = new Date(unixtime * 1000)
	const year = date.getFullYear()
	const month =
		date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
	const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
	const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
	const min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
	// const sec = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
	const dateTimeString = year + '-' + month + '-' + day + ' ' + hour + ':' + min
	return dateTimeString
}
