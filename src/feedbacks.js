const { combineRgb } = require('@companion-module/base')

function parseHexColor(hex) {
	if (typeof hex !== 'string' || hex.length < 4) return null
	const clean = hex.replace('#', '')
	const r = parseInt(clean.substring(0, 2), 16)
	const g = parseInt(clean.substring(2, 4), 16)
	const b = parseInt(clean.substring(4, 6), 16)
	if (isNaN(r) || isNaN(g) || isNaN(b)) return null
	return combineRgb(r, g, b)
}

function getFeedbacks(self) {
	return {
		timer_running: {
			type: 'boolean',
			name: 'Timer Running',
			description: 'True when the timer is actively counting down',
			defaultStyle: {
				bgcolor: combineRgb(0, 180, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.timerState.isRunning && !self.timerState.isPaused
			},
		},

		timer_paused: {
			type: 'boolean',
			name: 'Timer Paused',
			description: 'True when the timer is paused',
			defaultStyle: {
				bgcolor: combineRgb(255, 165, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: () => {
				return self.timerState.isPaused
			},
		},

		timer_stopped: {
			type: 'boolean',
			name: 'Timer Stopped',
			description: 'True when the timer is stopped (not running and not paused)',
			defaultStyle: {
				bgcolor: combineRgb(128, 128, 128),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return !self.timerState.isRunning && !self.timerState.isPaused
			},
		},

		timer_overtime: {
			type: 'boolean',
			name: 'Timer Overtime',
			description: 'True when the timer has gone past zero',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.timerState.isOvertime
			},
		},

		warning_level: {
			type: 'boolean',
			name: 'Warning Level',
			description: 'True when the timer is at a specific warning level',
			defaultStyle: {
				bgcolor: combineRgb(255, 200, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					id: 'level',
					label: 'Warning Level',
					default: 'warning',
					choices: [
						{ id: 'normal', label: 'Normal' },
						{ id: 'warning', label: 'Warning' },
						{ id: 'critical', label: 'Critical' },
						{ id: 'overtime', label: 'Overtime' },
					],
				},
			],
			callback: (feedback) => {
				return self.timerState.warningLevel === feedback.options.level
			},
		},

		message_visible: {
			type: 'boolean',
			name: 'Message Visible',
			description: 'True when the message overlay is currently shown',
			defaultStyle: {
				bgcolor: combineRgb(0, 120, 200),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.timerState.messageVisible === true
			},
		},

		feature_image_enabled: {
			type: 'boolean',
			name: 'Feature Image Enabled',
			description: 'True when the feature image is enabled',
			defaultStyle: {
				bgcolor: combineRgb(0, 180, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.timerState.featureImageEnabled === true
			},
		},

		sound_muted: {
			type: 'boolean',
			name: 'Sound Muted',
			description: 'True when sound is muted',
			defaultStyle: {
				bgcolor: combineRgb(255, 71, 87),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.timerState.soundMuted === true
			},
		},

		warning_color_bg: {
			type: 'advanced',
			name: 'Warning Color (Background)',
			description: 'Sets button background to the current timer warning color from the API',
			options: [],
			callback: () => {
				const color = parseHexColor(self.timerState.warningColor)
				if (color === null) return {}
				return { bgcolor: color }
			},
		},

		warning_color_text: {
			type: 'advanced',
			name: 'Warning Color (Text)',
			description: 'Sets button text color to the current timer warning color from the API',
			options: [],
			callback: () => {
				const color = parseHexColor(self.timerState.warningColor)
				if (color === null) return {}
				return { color: color }
			},
		},

		connection_state: {
			type: 'boolean',
			name: 'Connection State',
			description: 'True when connected to Rocket Timer',
			defaultStyle: {
				bgcolor: combineRgb(0, 180, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.connected
			},
		},
	}
}

module.exports = { getFeedbacks }
