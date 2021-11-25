const express = require('express')
// const asyncify = require('express-asyncify')
const { Nuxt } = require('nuxt')
const compression = require('compression')
const { setHeadersMiddleware } = require('./middlewares/header-middleware')
const { loggerMiddleware } = require('./middlewares/logger-middleware')
const { envMiddleware } = require('./middlewares/env-middleware')

const nuxtConfig = require('./nuxt.config')
// const api = require('./app/api')

const IS_PROD = process.env.NODE_ENV === 'production'

const nuxt = new Nuxt({
	...nuxtConfig,
	dev: !IS_PROD,
})

let isNuxtReady = false

// const app = asyncify(express())
const app = express()
app.use(compression())
/** middleware */
app.use(setHeadersMiddleware)

// if (process.env.ENDPOINT_ENV === 'api_gw') {
//   app.use(envMiddleware);
// }

if (process.env.NODE_ENV !== 'development') {
	app.use(loggerMiddleware)
}

// S3 static bucket
app.use('/s3', express.static('./s3'))

// app.use(api)
app.use(
	async (req, res) =>
		(isNuxtReady || ((await nuxt.ready()) && (isNuxtReady = true))) &&
		nuxt.render(req, res)
)

module.exports = {
	app,
	nuxt,
}
