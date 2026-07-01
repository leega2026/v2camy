
const UpMap = {
	0: ['','','','','','','','','','','','','','','','','','','','','','','','',
	  'KNEAD', 'KNOCK',
	  'PRESS', 'WAVELET',
	  'PAT',   'SHIATSU',
	  'SWING', 'STRETCH'
	],
	1: [
	  'PARK',       'ABSULATE',
	  'SHOULDER',   'TOP',
	  'NeckSwitch', 'NeckMed',
	  'PressNeck',  'FULL',
	  'SH1PART',    'SH2PART',
	  'SH3PART',    'SH4PART',
	  'SH5PART'
	],
	3: [
	  'STOP',      'P_MIN',
	  'P_MED',     'P_WAX',
	  'RN_F',      'RN_P_OFF',
	  'RN_P_MIN',  'RN_P_MED',
	  'RN_P_MAX',  'R_P_MIN',
	  'R_P_MED',   'R_P_WAX',
	  'RN_R',      'RNR_P_OFF',
	  'RNR_P_MIN', 'RNR_P_MED',
	  'RNR_P_WAX', 'FMIN_MED',
	  'FMED_MAX', 'FMIN_MAX', 'RMIN_MAX'
	],
	5: [ 'STOP', 'QD_WID', 'QD', 'PD', 'QD_MP3' ],
	9: [ 'D_STOP', 'D_UP', 'D_DN', 'D_DNUP' ]
}

const DownMap = {
	1: [
	  'PARK',   'ABSULATE',
	  'TOP',    'TOP_FW',
	  'LOW_FW', 'PART1',
	  'PART2',  'PART3',
	  'PART4',  'PART5',
	  'FULL'
	],
	3: [
	  'STOP',      'P_MIN',
	  'P_MED',     'P_WAX',
	  'RN_F',      'RN_P_OFF',
	  'RN_P_MIN',  'RN_P_MED',
	  'RN_P_MAX',  'R_P_MIN',
	  'R_P_MED',   'R_P_WAX',
	  'RN_R',      'RNR_P_OFF',
	  'RNR_P_MIN', 'RNR_P_MED',
	  'RNR_P_WAX', 'FMIN_MED',
	  'FMED_MAX', 'FMIN_MAX', 'RMIN_MAX'
	],
	5: [ 'STOP', 'QD_WID', 'QD', 'PD', 'QD_MP3' ],
	9: [ 'D_STOP', 'D_UP', 'D_DN', 'D_DNUP' ]
}

const AirNameMap = ['PE1', 'PE2', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'LUP', 'LDW', 'BUP', 'BDW', 'FEUP', 'FEDW', 'LEUP', 'LEDW', 'REXU', 'REXD', 'LEXU', 'LEXD']

module.exports = {
	json2exc: (type, name, d) => {
		switch(type) {
		case 'both':
			return json2excBoth(name, d)
		case 'air':
			return json2excAir(name, d)
		case 'uponly':
			return json2excUponly(name, d)
		}
	},
	exc2json: (jd) => {
		console.log('exc2json ', jd[0][1])
		switch(jd[0][1]) {
		case '上显示':
			return exc2jsonUponly(jd.slice(1))
		case '双机芯':
			return exc2jsonBoth(jd.slice(1))
		case '力度1':
			return exc2jsonAir(jd.slice(1))
		}
		return {}
	},
	exc2txt: (jd) => {
		var res = ''
		if (jd[0][1] == '力度1') {
			jd = jd.slice(1)
			jd.forEach((one) => {
				var arr = Object.values(one).slice(1)
				var rlts = []
				arr.slice(5).forEach((one, i) => {
					if (+one) {
						rlts.push(AirNameMap[i])
					}
				})
				res += `{${arr.slice(0, 5).join(',')},${rlts.join('|')}},\n`
			})
		} else {
			jd = jd.slice(1)
			jd.forEach((one) => {
				res += `{${Object.values(one).slice(1).join(',')}},\n`
			})
		}
		return res
	}
}

