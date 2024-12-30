const {json2bin, readJsonByType} = require('./lib')

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
		q = ctx.request.query
		name = q.name
		type = q.type
		start = +q.start
		dJson = readJsonByType(type)
		if (!dJson[name]) {
			return ctx.status = 404
		}
		b = json2bin(type, dJson[name])
		console.log('b', b)
		files = fs.readdirSync('./input')
		console.log('files', files)
		srcFile = fs.readFileSync(`./input/${files[0]}`)
		lenBin = b.length
		ctx.set('Content-Type', 'application/octet-stream')
		ctx.set('Content-Disposition', `${name}.bin`)
		ctx.body = Buffer.concat([srcFile.subarray(0, start), b, srcFile.subarray(start+lenBin)])
	}
}