const { Builder } = require('nuxt')
const consola = require('consola')
const { app, nuxt } = require('./app')

const IS_PROD = process.env.NODE_ENV === 'development'

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 54000

require('dotenv').config({
	path: `./.env.${IS_PROD ? 'production' : 'development'}`,
})
;(async function main() {
	if (!IS_PROD) {
		await new Builder(nuxt).build()
	}

	app.listen(port, host)
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true,
	})
})()
