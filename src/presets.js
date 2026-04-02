const { combineRgb } = require('@companion-module/base')

// Colors matching Rocket Timer UI design tokens
const COLORS = {
	success: combineRgb(0x4c, 0xaf, 0x50),       // #4caf50
	successLight: combineRgb(0x66, 0xbb, 0x6a),   // #66bb6a
	warning: combineRgb(0xff, 0x95, 0x00),         // #ff9500
	warningLight: combineRgb(0xff, 0xb3, 0x40),    // #ffb340
	danger: combineRgb(0xff, 0x47, 0x57),          // #ff4757
	dangerLight: combineRgb(0xff, 0x6b, 0x7a),     // #ff6b7a
	overtime: combineRgb(0x99, 0x1b, 0x1b),        // #991b1b
	primary: combineRgb(0x3b, 0x82, 0xf6),         // #3b82f6
	primaryHover: combineRgb(0x25, 0x63, 0xeb),    // #2563eb
	dark: combineRgb(0, 0, 0),                       // dark bg
	darkSurface: combineRgb(0, 0, 0),               // surface
	white: combineRgb(255, 255, 255),
	black: combineRgb(0, 0, 0),
	grey: combineRgb(0x6b, 0x6b, 0x6b),
	greyLight: combineRgb(0x9c, 0x9c, 0x9c),
}

