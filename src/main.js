const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const WebSocket = require('ws')
const axios = require('axios')
const { getActions } = require('./actions')
const { getFeedbacks } = require('./feedbacks')
const { getPresets } = require('./presets')
const upgradeScripts = require('./upgrades')

class RocketTimerInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Timer state
		this.timerState = {
			isRunning: false,
			isPaused: false,
			isOvertime: false,
			totalTime: 0,
			remainingTime: 0,
			elapsedTime: 0,
			formattedTime: '00:00:00',
			formattedElapsed: '00:00:00',
			percentage: 100,
			remainingPercentage: 100,
			warningLevel: 'normal',
			warningColor: null,
			endTimeFormatted: '',
			name: 'Main Timer',
			messageVisible: false,
			messageText: '',
			featureImageEnabled: false,
			soundMuted: false,
		}

		this.ws = null
		this.wsReconnectTimer = null
		this.pollTimer = null
		this.connected = false
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.connectWebSocket()
	}

	async configUpdated(config) {
		const hostChanged = this.config.host !== config.host
		const restPortChanged = this.config.restPort !== config.restPort
		const wsPortChanged = this.config.wsPort !== config.wsPort

		this.config = config

		if (hostChanged || wsPortChanged) {
			this.disconnectWebSocket()
			this.connectWebSocket()
		}

		if (hostChanged || restPortChanged) {
			this.fetchTimerState()
		}
	}

	async destroy() {
		this.disconnectWebSocket()

		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	// ===== CONFIG =====

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				default: '127.0.0.1',
				regex: this.REGEX_IP,
			},
			{
				type: 'number',
				id: 'restPort',
				label: 'REST API Port',
				width: 4,
				default: 9999,
				min: 1,
				max: 65535,
			},
			{
				type: 'number',
				id: 'wsPort',
				label: 'WebSocket Port',
				width: 4,
				default: 8080,
				min: 1,
				max: 65535,
			},
		]
	}

	// ===== WEBSOCKET CONNECTION =====

	connectWebSocket() {
		this.disconnectWebSocket()

		const url = `ws://${this.config.host}:${this.config.wsPort}`
		this.log('debug', `Connecting to WebSocket: ${url}`)

		try {
			this.ws = new WebSocket(url)
		} catch (err) {
			this.log('error', `WebSocket creation error: ${err.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.scheduleReconnect()
			return
		}

		this.ws.on('open', () => {
			this.log('info', 'WebSocket connected')
			this.connected = true
			this.updateStatus(InstanceStatus.Ok)
			this.setVariableValues({ connection: 'Connected' })
			this.checkFeedbacks('connection_state')
			this.fetchLayouts()
			this.checkRestHealth()
		})

		this.ws.on('message', (raw) => {
			this.handleWebSocketMessage(raw)
		})

		this.ws.on('close', () => {
			this.log('warn', 'WebSocket disconnected')
			this.connected = false
			this.updateStatus(InstanceStatus.Disconnected)
			this.setVariableValues({ connection: 'Disconnected' })
			this.checkFeedbacks('connection_state')
			this.scheduleReconnect()
		})

		this.ws.on('error', (err) => {
			this.log('error', `WebSocket error: ${err.message}`)
			this.connected = false
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.setVariableValues({ connection: 'Error' })
			this.checkFeedbacks('connection_state')
		})
	}

	disconnectWebSocket() {
		if (this.wsReconnectTimer) {
			clearTimeout(this.wsReconnectTimer)
			this.wsReconnectTimer = null
		}

		if (this.ws) {
			this.ws.removeAllListeners()
			try {
				this.ws.close()
			} catch (_) {
				// ignore
			}
			this.ws = null
		}

		this.connected = false
	}

	scheduleReconnect() {
		if (this.wsReconnectTimer) return

		this.wsReconnectTimer = setTimeout(() => {
			this.wsReconnectTimer = null
			this.connectWebSocket()
		}, 5000)
	}

	handleWebSocketMessage(raw) {
		let msg
		try {
			msg = JSON.parse(raw.toString())
		} catch (err) {
			this.log('warn', `Invalid WebSocket message: ${err.message}`)
			return
		}

		const { type, data } = msg

		switch (type) {
			case 'connection-established':
				if (data) this.updateTimerState(data)
				break

			case 'timer-update':
				if (data) this.updateTimerState(data)
				break

			case 'command-response':
				this.log('debug', `Command response: ${msg.originalCommand} -> ${JSON.stringify(msg.result)}`)
				break

			case 'timer-start-requested':
			case 'timer-stop-requested':
			case 'timer-pause-requested':
			case 'timer-resume-requested':
			case 'timer-reset-requested':
			case 'time-set-requested':
			case 'time-adjust-requested':
			case 'time-component-set':
			case 'time-adjusted':
			case 'preset-load-requested':
			case 'flash-requested':
			case 'feature-image-toggled':
			case 'feature-image-set':
			case 'layout-changed':
			case 'message-sent':
			case 'message-hidden':
			case 'message-toggled':
				this.log('debug', `WS event: ${type}`)
				break

			case 'sound-muted':
				this.timerState.soundMuted = data?.soundMuted ?? true
				this.checkFeedbacks('sound_muted')
				break

			case 'sound-unmuted':
				this.timerState.soundMuted = data?.soundMuted ?? false
				this.checkFeedbacks('sound_muted')
				break

			case 'sound-toggled':
				this.timerState.soundMuted = data?.soundMuted ?? !this.timerState.soundMuted
				this.checkFeedbacks('sound_muted')
				break

			case 'pong':
			case 'error':
				this.log('debug', `WS event: ${type}`)
				break

			default:
				this.log('debug', `Unknown WS event: ${type}`)
				break
		}
	}

	// ===== TIMER STATE =====

	toNumber(value, fallback = 0) {
		const n = Number(value)
		return Number.isFinite(n) ? n : fallback
	}

	updateTimerState(data) {
		this.timerState = {
			isRunning: data.isRunning ?? false,
			isPaused: data.isPaused ?? false,
			isOvertime: data.isOvertime ?? false,
			totalTime: this.toNumber(data.totalTime, 0),
			remainingTime: this.toNumber(data.remainingTime, 0),
			elapsedTime: this.toNumber(data.elapsedTime, 0),
			formattedTime: data.formattedTime ?? '00:00:00',
			formattedElapsed: data.formattedElapsed ?? '00:00:00',
			percentage: this.toNumber(data.remainingPercentage, 100),
			warningLevel: data.warningLevel ?? 'normal',
			warningColor: data.warningColor ?? null,
			endTimeFormatted: data.endTimeFormatted ?? '',
			name: data.name ?? 'Main Timer',
			messageVisible: data.messageVisible ?? false,
			messageText: data.messageText ?? '',
			featureImageEnabled: data.featureImageEnabled ?? false,
			soundMuted: data.soundMuted ?? this.timerState.soundMuted ?? false,
		}

		this.updateVariablesFromState()
		this.checkFeedbacks(
			'timer_running',
			'timer_paused',
			'timer_stopped',
			'timer_overtime',
			'warning_level',
			'warning_color_bg',
			'warning_color_text',
			'message_visible',
			'feature_image_enabled',
			'sound_muted',
			'connection_state',
		)
	}

	getTimerStateLabel() {
		if (this.timerState.isRunning && !this.timerState.isPaused) return 'running'
		if (this.timerState.isPaused) return 'paused'
		return 'stopped'
	}

	updateVariablesFromState() {
		const s = this.timerState
		const pct = Math.max(0, Math.min(100, this.toNumber(s.percentage, 100)))

		this.setVariableValues({
			formatted_time: s.formattedTime,
			formatted_elapsed: s.formattedElapsed,
			total_seconds: Math.round(s.totalTime),
			remaining_seconds: Math.round(s.remainingTime),
			elapsed_seconds: Math.round(s.elapsedTime),
			percentage: (Math.round(pct * 10) / 10).toFixed(1),
			is_running: s.isRunning ? 'true' : 'false',
			is_paused: s.isPaused ? 'true' : 'false',
			is_overtime: s.isOvertime ? 'true' : 'false',
			warning_level: s.warningLevel,
			end_time: s.endTimeFormatted,
			timer_name: s.name,
			state: this.getTimerStateLabel(),
			connection: this.connected ? 'Connected' : 'Disconnected',
		})
	}

	// ===== REST API HELPERS =====

	getRestBaseUrl() {
		return `http://${this.config.host}:${this.config.restPort}/api`
	}

	async restGet(path) {
		try {
			const res = await axios.get(`${this.getRestBaseUrl()}${path}`, { timeout: 5000 })
			return res.data
		} catch (err) {
			this.log('error', `REST GET ${path}: ${err.message}`)
			return null
		}
	}

	async restPost(path, body) {
		try {
			const res = await axios.post(`${this.getRestBaseUrl()}${path}`, body || {}, {
				timeout: 5000,
				headers: { 'Content-Type': 'application/json' },
			})
			return res.data
		} catch (err) {
			this.log('error', `REST POST ${path}: ${err.message}`)
			return null
		}
	}

	async fetchTimerState() {
		const result = await this.restGet('/timer/state')
		if (result && result.success && result.data) {
			this.updateTimerState(result.data)
		}
	}

	async fetchLayouts() {
		const result = await this.restGet('/layouts')
		if (result && result.success && Array.isArray(result.data)) {
			this.layoutChoices = result.data.map((l) => ({
				id: l.id,
				label: l.name + (l.type === 'custom' ? ' (Custom)' : ''),
			}))
			// Refresh action definitions so the dropdown reflects the new choices
			this.initActions()
		}
	}

	async checkRestHealth() {
		const result = await this.restGet('/health')
		if (!result || !result.success) {
			this.log('warn', `REST API health check failed - commands may not work (REST port: ${this.config.restPort})`)
		}
	}

	// ===== INIT HELPERS =====

	initActions() {
		this.setActionDefinitions(getActions(this))
	}

	initFeedbacks() {
		this.setFeedbackDefinitions(getFeedbacks(this))
	}

	initPresets() {
		this.setPresetDefinitions(getPresets(this))
	}

	initVariables() {
		this.setVariableDefinitions([
			{ variableId: 'formatted_time', name: 'Remaining Time (HH:MM:SS)' },
			{ variableId: 'formatted_elapsed', name: 'Elapsed Time (HH:MM:SS)' },
			{ variableId: 'total_seconds', name: 'Total Duration (seconds)' },
			{ variableId: 'remaining_seconds', name: 'Remaining Time (seconds)' },
			{ variableId: 'elapsed_seconds', name: 'Elapsed Time (seconds)' },
			{ variableId: 'percentage', name: 'Remaining Percentage' },
			{ variableId: 'is_running', name: 'Timer Running' },
			{ variableId: 'is_paused', name: 'Timer Paused' },
			{ variableId: 'is_overtime', name: 'Overtime' },
			{ variableId: 'warning_level', name: 'Warning Level' },
			{ variableId: 'end_time', name: 'Projected End Time' },
			{ variableId: 'timer_name', name: 'Timer Name' },
			{ variableId: 'state', name: 'Timer State' },
			{ variableId: 'connection', name: 'Connection Status' },
		])

		this.updateVariablesFromState()
	}
}

runEntrypoint(RocketTimerInstance, upgradeScripts)
