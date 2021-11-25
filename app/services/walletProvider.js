// import Web3 from "web3"
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

const providerOptions = {
	walletconnect: {
		display: {
			name: 'Wallet Connect',
			description: 'Scan qrcode with your mobile wallet',
		},
		package: WalletConnectProvider,
		options: {
			infuraId: '06c80c13728d4878a465b5a097a158e7',
		},
	},
}
const theme = {
	background: '#050f39',
	main: 'white',
	secondary: 'rgb(136, 136, 136)',
	border: 'rgba(195, 195, 195, 0.14)',
	hover: '#000a35',
}

const web3Modal = new Web3Modal({
	cacheProvider: false,
	providerOptions,
	theme,
	disableInjectedProvider: false,
})

export default {
	async connectWallet() {
		try {
			return await web3Modal.connect()
		} catch (e) {
			console.log('Could not get a wallet connection', e)
		}
	},

	async disconnectProvider() {
		if (web3.currentProvider.close) {
			web3.currentProvider.close()
		}
		await web3Modal.clearCachedProvider()
	},
	async changeWallet() {
		try {
			if (web3.currentProvider.close) {
				web3.currentProvider.close()
			}
			return await web3Modal.connect()
		} catch (e) {
			console.log('Could not get a wallet connection', e)
		}
	},
}
