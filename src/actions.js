function getActions(self) {
	return {
		// ===== TIMER CONTROL =====

		timer_start: {
			name: 'Start Timer',
			options: [],
			callback: async () => {
				await self.restPost('/timer/start')
			},
		},

		timer_stop: {
			name: 'Stop Timer',
			options: [],
			callback: async () => {
				await self.restPost('/timer/stop')
			},
		},

		timer_pause: {
			name: 'Pause Timer',
			options: [],
			callback: async () => {
				await self.restPost('/timer/pause')
			},
		},

		timer_resume: {
			name: 'Resume Timer',
			options: [],
			callback: async () => {
				await self.restPost('/timer/resume')
			},
		},

		timer_reset: {
			name: 'Reset Timer',
			options: [],
			callback: async () => {
				await self.restPost('/timer/reset')
			},
		},

		timer_toggle_start_stop: {
			name: 'Toggle Start/Stop',
			options: [],
			callback: async () => {
				if (self.timerState.isRunning) {
					await self.restPost('/timer/stop')
				} else {
					await self.restPost('/timer/start')
				}
			},
		},

		timer_toggle: {
			name: 'Toggle Timer (Start/Pause)',
			options: [],
			callback: async () => {
				if (self.timerState.isRunning && !self.timerState.isPaused) {
					await self.restPost('/timer/pause')
				} else if (self.timerState.isPaused) {
					await self.restPost('/timer/resume')
				} else {
					await self.restPost('/timer/start')
				}
			},
		},

		// ===== TIME MANAGEMENT =====

		set_time: {
			name: 'Set Time',
			options: [
				{
					type: 'number',
					id: 'hours',
					label: 'Hours',
					default: 0,
					min: 0,
					max: 99,
				},
				{
					type: 'number',
					id: 'minutes',
					label: 'Minutes',
					default: 5,
					min: 0,
					max: 59,
				},
				{
					type: 'number',
					id: 'seconds',
					label: 'Seconds',
					default: 0,
					min: 0,
					max: 59,
				},
			],
			callback: async (action) => {
				await self.restPost('/timer/set-time', {
					hours: action.options.hours,
					minutes: action.options.minutes,
					seconds: action.options.seconds,
				})
			},
		},

		adjust_time: {
			name: 'Adjust Time',
			options: [
				{
					type: 'number',
					id: 'seconds',
					label: 'Seconds (negative to subtract)',
					default: 60,
					min: -36000,
					max: 36000,
				},
			],
			callback: async (action) => {
				await self.restPost('/timer/adjust', {
					seconds: action.options.seconds,
				})
			},
		},

		add_minute: {
			name: 'Add 1 Minute',
			options: [],
			callback: async () => {
				await self.restPost('/timer/add-minute')
			},
		},

		subtract_minute: {
			name: 'Subtract 1 Minute',
			options: [],
			callback: async () => {
				await self.restPost('/timer/subtract-minute')
			},
		},

		// ===== PRESETS =====

		load_preset: {
			name: 'Load Preset',
			options: [
				{
					type: 'number',
					id: 'presetId',
					label: 'Preset Index (0-7)',
					default: 0,
					min: 0,
					max: 7,
					step: 1,
				},
			],
			callback: async (action) => {
				await self.restPost(`/presets/${action.options.presetId}/load`)
			},
		},

		// ===== LAYOUTS =====

		change_layout: {
			name: 'Change Layout',
			options: [
				{
					type: 'dropdown',
					id: 'layoutId',
					label: 'Layout',
					default: 'classic',
					allowCustom: true,
					choices: self.layoutChoices || [
						{ id: 'classic', label: 'Classic' },
						{ id: 'minimal', label: 'Minimal' },
						{ id: 'clockfocus', label: 'Clock Focus' },
						{ id: 'detailed', label: 'Detailed' },
						{ id: 'circular', label: 'Circular' },
						{ id: 'video', label: 'Video Input' },
					],
				},
			],
			callback: async (action) => {
				await self.restPost('/layout', {
					layoutId: action.options.layoutId,
				})
			},
		},

		// ===== MESSAGES =====

		send_message: {
			name: 'Send Message',
			options: [
				{
					type: 'textinput',
					id: 'text',
					label: 'Message Text',
					default: '',
				},
				{
					type: 'number',
					id: 'duration',
					label: 'Duration (ms, 0 = persistent)',
					default: 5000,
					min: 0,
					max: 60000,
				},
			],
			callback: async (action) => {
				const body = { text: action.options.text }
				if (action.options.duration > 0) {
					body.duration = action.options.duration
				}
				await self.restPost('/message', body)
			},
		},

		set_message_text: {
			name: 'Set Message Text (No Display)',
			options: [
				{
					type: 'textinput',
					id: 'text',
					label: 'Message Text',
					default: '',
				},
			],
			callback: async (action) => {
				await self.restPost('/message/set-text', {
					text: action.options.text,
				})
			},
		},

		show_message: {
			name: 'Show Message (Persistent)',
			options: [
				{
					type: 'textinput',
					id: 'text',
					label: 'Message Text',
					default: '',
				},
			],
			callback: async (action) => {
				await self.restPost('/message/show', {
					text: action.options.text,
				})
			},
		},

		toggle_message: {
			name: 'Toggle Message',
			options: [],
			callback: async () => {
				await self.restPost('/message/toggle')
			},
		},

		// ===== SOUND =====

		sound_mute: {
			name: 'Mute Sound',
			options: [],
			callback: async () => {
				await self.restPost('/sound/mute')
			},
		},

		sound_unmute: {
			name: 'Unmute Sound',
			options: [],
			callback: async () => {
				await self.restPost('/sound/unmute')
			},
		},

		sound_toggle: {
			name: 'Toggle Sound',
			options: [],
			callback: async () => {
				await self.restPost('/sound/toggle')
			},
		},

		// ===== DISPLAY EFFECTS =====

		trigger_flash: {
			name: 'Trigger Flash',
			options: [
				{
					type: 'number',
					id: 'cycles',
					label: 'Flash Cycles',
					default: 3,
					min: 1,
					max: 20,
				},
				{
					type: 'number',
					id: 'duration',
					label: 'Cycle Duration (ms)',
					default: 500,
					min: 100,
					max: 5000,
				},
			],
			callback: async (action) => {
				await self.restPost('/timer/flash', {
					cycles: action.options.cycles,
					duration: action.options.duration,
				})
			},
		},

		toggle_feature_image: {
			name: 'Toggle Feature Image',
			options: [],
			callback: async () => {
				await self.restPost('/display/toggle-feature-image')
			},
		},
	}
}

module.exports = { getActions }
