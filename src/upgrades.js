module.exports = [
	// v1.0.1: Rename warning level 'danger' to 'critical' to match server values
	function (_context, props) {
		const updatedFeedbacks = []

		for (const feedback of props.feedbacks) {
			if (feedback.feedbackId === 'warning_level' && feedback.options && feedback.options.level === 'danger') {
				feedback.options.level = 'critical'
				updatedFeedbacks.push(feedback)
			}
		}

		return {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks,
		}
	},

	// v1.1.0: Convert load_preset presetId from text to number
	function (_context, props) {
		const updatedActions = []

		for (const action of props.actions) {
			if (action.actionId === 'load_preset' && action.options && typeof action.options.presetId === 'string') {
				action.options.presetId = parseInt(action.options.presetId, 10) || 0
				updatedActions.push(action)
			}
		}

		return {
			updatedConfig: null,
			updatedActions,
			updatedFeedbacks: [],
		}
	},
]
