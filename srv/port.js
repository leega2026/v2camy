const { SerialPort  } = require('serialport')
// const { ReadlineParser } = require('@serialport/parser-readline')
const {binary2json} = require('./lib')
const Addr = require('./addr')

module.exports = {
	initPort(path, baudRate, deviceId) {
		var pIns = this.get(path)
		console.log('initPort', path, baudRate, deviceId, pIns&&pIns.valid)
		// if (pIns && pIns.port && pIns.valid) return pIns
		if (pIns && pIns.port) {
			pIns.connect()
			return pIns
		}
		var myPort = new SerialPort({path, baudRate, highWaterMark: 32})
		// const parser = myPort.pipe(new ReadlineParser())
		pIns = this[path] = {
			port: myPort, valid: false, deviceId, data: {}, resBox: [], 
			posCache: {
				up: 0, down: 0, curStep: 0, curPos: 0, jian: 0,
			}, cache: {d: null, len: 0},
			close: function (err) {
				this.valid = false
				// this.port = null
				if (err) this.log(err)
			},
			log: function(str) {
				this.resBox.push(str)
			},
			connect: function () {
				var ram = parseInt(Math.random()*60535+5000).toString(16)
				this.write(getConnectHex(this.deviceId, ram))
				this.ram = ram
			},
			handleData: function (buf) {
				var posHead = buf.subarray(0, 2).toString('hex')
				var header = buf.subarray(0, 4).toString('hex')
				var posLen = parseInt(buf.subarray(2, 3).toString('hex'), 16)
				var dataLen = parseInt(buf.subarray(4, 6).toString('hex'), 16)
				console.log('handleData', buf, buf.length, posLen, dataLen)
				var isPosBuf = posHead.toUpperCase() == '5AA5'
				var isDataBuf = header.toUpperCase() == 'F5F5FAFA'
				if (!isPosBuf && !isDataBuf) {
					if (!this.cache.d || !this.cache.wait) return this.log(buf)
					this.cache.d = Buffer.concat([this.cache.d, buf])
					this.cache.wait--
					if (this.cache.wait <= 0) {
						var d = this.cache.d
						this.cache.d = null
						switch(this.cache.type) {
						case 'pos':
							// this.log(d.toString('hex'))
							this.handlePosChange(d)
							break
						default:
							this.log(Buffer.concat([this.cache.header, d]).toString('hex'))
							this._handleData(d)
						}
					}
					console.log('data len: ', buf.length, this.cache.wait)
				} else if (isPosBuf && buf.length - 2 < posLen) {
					this.cache.d = buf
					this.cache.wait = 1
					this.cache.type = 'pos'
				} else if (isDataBuf && buf.length - 4 < dataLen) {
					this.cache.d = buf.subarray(6)
					this.cache.header = buf.subarray(0, 6)
					this.cache.wait = Math.ceil((dataLen+4)/32) - 1
					this.cache.type = 'data'
				} else { 
					this.log(buf.toString('hex'))
					this._handleData(buf.subarray(6))
				}
			},
			_handleData: function(buf) {
				if (buf.length <= 12) {
					this.handleHandback(buf)
				} else {
					if (!this.valid) return
					this.handleBinData(buf)
				}
			},
			handleHandback: function(buf) {
				var deviceId = buf.subarray(0, 8).toString()
				if (deviceId != this.deviceId) {
					console.log(buf, deviceId)
					return this.log(`deviceId not match:${deviceId}`)
				}
				var vsum = buf.subarray(8, 10).toString('hex')
				this.valid = validRandomSum(this.ram, vsum)
				if (!this.valid) {
					console.log(`err: valid failed.ram is ${this.ram}, sum is ${vsum}`)
				}
			},
			handleBinData: function (buf) {
				var count = parseInt(buf.subarray(2, 4).toString('hex'), 16)	
				var step = parseInt(buf.subarray(4, 6).toString('hex'), 16)
				var dataBuf = buf.subarray(step)
				console.log(buf, count, step, dataBuf)
				var bufArr = []
				for (var i =0; i<count; i++) {
					bufArr.push(dataBuf.subarray(i*step, (i+1)*step))
				}
				this.data = binary2json(bufArr)
			},
			handlePosChange: function (buf) {
				var len = buf.length
				this.posCache.jian = buf[len-6]
				this.posCache.up = buf[len-5]
				this.posCache.down = buf[len-4]
				this.posCache.curPos = buf[len-3]
				this.posCache.curStep = buf[len-1]
			},
			sendBin: function(type, buf) {
				if (!this.valid) return
				this.write(formatBinBuffer(buf, type))
			},
			getBin: function(ind) {
				if (!this.valid) return this.log('err: please validate first')
				if (!Addr[ind]) return this.log('err: address not found')
				var str = `000855AA${Addr[ind]}`
				var sum = getValidHex(str)
				this.write(`FAFAF5F5${str}${sum}`)
			},
			getData: function() {
				return this.data
			},
			getLogs: function() {
				var len = this.resBox.length
				var rlt = this.resBox.slice(0, len)
				this.resBox = this.resBox.slice(len)
				return rlt
			},
			sendCmd: function(cmd) {
				var wrappedCmd = str2command(cmd)
				this.write(wrappedCmd)
			},
			write: function(str) {
				this.port.write(str, 'hex')
				this.log(str)
			}
		}
		myPort.on('open', () => {
			console.log(`port ${path} is open`)
			pIns.connect()
		})
		myPort.on('close', () => {
			console.log(`port ${path} is close`)
			this[path] = null
		})
		myPort.on('data', (buf) => {
			pIns.handleData(buf)
		})
		myPort.on('error', (err) => {
			console.log(err)
			pIns.close(err)
		})
	},
	get(path) {
		var pIns = this[path]
		if (pIns) {
		// if (pIns && pIns.valid) {
			return pIns
		}
		return null
	},
	buildFirstStepBuf
}

