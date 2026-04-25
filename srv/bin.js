const Addr = require('./addr')
const fs = require('fs')
const {json2bin, readJsonByType, getCheckedCount} = require('./lib')
const {buildFirstStepBuf} = require('./port')

module.exports = {
	getBin: (ctx, next) => {
		q = ctx.request.query
		name = q.name
		type = q.type
		dJson = readJsonByType(type)
		if (!dJson[name]) {
			return ctx.status = 404
		}
		b = json2bin(type, dJson[name])
		ctx.set('Content-Type', 'application/octet-stream')
		ctx.set('Content-Disposition', `${name}.bin`)
		ctx.body = b
	},
	updateBin: (ctx, next) => {
		var q = ctx.request.query
		var name = q.name
		var type = q.type
		var start = +q.start
		dJson = readJsonByType(type)
		if (!dJson[name]) {
			return ctx.status = 404
		}
		var ind = parseInt(Addr[start], 16)
		b = json2bin(type, dJson[name])
		console.log('json2bin', b)
		var firstStep = buildFirstStepBuf(type, getCheckedCount(dJson[name]))
		console.log('firstStep', firstStep)
		files = fs.readdirSync('./input')
		console.log('files', files)
		srcFile = fs.readFileSync(`./input/${files[0]}`)
		lenBin = b.length
		ctx.set('Content-Type', 'application/octet-stream')
		ctx.set('Content-Disposition', `${name}.bin`)
		ctx.body = Buffer.concat([srcFile.subarray(0, ind), firstStep, b, srcFile.subarray(ind+lenBin)])
		fs.writeFileSync(`./output/${files[0]}`, ctx.body)
	}
}