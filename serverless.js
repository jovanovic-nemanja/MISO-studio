'use strict'

const awsServerlessExpress = require('aws-serverless-express')
const { app } = require('./app')

const BINARY_MIME_TYPES = [
	'application/javascript',
	'application/json',
	'application/manifest+json',
	'application/octet-stream',
	'application/xml',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/gif',
	'image/jpeg',
	'image/png',
	'image/svg+xml',
	'image/x-icon',
	'text/comma-separated-values',
	'text/css',
	'text/html',
	'text/javascript',
	'text/plain',
	'text/text',
	'text/xml',
]

// // V2
// const server = awsServerlessExpress.createServer(app, void 0, BINARY_MIME_TYPES);

// V1
const server = awsServerlessExpress.createServer(app, null, BINARY_MIME_TYPES)
// V0
// const server = awsServerlessExpress.createServer(app)

// // V2
// module.exports.render = (event, context) => {
//     awsServerlessExpress.proxy(server, event, context);
// };

// V1
exports.handler = (event, context) =>
	awsServerlessExpress.proxy(server, event, context)

// V0
// module.exports.render = (event, context, callback) => {
//   console.log('[info]', 'Event', JSON.stringify(event));
//   awsServerlessExpress.proxy(server, event, context);
// };
