module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
	extends: [
		'@nuxtjs',
		'prettier',
		'prettier/vue',
		'plugin:nuxt/recommended',
		'plugin:prettier/recommended',
	],
	rules: {
		'vue/component-name-in-template-casing': ['error', 'kebab-case'],
		'prettier/prettier': ['off', { endOfLine: 'auto' }],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'node/no-callback-literal': 0,
	},
	globals: {
		web3: true,
		web3socket: true,
		ethereum: true,
	},
	plugins: ['prettier'],
}
