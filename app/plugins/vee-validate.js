import { extend, configure } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import { messages } from './locale/vee-validate/en.json'

Object.keys(rules).forEach((rule) => {
	extend(rule, {
		// eslint-disable-next-line import/namespace
		...rules[rule], // copies rule configuration
		message: messages[rule], // assign message
	})
})

extend('isAddress', {
	message: 'Address is invalid.',
	validate: (value) => {
		return (
			web3.utils.isAddress(value) &&
			value !== '0x0000000000000000000000000000000000000000'
		)
	},
})

extend('isBigger', {
	message: (field, args) => `The ${field} must be more than ${args.compare}`,
	validate: (value, args) => parseFloat(value) > parseFloat(args.compare),
	params: ['compare'],
})

extend('isLess', {
	message: (field, args) => `The ${field} must be less than ${args.compare}`,
	validate: (value, args) => parseFloat(value) < parseFloat(args.compare),
	params: ['compare'],
})

extend('isBefore', {
	message: (field, args) => `The ${field} must be before ${args.comparableField}`,
	validate: (value, args) => value < new Date(args.compare).getTime(),
	params: ['compare', 'comparableField'],
})

extend('isAfter', {
	message: (field, args) => `The ${field} must be after ${args.comparableField}`,
	validate: (value, args) => value > new Date(args.compare).getTime(),
	params: ['compare', 'comparableField'],
})
extend('afterNow', {
	message: (field) => `The ${field} must be a future date`,
	validate: (value) => value > new Date().getTime(),
	params: ['compare', 'comparableField'],
})

extend('boolean', {
	message: (field) => field + ' value must be boolean.',
	validate: (value) => {
		return !!(value === 'true' || value === 'false')
	},
})
extend('website', {
	message: (field) => field + ' value must be valid URL.',
	validate: (value) => {
		const pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		) // fragment locator
		return !!pattern.test(value)
	},
})
extend('text', {
	message: (field) => field + ' can only contain letters & numbers',
	validate: (value) => {
		const letters = /^[0-9a-zA-Z.,!?-\s]+$/
		return value.match(letters)
	},
})
extend('isNumber', {
	message: (field) => field + ' can only contain numbers',
	validate: (value) => {
		const letters = /^[0-9]+$/
		return value.match(letters)
	},
})

extend('decimal', {
	message: 'The {_field_} field must contain only decimal values',
	validate: (value, { decimals = '*', separator = '.' } = {}) => {
		if (value === null || value === undefined || value === '') {
			return {
				valid: false,
			}
		}
		if (Number(decimals) === 0) {
			return {
				valid: /^-?\d*$/.test(value),
			}
		}
		const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`
		const regex = new RegExp(
			`^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`
		)

		return {
			valid: regex.test(value),
		}
	},
})

configure({
	classes: {
		valid: 'is-valid',
		invalid: 'is-invalid',
		dirty: ['is-dirty', 'is-dirty'], // multiple classes per flag!
	},
})
