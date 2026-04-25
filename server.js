const Koa = require('koa');
const Router = require('@koa/router')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const fs = require('fs')
const XLSX = require('xlsx')
const multer = require('@koa/multer')

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

router.get('/api/data/del', (ctx, next) => {
	var q = ctx.request.query
	if (!q.type || !q.name) {
		ctx.status = 400
		return
	}
	var filePath = `./datatmp/data_${q.type}.json`
	dJson = fs.readFileSync(filePath)
	data = JSON.parse(dJson)
	delete data[q.name]
	fs.writeFileSync(filePath, JSON.stringify(data))
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


const { json2exc, exc2json } = require('./srv/json2exc')
router.get('/api/excel', (ctx) => {
	var q = ctx.request.query
	if (!q.type || !q.name) {
		ctx.status = 400
		return
	}
	var filePath = `./datatmp/data_${q.type}.json`
	dJson = fs.readFileSync(filePath)
	data = JSON.parse(dJson)
	var {name, jd} = json2exc(q.type, q.name, data[q.name])

	const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(jd)
    XLSX.utils.book_append_sheet(workbook, worksheet)
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    })
    ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ctx.set('Content-Disposition', 'attachment; filename=data.xlsx')

	ctx.body = excelBuffer
})

router.post('/api/excel', (ctx) => {
	const file = ctx.file
	if (!file) {
		ctx.body = { code: 400, msg: '未上传文件' }
		return
	}
	// 解析 Excel
	const workbook = XLSX.read(file.buffer, { type: 'buffer' })
	const sheetName = workbook.SheetNames[0] // 取第一个 sheet
	const worksheet = workbook.Sheets[sheetName]
	const jsonData = XLSX.utils.sheet_to_json(worksheet) // 转 JSON
	ctx.body = exc2json(jsonData)
})

const { getBin, updateBin } = require('./srv/bin');
router.get('/api/bin', getBin)
router.get('/api/bin/update', updateBin)

const { 
	testOpen, testBin, getLogs, sendCmds, getAllCmds, cmdGetBin, getBinRlt,
	sendCmd, getCurPos, testPortStatus, getPorts
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
router.get('/api/ports', getPorts)

// 上传配置（内存存储，不保存文件）
const storage = multer.memoryStorage()
const upload = multer({ storage })

app
	.use(cors())
	.use(bodyParser())
	.use(upload.single('file'))
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
