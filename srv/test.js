const fs = require('fs')
const { SerialPort, ReadlineParser } = require('serialport');

const {json2bin} = require('./lib')
const PortIns = require('./port')
const cmdsJson = require('../datatmp/cmds.json')

module.exports = {
	testOpen: (ctx, next) => {
		var q = ctx.request.query
		var qPort = q.port
		var byte = +(q.byte || 9600)
		var deviceId = q.deviceId
		SerialPort.list().then((ports) => {
			ports.forEach((port) => {
				console.log('port', port)
				var pPath = port.path
				if (pPath != qPort) return
				PortIns.initPort(pPath, byte, deviceId)
			})
		}).catch(() => {
		    ctx.status = 400
		    ctx.body = '获取串口失败！'
		})
		ctx.status = 200
	},
	testPortStatus: (ctx, next) => {
		var q = ctx.request.query
		var pIns = PortIns.get(q.port)
		ctx.body = {valid: pIns && pIns.valid}
		ctx.status = 200
	},
	testBin: (ctx, next) => {
		var body = ctx.request.body
		var port = body.port
		var type = body.type
		console.log(type, port, body.data)
		var binBuf = json2bin(type, body.data)
		var pIns = PortIns.get(port)
		if (!pIns) {
			ctx.status = 404
			ctx.body = 'port未找到'
			return
		}
		pIns.sendBin(type, binBuf)
		ctx.status = 200
	},
	cmdGetBin: (ctx, next) => {
		var q = ctx.request.query
		var pIns = PortIns.get(q.port)
		if (!pIns) {
			ctx.status = 404
			ctx.body = 'port未找到'
			return
		}
		pIns.getBin(q.index)
		ctx.status = 200
	},
	getBinRlt: (ctx, next) => {
		var q = ctx.request.query
		var pIns = PortIns.get(q.port)
		if (!pIns) {
			ctx.status = 404
			ctx.body = 'port未找到'
			return
		}
		ctx.body = pIns.getData()
		ctx.status = 200
	},
	getLogs: (ctx, next) => {
		var q = ctx.request.query
		var pIns = PortIns.get(q.port)
		if (!pIns) {
			ctx.status = 404
			ctx.body = 'port未找到'
			return
		}
		ctx.body = pIns.getLogs()
		ctx.status = 200
	},
	sendCmds: (ctx, next) => {
		var body = ctx.request.body
		var cmds = body.cmds
		var port = body.port

		var updated = false
		var cmdKeys = []
		cmds.forEach((cmd) => {
			if (!cmdsJson[cmd.label]) {
				updated = true
				cmdsJson[cmd.label] = cmd.value
			}
			cmdKeys.push(cmd.value)
		})
		if (updated) {
			fs.writeFileSync('./datatmp/cmds.json', JSON.stringify(cmdsJson))
		}
		var pIns = PortIns.get(port)
		if (!pIns) {
			ctx.status = 404
			ctx.body = 'port未找到'
			return
		}
		cmdKeys.forEach((key) => {
			pIns.sendCmd(key)
		})
		ctx.status = 200
		ctx.body = {}
	},
	sendCmd: (ctx, next) => {
		var q = ctx.request.query
		var pIns = PortIns.get(q.port)
		if (!pIns) {
			ctx.status = 404
			ctx.body = 'port未找到'
			return
		}
		pIns.sendCmd(q.cmd)
		ctx.status = 200
		ctx.body = {}
	},
	getAllCmds: (ctx, next) => {
		var rlt = []
		Object.keys(cmdsJson).forEach((label) => {
			rlt.push({label: label, value: cmdsJson[label]})
		})
		ctx.body = rlt
	},
	getCurPos: (ctx, next) => {
		var q = ctx.request.query
		var pIns = PortIns.get(q.port)
		if (!pIns) {
			ctx.status = 404
			ctx.body = 'port未找到'
			return
		}
		ctx.status = 200
		ctx.body = pIns.posCache
	}
}
