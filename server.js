const Koa = require('koa');
const Router = require('@koa/router')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const fs = require('fs')

const port = 3000

const app = new Koa();
const router = new Router();
const AllTypes = ['uponly', 'both', 'air']

app.use(require('koa-static')('./dist'))

router.get('/', (ctx, next) => {
	ctx.set('Content-Type', 'text/html')
	ctx.body = fs.readFileSync('./dist/index.html')
})

router.get('/api/allkeys', (ctx, next) => {
	resData = {}
	AllTypes.forEach((type) => {
		jData = readJsonByType(type)
		resData[type] = Object.keys(jData)
	})
	ctx.body = resData
	ctx.status = 200
})

router.get('/api/data', (ctx, next) => {
	if (!ctx.request.query.type) {
		ctx.status = 400
		return
	}
	dJson = fs.readFileSync(`./datatmp/data_${ctx.request.query.type}.json`)
	data = JSON.parse(dJson)
	ctx.body = data
	ctx.status = 200
})

router.post('/api/data', (ctx) => {
	body = ctx.request.body
	console.log('POST /api/data', body.data.type)
	filePath = `./datatmp/data_${body.data.type}.json`
	dJson = fs.readFileSync(filePath)
	parsedData = JSON.parse(dJson)
	parsedData[body.key] = body.data
	fs.writeFileSync(filePath, JSON.stringify(parsedData))
	ctx.status = 200
	ctx.body = {status: 200, data: 'ok'}
})

const { getBin, updateBin } = require('./srv/bin');
router.get('/api/bin', getBin)
router.get('/api/bin/update', updateBin)

const { 
	testOpen, testBin, getLogs, sendCmds, getAllCmds, cmdGetBin, getBinRlt,
	sendCmd, getCurPos, testPortStatus
} = require('./srv/test');
router.get('/api/test/open', testOpen)
router.get('/api/test/status', testPortStatus)
router.get('/api/test/bin', getBinRlt)
router.get('/api/test/bin/cmd', cmdGetBin)
router.post('/api/test/bin', testBin)
router.get('/api/test/res', getLogs)
router.post('/api/test/cmds', sendCmds)
router.get('/api/test/cmd', sendCmd)
router.get('/api/test/cmds', getAllCmds)
router.get('/api/pos', getCurPos)

app
	.use(cors())
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods())
	.use((ctx, next) => {
		var ign = '/api/test/res'
		var url = ctx.request.url
		if (url.match(ign) == null) console.log(`${ctx.request.method} ${url}`)
		next()
	})
	.listen(port, ()=> {
		console.log(`server suc at ${port}`)
	});

function readJsonByType(type) {
	return JSON.parse(fs.readFileSync(`./datatmp/data_${type}.json`))
}