function getConnectHex(deviceId, ram) {
	var header = 'FAFAF5F5'
	var len = '000c'
	var deviceHex = deviceId2Byte8(deviceId)
	var sum = getValidHex(len + deviceHex + ram)
	return `${header}${len}${deviceHex}${ram}${sum}`
}

function getValidHex(ram) {
	var len = parseInt(ram.length/2)
	var buf = Buffer.alloc(len, ram, 'hex')
	sum = 0
	buf.forEach((num) => {
		sum += num
	})
	return len2Byte(sum)
}

function validRandomSum(ram, vsum) {
	var len = ram.length
	var buf = Buffer.alloc(len, '0' + ram.split('').join('0'), 'hex')
	sum = 0
	buf.forEach((num) => {
		sum += num*7
	})
	return sum == parseInt(vsum, 16)
}

function deviceId2Byte8 (deviceId) {
	var buf = Buffer.alloc(8, deviceId)
	return buf.toString('hex')
}

function str2command(str) {
	rlt = ['7E3041']
	rlt.push(str)
	// str.split('').forEach((s) => {
	// 	rlt.push(s.charCodeAt(0)) 
	// })
	rlt.push('0D0A')
	return rlt.join('')
}

const Type2ByteHex = {
	air: '0008', both: '0014', uponly: '000c'
}
const Type2ByteNum = {
	air: 8, both: 20, uponly: 12
}
const Type2HexPadding = {
	air: 'FFFF', both: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFF', uponly: 'FFFFFFFFFFFF'
}
// function formatBufForSend(buf, type) {
// 	const len = buf.length
// 	var num = Math.ceil(len/2048)
// 	var rsArr = []
// 	for (var i=0; i < num; i++) {
// 		rsArr.push(formatBinBuffer(buf.subarray(i*2048, (i+1)*2048)))
// 	}
// 	return rsArr
// }
function formatBinBuffer(buf, type) {
	const header = 'FAFAF5F5'
	const len = buf.length
	const step = parseInt(len/Type2ByteNum[type])
	var firstStepBuf = buildFirstStepBuf(type, step)
	var buf = Buffer.concat([firstStepBuf, buf], len+firstStepBuf.length)
	var sum = 0
	buf.forEach((b) => {
		sum += b
	})
	return `${header}${len2Byte(buf.length)}${buf.toString('hex')}${len2Byte(sum)}`
}
function len2Byte(len) {
	res = len.toString(16)
	if (len <= 15) {
		res = '000' + res
	} else if (len <= 255) {
		res = '00' + res
	} else if (len <= 4095) {
		res = '0' + res
	}
	return res
}
function buildFirstStepBuf(type, step) {
	return Buffer.alloc(Type2ByteNum[type], 'AA55' + len2Byte(step) + Type2ByteHex[type] + Type2HexPadding[type], 'hex')
}