import moment from 'moment'

export const duration = {
	data() {
		return {
			numberOfDays: 7,
			numberOfHours: 0,
		}
	},
	computed: {
		getDuration() {
			const hours = this.numberOfDays * 24 + this.numberOfHours
			const duration = moment(this.model.startDate)
				.add(hours, 'hours')
				.format('YYYY-MM-DD HH:mm:ss')
			if (this.model.startDate === '') return ''
			else return duration
		},
	},
	watch: {
		getDuration(val) {
			this.model.endDate = new Date(val)
		},
	},
}
