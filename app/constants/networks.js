import { ChainId } from '@sushiswap/sdk'
import Arbitrum from '@/assets/networks/arbitrum-network.jpg'
import Avalanche from '@/assets/networks/avalanche-network.jpg'
import Bsc from '@/assets/networks/bsc-network.jpg'
import Fantom from '@/assets/networks/fantom-network.jpg'
import Goerli from '@/assets/networks/goerli-network.jpg'
import Harmony from '@/assets/networks/harmonyone-network.jpg'
import Heco from '@/assets/networks/heco-network.jpg'
import Kovan from '@/assets/networks/kovan-network.jpg'
import Mainnet from '@/assets/networks/mainnet-network.jpg'
import Matic from '@/assets/networks/matic-network.jpg'
import Moonbeam from '@/assets/networks/moonbeam-network.jpg'
import OKEx from '@/assets/networks/okex-network.jpg'
import Polygon from '@/assets/networks/polygon-network.jpg'
import Rinkeby from '@/assets/networks/rinkeby-network.jpg'
import Ropsten from '@/assets/networks/ropsten-network.jpg'
import xDai from '@/assets/networks/xdai-network.jpg'

export const RIGHT_NETWORKS = [1, 5, 3, 4, 42, 97, 80001]
export const DEFAULT_NETWORK = 1

export const NETWORK_ICON = {
	[ChainId.MAINNET]: Mainnet,
	[ChainId.ROPSTEN]: Ropsten,
	[ChainId.RINKEBY]: Rinkeby,
	[ChainId.GÖRLI]: Goerli,
	[ChainId.KOVAN]: Kovan,
	[ChainId.FANTOM]: Fantom,
	[ChainId.FANTOM_TESTNET]: Fantom,
	[ChainId.BSC]: Bsc,
	[ChainId.BSC_TESTNET]: Bsc,
	[ChainId.MATIC]: Polygon,
	[ChainId.MATIC_TESTNET]: Matic,
	[ChainId.XDAI]: xDai,
	[ChainId.ARBITRUM]: Arbitrum,
	[ChainId.MOONBASE]: Moonbeam,
	[ChainId.AVALANCHE]: Avalanche,
	[ChainId.FUJI]: Avalanche,
	[ChainId.HECO]: Heco,
	[ChainId.HECO_TESTNET]: Heco,
	[ChainId.HARMONY]: Harmony,
	[ChainId.HARMONY_TESTNET]: Harmony,
	[ChainId.OKEX]: OKEx,
	[ChainId.OKEX_TESTNET]: OKEx,
}

