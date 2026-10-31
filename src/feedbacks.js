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

function parseHexToRgb(hex) {
	if (typeof hex !== 'string' || hex.length < 4) return null
	const clean = hex.replace('#', '')
	const r = parseInt(clean.substring(0, 2), 16)
	const g = parseInt(clean.substring(2, 4), 16)
	const b = parseInt(clean.substring(4, 6), 16)
	if (isNaN(r) || isNaN(g) || isNaN(b)) return null
	return { r, g, b }
}

function numberToRgb(color) {
	return {
		r: (color >> 16) & 0xff,
		g: (color >> 8) & 0xff,
		b: color & 0xff,
	}
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

		progress_bar: {
			type: 'advanced',
			name: 'Progress Bar',
			description: 'Draws a progress bar overlay showing remaining time percentage',
			options: [
				{
					type: 'number',
					id: 'barHeight',
					label: 'Bar Height (px)',
					default: 8,
					min: 2,
					max: 32,
				},
				{
					type: 'dropdown',
					id: 'barColor',
					label: 'Bar Color',
					default: 'warning_color',
					choices: [
						{ id: 'warning_color', label: 'Follow Warning Color' },
						{ id: 'green', label: 'Green' },
						{ id: 'custom', label: 'Custom' },
					],
				},
				{
					type: 'colorpicker',
					id: 'customColor',
					label: 'Custom Bar Color',
					default: combineRgb(0, 180, 0),
					isVisible: (opts) => opts.barColor === 'custom',
				},
				{
					type: 'colorpicker',
					id: 'bgColor',
					label: 'Bar Background Color',
					default: combineRgb(51, 51, 51),
				},
			],
			callback: (feedback) => {
				const width = feedback.image?.width || 72
				const height = feedback.image?.height || 72
				const barHeight = feedback.options.barHeight || 8
				let percentage = Math.max(0, Math.min(100, self.timerState.percentage))
				if (self.timerState.isOvertime) percentage = 0
				const fillWidth = Math.round((percentage / 100) * width)

				// Determine bar fill color
				let fillRgb
				switch (feedback.options.barColor) {
					case 'green':
						fillRgb = { r: 0, g: 180, b: 0 }
						break
					case 'custom':
						fillRgb = numberToRgb(feedback.options.customColor || combineRgb(0, 180, 0))
						break
					case 'warning_color':
					default:
						fillRgb = parseHexToRgb(self.timerState.warningColor) || { r: 0, g: 180, b: 0 }
						break
				}

				const bgRgb = numberToRgb(feedback.options.bgColor || combineRgb(51, 51, 51))

				// Build RGB pixel buffer for the bar strip only
				const buf = Buffer.alloc(width * barHeight * 3)
				for (let y = 0; y < barHeight; y++) {
					for (let x = 0; x < width; x++) {
						const offset = (y * width + x) * 3
						if (x < fillWidth) {
							buf[offset] = fillRgb.r
							buf[offset + 1] = fillRgb.g
							buf[offset + 2] = fillRgb.b
						} else {
							buf[offset] = bgRgb.r
							buf[offset + 1] = bgRgb.g
							buf[offset + 2] = bgRgb.b
						}
					}
				}

				return {
					imageBuffer: buf,
					imageBufferEncoding: { pixelFormat: 'RGB' },
					imageBufferPosition: { x: 0, y: 0, width: width, height: barHeight },
				}
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
