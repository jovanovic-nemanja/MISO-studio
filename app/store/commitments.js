/* 
	struct of commitments
		commitment: {
			txHash: "",  commitment transaction hash
			timestamp: "", commitment timestamp
			address: "", who committed
			amount: "", amount committed
		}
**/

const getDefaultState = () => ({
	commitments: [],
	totalParticipants: 0,
	commitmentsTotal: 0,
})

export const state = () => getDefaultState()

export const mutations = {
	SET_COMMITMENTS: (state, commitments) => {
		state.commitments = commitments

		// Filter unique addresses from commitments
		const uniqueAddresses = commitments
			.map((commit) => commit.address)
			.filter(onlyUnique)

		const commitmentsTotal = commitments.reduce(
			(prev, cur) => prev + parseFloat(cur.amount),
			0
		)
		state.commitmentsTotal = commitmentsTotal
		state.totalParticipants = uniqueAddresses.length
	},
	ADD_COMMITMENT: (state, commitment) => {
		const commitments = state.commitments
		const commitmentExists = commitments.some(
			(commit) => commit.txHash === commitment.txHash
		)
		if (commitmentExists) return false
		const addressExists = commitments.some(
			(commit) => commit.address === commitment.address
		)
		if (!addressExists) {
			const totalParticipants = state.totalParticipants
			state.totalParticipants = totalParticipants + 1
		}
		state.commitmentsTotal += parseFloat(commitment.amount)

		commitments.push(commitment)
	},
	MERGE_COMMITMENTS: (state, newCommitments) => {
		const commitments = state.commitments.concat(newCommitments)
		state.commitments = commitments
	},
	RESET_STATE: (state) => {
		Object.assign(state, getDefaultState())
	},
}

export const actions = {
	setContractAddress({ commit }, contractAddress) {
		commit('SET_CONTRACT_ADDRESS', contractAddress)
	},
	setCommitments({ commit, state }, commitments) {
		if (commitments.length > 0) {
			if (state.commitments.length === 0) {
				commit('SET_COMMITMENTS', commitments)
			} else {
				commit('MERGE_COMMITMENTS', commitments)
			}
		}
	},
	addCommitment({ commit }, commitment) {
		commit('ADD_COMMITMENT', commitment)
	},
	resetCommitmentsState({ commit, state }) {
		commit('RESET_STATE')
	},
}

export const getters = {
	list: (state) => {
		return state.commitments
	},
	totalParticipants: (state) => {
		return state.totalParticipants
	},
	commitmentsTotal: (state) => {
		return state.commitmentsTotal
	},
}

const onlyUnique = (value, index, self) => {
	return self.indexOf(value) === index
}