export const NETWORK_LABEL = {
	[ChainId.MAINNET]: 'Ethereum',
	[ChainId.RINKEBY]: 'Rinkeby',
	[ChainId.ROPSTEN]: 'Ropsten',
	[ChainId.GÖRLI]: 'Görli',
	[ChainId.KOVAN]: 'Kovan',
	[ChainId.FANTOM]: 'Fantom',
	[ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
	[ChainId.MATIC]: 'Polygon (Matic)',
	[ChainId.MATIC_TESTNET]: 'Matic Testnet',
	[ChainId.XDAI]: 'xDai',
	[ChainId.BSC]: 'BSC',
	[ChainId.BSC_TESTNET]: 'BSC Testnet',
	[ChainId.MOONBASE]: 'Moonbase',
	[ChainId.AVALANCHE]: 'Avalanche',
	[ChainId.FUJI]: 'Fuji',
	[ChainId.HECO]: 'HECO',
	[ChainId.HECO_TESTNET]: 'HECO Testnet',
	[ChainId.HARMONY]: 'Harmony',
	[ChainId.HARMONY_TESTNET]: 'Harmony Testnet',
	[ChainId.OKEX]: 'OKExChain',
	[ChainId.OKEX_TESTNET]: 'OKExChain',
}

export const EXPLORERS = {
	defaultNetwork: 5,
	1: {
		name: 'Ethereum Mainnet',
		unit: 'ETH',
		isTest: false,
		hasExplorer: true,
		explorer: {
			root: 'https://etherscan.io/',
			address: 'address/',
			tx: 'tx/',
		},
		httpProvider: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
		wssProvider: `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
	},
	2: {
		name: 'Deprecated Morden test network',
		isTest: true,
		hasExplorer: false,
	},
	3: {
		name: 'Ropsten test network',
		unit: 'ETH',
		isTest: true,
		hasExplorer: true,
		explorer: {
			root: 'https://ropsten.etherscan.io/',
			address: 'address/',
			tx: 'tx/',
		},
		httpProvider: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
		wssProvider: `wss://eth-ropsten.ws.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
	},
	4: {
		name: 'Rinkeby test network',
		unit: 'ETH',
		isTest: true,
		hasExplorer: true,
		explorer: {
			root: 'https://rinkeby.etherscan.io/',
			address: 'address/',
			tx: 'tx/',
		},
		httpProvider: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
		wssProvider: `wss://eth-rinkeby.ws.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
	},
	5: {
		name: 'Görli test network',
		unit: 'GoETH',
		isTest: true,
		hasExplorer: true,
		explorer: {
			root: 'https://goerli.etherscan.io/',
			address: 'address/',
			tx: 'tx/',
		},

		httpProvider: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
		wssProvider: `wss://eth-goerli.ws.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
	},
	42: {
		name: ' Kovan test network',
		unit: 'ETH',
		isTest: true,
		hasExplorer: true,
		explorer: {
			root: 'https://kovan.etherscan.io/',
			address: 'address/',
			tx: 'tx/',
		},
		httpProvider: `https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
		wssProvider: `wss://eth-kovan.ws.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
	},
	// 66: {
	// 	name: 'Aldwych network',
	// 	unit: 'ETH',
	// 	isTest: true,
	// 	hasExplorer: true,
	// 	explorer: {
	// 		root: 'https://explorer.aldwych.blaquetec.org/',
	// 		address: 'account/',
	// 		tx: 'tx/',
	// 	},
	// },
	80001: {
		name: 'Matic Testnet',
		unit: 'MATIC',
		isTest: true,
		hasExplorer: true,
		explorer: {
			root: 'https://explorer-mumbai.maticvigil.com/',
			address: 'address/',
			tx: 'tx/',
		},
		httpProvider: 'https://rpc-mumbai.matic.today',
	},
	137: {
		name: 'Matic',
		unit: 'MATIC',
		isTest: false,
		hasExplorer: true,
		explorer: {
			root: 'https://explorer-mainnet.maticvigil.com/',
			address: 'address/',
			tx: 'tx/',
		},
		httpProvider: 'https://rpc-mainnet.maticvigil.com',
	},
	56: {
		name: 'BSC Mainnet',
		unit: 'BNB',
		isTest: false,
		hasExplorer: true,
		explorer: {
			root: 'https://testnet.bscscan.com/',
			address: 'account/',
			tx: 'tx/',
		},
		httpProvider: 'https://bsc-dataseed.binance.org',
	},
	97: {
		name: 'BSC Testnet',
		unit: 'BNB',
		isTest: true,
		hasExplorer: true,
		explorer: {
			root: 'https://testnet.bscscan.com/',
			address: 'account/',
			tx: 'tx/',
		},
		httpProvider: 'https://data-seed-prebsc-1-s1.binance.org:8545',
	},
	250: {
		name: 'Fantom',
		unit: 'FTM',
		isTest: false,
		hasExplorer: false,
		httpProvider: 'https://rpcapi.fantom.network',
	},
	4002: {
		name: 'Fantom Testnet',
		unit: 'FTM',
		isTest: true,
		hasExplorer: false,
		httpProvider: 'https://rpc.testnet.fantom.network',
	},
	100: {
		name: 'xDai',
		unit: 'FTM',
		isTest: false,
		hasExplorer: false,
		httpProvider: 'https://rpc.xdaichain.com',
	},
	1287: {
		name: 'Moonbase',
		unit: 'MOON',
		isTest: false,
		hasExplorer: false,
		httpProvider: 'https://rpc.testnet.moonbeam.network',
	},
	43114: {
		name: 'Avalanche',
		unit: 'AVA',
		isTest: false,
		hasExplorer: false,
		httpProvider: 'https://api.avax.network/ext/bc/C/rpc',
	},
	// 43114: {
	// 	name: 'Fuji',
	// 	unit: 'FUJI',
	// 	isTest: true,
	// 	hasExplorer: false,
	// 	httpProvider: 'https://api.avax-test.network/ext/bc/C/rpc',
	// },
	128: {
		name: 'Heco',
		unit: 'HECO',
		isTest: false,
		hasExplorer: false,
		httpProvider: 'https://http-mainnet.hecochain.com',
	},
	256: {
		name: 'Heco Testnet',
		unit: 'HECO',
		isTest: true,
		hasExplorer: false,
		httpProvider: 'https://http-testnet.hecochain.com',
	},
	1666600000: {
		name: 'Harmony',
		unit: 'HARMONY',
		isTest: false,
		hasExplorer: false,
		httpProvider: 'https://explorer.harmony.one',
	},
	1666700000: {
		name: 'Harmony Testnet',
		unit: 'HARMONY',
		isTest: true,
		hasExplorer: false,
		httpProvider: 'https://explorer.pops.one',
	},
	65: {
		name: 'Okex',
		unit: 'OKEX',
		isTest: false,
		hasExplorer: false,
		httpProvider: 'https://exchaintestrpc.okex.org',
	},
	66: {
		name: 'Okex Testnet',
		unit: 'OKEX',
		isTest: true,
		hasExplorer: false,
		httpProvider: 'https://exchainrpc.okex.org',
	},
	4447: {
		name: 'Truffle Develop Network',
		isTest: true,
		hasExplorer: false,
	},
	5777: {
		name: 'Ganache Blockchain',
		isTest: true,
		hasExplorer: false,
	},
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const NATIVE_CURRENCY_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const CHAIN_IDS = [
	{
		chainId: '0x1',
		chainName: 'Ethereum',
		nativeCurrency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://mainnet.infura.io/v3'],
		blockExplorerUrls: ['https://etherscan.com'],
	},
	{
		chainId: '0x3',
		chainName: 'Ropsten',
		nativeCurrency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://ropsten.infura.io/v3'],
		blockExplorerUrls: ['https://ropsten.etherscan.com'],
	},
	{
		chainId: '0x4',
		chainName: 'Rinkeby',
		nativeCurrency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://rinkeby.infura.io/v3'],
		blockExplorerUrls: ['https://rinkeby.etherscan.com'],
	},
	{
		chainId: '0x5',
		chainName: 'Görli',
		nativeCurrency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://goerli.infura.io/v3'],
		blockExplorerUrls: ['https://goerli.etherscan.com'],
	},
	{
		chainId: '0x2A',
		chainName: 'Kovan',
		nativeCurrency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://kovan.infura.io/v3'],
		blockExplorerUrls: ['https://kovan.etherscan.com'],
	},
	{
		chainId: '0x61',
		chainName: 'Binance SC Testnet',
		nativeCurrency: {
			name: 'Binance Coin',
			symbol: 'BNB',
			decimals: 18,
		},
		rpcUrls: ['https://bsc-dataseed.binance.org'],
		blockExplorerUrls: ['https://bscscan.com'],
	},
	{
		chainId: '0x13881',
		chainName: 'Matic Testnet',
		nativeCurrency: {
			name: 'Matic',
			symbol: 'MATIC',
			decimals: 18,
		},
		rpcUrls: ['https://rpc-mumbai.matic.today'],
		blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com'],
	},
	{
		chainId: '0xfa',
		chainName: 'Fantom',
		nativeCurrency: {
			name: 'Fantom',
			symbol: 'FTM',
			decimals: 18,
		},
		rpcUrls: ['https://rpcapi.fantom.network'],
		blockExplorerUrls: ['https://ftmscan.com'],
		disabled: true,
	},
	{
		chainId: '0x38',
		chainName: 'Binance Smart Chain',
		nativeCurrency: {
			name: 'Binance Coin',
			symbol: 'BNB',
			decimals: 18,
		},
		rpcUrls: ['https://bsc-dataseed.binance.org'],
		blockExplorerUrls: ['https://bscscan.com'],
		disabled: true,
	},
	{
		chainId: '0x89',
		chainName: 'Matic',
		nativeCurrency: {
			name: 'Matic',
			symbol: 'MATIC',
			decimals: 18,
		},
		rpcUrls: ['https://rpc-mainnet.maticvigil.com'], // ['https://matic-mainnet.chainstacklabs.com/'],
		blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com'],
		disabled: true,
	},
	{
		chainId: '0x80',
		chainName: 'Heco',
		nativeCurrency: {
			name: 'Heco Token',
			symbol: 'HT',
			decimals: 18,
		},
		rpcUrls: ['https://http-mainnet.hecochain.com'],
		blockExplorerUrls: ['https://hecoinfo.com'],
		disabled: true,
	},
	{
		chainId: '0x64',
		chainName: 'xDai',
		nativeCurrency: {
			name: 'xDai Token',
			symbol: 'xDai',
			decimals: 18,
		},
		rpcUrls: ['https://rpc.xdaichain.com'],
		blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
		disabled: true,
	},
	{
		chainId: '0x63564C40',
		chainName: 'Harmony One',
		nativeCurrency: {
			name: 'One Token',
			symbol: 'ONE',
			decimals: 18,
		},
		rpcUrls: ['https://api.s0.t.hmny.io'],
		blockExplorerUrls: ['https://explorer.harmony.one/'],
		disabled: true,
	},
	{
		chainId: '0xA86A',
		chainName: 'Avalanche',
		nativeCurrency: {
			name: 'Avalanche Token',
			symbol: 'AVAX',
			decimals: 18,
		},
		rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
		blockExplorerUrls: ['https://explorer.avax.network'],
		disabled: true,
	},
	{
		chainId: '0x42',
		chainName: 'OKEx',
		nativeCurrency: {
			name: 'OKEx Token',
			symbol: 'OKT',
			decimals: 18,
		},
		rpcUrls: ['https://exchainrpc.okex.org'],
		blockExplorerUrls: ['https://www.oklink.com/okexchain'],
		disabled: true,
	},
]