function getPresets(_self) {
	const presets = {}

	// ===== TIMER CONTROL =====

	presets['start_stop'] = {
		type: 'button',
		category: 'Timer Control',
		name: 'Start / Stop',
		style: {
			text: 'START',
			size: '18',
			color: COLORS.white,
			bgcolor: COLORS.success,
		},
		steps: [
			{
				down: [{ actionId: 'timer_toggle_start_stop', options: {} }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'timer_running',
				style: {
					text: 'STOP',
					bgcolor: COLORS.danger,
					color: COLORS.white,
				},
			},
		],
	}

	presets['reset'] = {
		type: 'button',
		category: 'Timer Control',
		name: 'Reset',
		style: {
			text: 'RESET',
			size: '18',
			color: COLORS.white,
			bgcolor: COLORS.darkSurface,
		},
		steps: [
			{
				down: [{ actionId: 'timer_reset', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['add_1_min'] = {
		type: 'button',
		category: 'Timer Control',
		name: '+1 Min',
		style: {
			text: '+1\\nMIN',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.primary,
		},
		steps: [
			{
				down: [{ actionId: 'adjust_time', options: { seconds: 60 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['sub_1_min'] = {
		type: 'button',
		category: 'Timer Control',
		name: '-1 Min',
		style: {
			text: '-1\\nMIN',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.primaryHover,
		},
		steps: [
			{
				down: [{ actionId: 'adjust_time', options: { seconds: -60 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['add_5_min'] = {
		type: 'button',
		category: 'Timer Control',
		name: '+5 Min',
		style: {
			text: '+5\\nMIN',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.primary,
		},
		steps: [
			{
				down: [{ actionId: 'adjust_time', options: { seconds: 300 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['sub_5_min'] = {
		type: 'button',
		category: 'Timer Control',
		name: '-5 Min',
		style: {
			text: '-5\\nMIN',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.primaryHover,
		},
		steps: [
			{
				down: [{ actionId: 'adjust_time', options: { seconds: -300 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['add_10_min'] = {
		type: 'button',
		category: 'Timer Control',
		name: '+10 Min',
		style: {
			text: '+10\\nMIN',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.primary,
		},
		steps: [
			{
				down: [{ actionId: 'adjust_time', options: { seconds: 600 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['sub_10_min'] = {
		type: 'button',
		category: 'Timer Control',
		name: '-10 Min',
		style: {
			text: '-10\\nMIN',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.primaryHover,
		},
		steps: [
			{
				down: [{ actionId: 'adjust_time', options: { seconds: -600 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// ===== TIMER DISPLAY =====

	presets['time_remaining'] = {
		type: 'button',
		category: 'Timer Display',
		name: 'Time Remaining',
		style: {
			text: 'REMAINING\\n$(rocket-timer:formatted_time)',
			size: '12',
			color: COLORS.white,
			bgcolor: COLORS.dark,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'warning_color_text',
				options: {},
			},
		],
	}

	presets['time_elapsed'] = {
		type: 'button',
		category: 'Timer Display',
		name: 'Time Elapsed',
		style: {
			text: 'ELAPSED\\n$(rocket-timer:formatted_elapsed)',
			size: '12',
			color: COLORS.greyLight,
			bgcolor: COLORS.dark,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['percentage'] = {
		type: 'button',
		category: 'Timer Display',
		name: 'Percentage',
		style: {
			text: 'PROGRESS\\n$(rocket-timer:percentage)%',
			size: '12',
			color: COLORS.white,
			bgcolor: COLORS.dark,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'warning_color_bg',
				options: {},
			},
		],
	}

	presets['end_time'] = {
		type: 'button',
		category: 'Timer Display',
		name: 'End Time',
		style: {
			text: 'END TIME\\n$(rocket-timer:end_time)',
			size: '14',
			color: COLORS.greyLight,
			bgcolor: COLORS.dark,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [],
	}

	// ===== PRESETS =====

	for (let i = 0; i < 8; i++) {
		presets[`preset_${i}`] = {
			type: 'button',
			category: 'Presets',
			name: `Preset ${i + 1}`,
			style: {
				text: `PRESET\\n${i + 1}`,
				size: '14',
				color: COLORS.white,
				bgcolor: COLORS.darkSurface,
			},
			steps: [
				{
					down: [{ actionId: 'load_preset', options: { presetId: String(i) } }],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	presets['custom_timer'] = {
		type: 'button',
		category: 'Presets',
		name: 'Custom Timer',
		style: {
			text: 'SET\\nCUSTOM',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.primary,
		},
		steps: [
			{
				down: [{ actionId: 'set_time', options: { hours: 0, minutes: 5, seconds: 0 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// ===== MESSAGES =====

	presets['set_message'] = {
		type: 'button',
		category: 'Messages',
		name: 'Set Message',
		style: {
			text: 'SET\\nMESSAGE',
			size: '12',
			color: COLORS.white,
			bgcolor: COLORS.primary,
		},
		steps: [
			{
				down: [{ actionId: 'set_message_text', options: { text: 'Stand by...' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['toggle_message'] = {
		type: 'button',
		category: 'Messages',
		name: 'Toggle Message',
		style: {
			text: 'SHOW\\nMESSAGE',
			size: '12',
			color: COLORS.white,
			bgcolor: COLORS.darkSurface,
		},
		steps: [
			{
				down: [{ actionId: 'toggle_message', options: {} }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'message_visible',
				style: {
					text: 'HIDE\\nMESSAGE',
					bgcolor: COLORS.danger,
					color: COLORS.white,
				},
			},
		],
	}

	// ===== SOUND =====

	// ===== LAYOUTS =====

	presets['layout_classic'] = {
		type: 'button',
		category: 'Layouts',
		name: 'Classic Layout',
		style: {
			text: 'CLASSIC',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.darkSurface,
		},
		steps: [
			{
				down: [{ actionId: 'change_layout', options: { layoutId: 'classic' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['layout_minimal'] = {
		type: 'button',
		category: 'Layouts',
		name: 'Minimal Layout',
		style: {
			text: 'MINIMAL',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.darkSurface,
		},
		steps: [
			{
				down: [{ actionId: 'change_layout', options: { layoutId: 'minimal' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['layout_clockfocus'] = {
		type: 'button',
		category: 'Layouts',
		name: 'Clock Focus Layout',
		style: {
			text: 'CLOCK\nFOCUS',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.darkSurface,
		},
		steps: [
			{
				down: [{ actionId: 'change_layout', options: { layoutId: 'clockfocus' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['layout_detailed'] = {
		type: 'button',
		category: 'Layouts',
		name: 'Detailed Layout',
		style: {
			text: 'DETAILED',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.darkSurface,
		},
		steps: [
			{
				down: [{ actionId: 'change_layout', options: { layoutId: 'detailed' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['layout_circular'] = {
		type: 'button',
		category: 'Layouts',
		name: 'Circular Layout',
		style: {
			text: 'CIRCULAR',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.darkSurface,
		},
		steps: [
			{
				down: [{ actionId: 'change_layout', options: { layoutId: 'circular' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['layout_video'] = {
		type: 'button',
		category: 'Layouts',
		name: 'Video Input Layout',
		style: {
			text: 'VIDEO\nINPUT',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.darkSurface,
		},
		steps: [
			{
				down: [{ actionId: 'change_layout', options: { layoutId: 'video' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// ===== SOUND =====

	presets['sound'] = {
		type: 'button',
		category: 'Sound',
		name: 'Sound On/Off',
		style: {
			text: 'SOUND\nON',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.black,
		},
		steps: [
			{
				down: [{ actionId: 'sound_toggle', options: {} }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'sound_muted',
				style: {
					text: 'SOUND\nOFF',
					bgcolor: COLORS.danger,
					color: COLORS.white,
				},
			},
		],
	}

	// ===== DISPLAY EFFECTS =====

	presets['flash'] = {
		type: 'button',
		category: 'Display Effects',
		name: 'Flash',
		style: {
			text: 'FLASH',
			size: '18',
			color: COLORS.white,
			bgcolor: COLORS.black,
		},
		steps: [
			{
				down: [{ actionId: 'trigger_flash', options: { cycles: 3, duration: 500 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['toggle_feature_image'] = {
		type: 'button',
		category: 'Display Effects',
		name: 'Feature Image',
		style: {
			text: 'FEATURE\\nIMAGE',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.darkSurface,
		},
		steps: [
			{
				down: [{ actionId: 'toggle_feature_image', options: {} }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'feature_image_enabled',
				style: {
					bgcolor: COLORS.success,
					color: COLORS.white,
				},
			},
		],
	}

	// ===== STATUS =====

	presets['timer_state'] = {
		type: 'button',
		category: 'Status',
		name: 'Timer State',
		style: {
			text: 'STATE\\n$(rocket-timer:state)',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.dark,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'timer_running',
				style: {
					bgcolor: COLORS.success,
				},
			},
			{
				feedbackId: 'timer_paused',
				style: {
					bgcolor: COLORS.warning,
					color: COLORS.black,
				},
			},
			{
				feedbackId: 'timer_overtime',
				style: {
					bgcolor: COLORS.overtime,
				},
			},
		],
	}

	presets['connection_status'] = {
		type: 'button',
		category: 'Status',
		name: 'Connection',
		style: {
			text: 'CONN\\n$(rocket-timer:connection)',
			size: '14',
			color: COLORS.white,
			bgcolor: COLORS.overtime,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'connection_state',
				style: {
					bgcolor: COLORS.success,
				},
			},
		],
	}

	return presets
}

module.exports = { getPresets }