function json2excBoth(name, d) {
	var jd = [[
		'序号', '双机芯', '上显示/下推杆', '行走定位方式', '行走定位参数', '揉捏电机工作模式', '揉捏电机参数', '敲打电机工作模式', 
		'敲打电机运行时间', '敲打电机停止时间', '机芯速度', '3D电机工作模式', '3D电机工作参数', '循环次数/拉伸'
	]]
	
	d.ups.forEach((one, i) => {
		if (!one.checked) return
		var id = one.listId
		var up = one.lists
		var down = d.downs[i].lists
		var sw = d.sws[i].lists
		jd.push(
			[].concat(
				[id, '上机芯'], up.map((o, i) => UpMap[i] ? UpMap[i][o.val] || 0 : o.val)
			)
		)
		jd.push(
			[].concat(
				['', '下机芯'], down.map((o, i) => DownMap[i] ? DownMap[i][o.val] || 0 : o.val)
			)
		)
		jd.push([].concat(['', '力度'], sw.slice(0, 2).map(o => o.val), ['气泵'], sw.slice(2).map(o => o.val)))
	})
	return {name, jd}
}

function exc2jsonBoth(arr) {
	var rt = {
		type: 'both',
		ups: [],
		downs: [],
		sws: []
	}
	arr.map((item, i) => {
		var list = {
			lists: []
		}
		item = Object.values(item)
		switch(i%3) {
		case 0:
			//up
			list.checked = true
			list.listId = +item[0]
			list.vId = +item[0]
			list.lists = item.slice(2).map((o, j) => {
				var val = o
				if (UpMap[j]) {
					val = UpMap[j].indexOf(o)
				}
				return {val}
			})
			rt.ups.push(list)
			break
		case 1:
			// down
			list.lists = item.slice(2).map((o, j) => {
				var val = o
				if (DownMap[j]) {
					val = DownMap[j].indexOf(o)
				}
				return {val}
			})
			rt.downs.push(list)
			break
		case 2:
			// sw
			list.lists = [].concat(item.slice(2, 4), item.slice(5)).map(o => {
				return {val: o}
			})
			rt.sws.push(list)
			break
		}
	})
	return rt
}

function json2excUponly(name, d) {
	var jd = [[
		'序号', '上显示', '上行走定位方式', '上行走定位参数', '上揉捏电机工作模式', '上揉捏电机参数', '上敲打电机工作模式', '上敲打电机运行时间', 
		'上敲打电机停止时间', '上机芯速度', '3D电机工作模式', '3D电机工作参数', '机芯循环步数', '推杆控制', '拉伸气阀控制'
	]]
	
	d.ups.forEach((one, i) => {
		if (!one.checked) return
		var id = one.listId
		var up = one.lists
		jd.push(
			[].concat(
				[id], up.map((o, i) => UpMap[i] ? UpMap[i][o.val] || 0 : o.val)
			)
		)
	})
	return {name, jd}
}

function exc2jsonUponly(arr) {
	var rt = {
		type: 'uponly',
		ups: []
	}
	rt.ups = arr.map((item, i) => {
		var upList = {
			checked: true,
			listId: +item[0],
			vId: +item[0],
			lists: []
		}
		upList.lists = Object.values(item).slice(1).map((o, i) => {
			var val = o
			if (UpMap[i]) {
				val = UpMap[i].indexOf(o)
			}
			return {val}
		})
		return upList
	})
	return rt
}

function json2excAir(name, d) {
	var jd = [[
		'序号', '力度1', '力度2', '力度3', '力度4', '力度5', '气泵1', '气泵2', 'V1', 'V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12','V13','V14','V15','V16',
		'小腿上',  '小腿下','靠背上',  '靠背下','脚伸出',  '脚缩回', '腿/脚出', '腿/脚回','右伸出', '右缩回','右掰出', '右掰回'
	]]
	var count = 1
	d.ups.forEach((one, i) => {
		if (!one.checked) return
		var id = one.listId
		var up = one.lists.map(o => o.val)
		jd.push(
			[].concat(
				[count++], up.slice(30), up.slice(0, 30)
			)
		)
	})
	return {name, jd}
}

function exc2jsonAir(arr) {
	var rt = {
		type: 'air',
		ups: [],
		count: arr.length
	}
	rt.ups = arr.map((item, i) => {
		var upList = {
			checked: true,
			listId: +item[0],
			lists: []
		}
		item = Object.values(item).slice(1)
		item = [].concat(item.slice(5), item.slice(0, 5))
		upList.lists = item.map((o) => {
			return {val: o}
		})
		return upList
	})
	return rt
}

function binToHex(binStr) {
    // 位数不足4位前面补0
    while (binStr.length % 8 !== 0) {
        binStr = "0" + binStr;
    }
    let hex = [];
    for (let i = 0; i < binStr.length; i += 8) {
        const four = binStr.slice(i, i + 8);
        const num = parseInt(four, 2);
        hex.push(num.toString(16).toUpperCase()) 
    }
    console.log(hex)
    return hex.join('')
}
