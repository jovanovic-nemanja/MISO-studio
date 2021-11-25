import Vue from 'vue'

Vue.filter('truncate', (text, limit = 4) => {
	if (text && typeof text === 'string') {
		const trancate = text.length > limit ? '...' : ''
		return text.substring(0, limit) + trancate + text.substring(text.length - 10)
	}
	return ''
})
