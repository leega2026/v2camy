const fs = require('fs')

module.exports = {
	json2bin: function(type, j) {
		len = j.ups.length
		bufArr = []
		switch(type) {
		case 'uponly':
		case 'air':
			j.ups.forEach((up) => {
				if (!up.checked) return
				bufArr.push(json2binaryByType(type, up.lists))
			})
			break
		case 'both':
			j.ups.forEach((up, i) => {
				if (!up.checked) return
				bufArr.push(json2binaryByType(type, up.lists))
				bufArr.push(json2binaryByType(type, j.downs[i].lists))
				bufArr.push(json2binaryByType('sw', j.sws[i].lists))
			})
			break
		}
		
		return Buffer.concat(bufArr)
	},
	binary2json: function(bufArr) {
		var len = bufArr[0].length
		var res = {
			count: 0, 
			type: len==20?'both': 'uponly',
			ups: [],
			downs: []
		}
		bufArr.forEach((buf) => {
			if (len == 20) {
				res.ups.push(_binary2json(buf.subarray(0, 8)))
				res.downs.push(_binary2json(buf.subarray(8, 16)))
				res.sws.push(_binary2jsonSw(buf.subarray(16)))
			} else {
				res.ups.push(_binary2json(buf.subarray(0, 12)))
			}
		})
		res.count = res.ups.length
		return res
	},
	binary2jsonAir: function(bufArr) {
		var res = {
			count: 0, 
			type: 'air',
			ups: []
		}
		bufArr.forEach((buf, i) => {
			var list = {checked: true, listId: i+1, lists: []}
			// todo
		})
		res.count = res.ups.length
		return res
	},
	readJsonByType: function(type) {
		return JSON.parse(fs.readFileSync(`./datatmp/data_${type}.json`))
	},
	getCheckedCount: function(data) {
		var c = 0
		data.ups.forEach((one) => {
			if (one.checked) c++
		})
		return c
	}
}

function json2binaryByType(type, j) {
	var arr = []
	switch(type) {
	case 'uponly':
	case 'both':
		arr.push(+j[0].val)
		arr.push(+j[1].val)
		arr.push(+j[2].val)
		arr.push(j[3].val + (j[4].val << 5))
		arr.push(j[5].val + (j[6].val << 3))
		arr.push(j[7].val + (j[8].val << 5))
		arr.push(j[9].val + (j[10].val << 2))
		arr.push(j[11].val)
		break
	case 'air':
		for(var i = 0; i < 4; i++) {
			var rl = 0
			for(var c = 0; c < 8; c++) {
				rl += j[i*8 + c].val << 7-c
			}
			arr.push(rl)
		}
		arr.push(j[32].val)
		arr.push(j[33].val)
		arr.push(j[34].val)
		arr.push(j[35].val)
		arr.push(j[36].val)
		break
	case 'sw':
		arr.push(j[0].val)
		arr.push(j[1].val)  // 前2字节力道 0-255
		for(var i = 0; i < 2; i++) {
			var rl = 0
			for(var c = 0; c < 8; c++) {
				rl += j[2 + i*8 + c].val << 7-c
			}
			arr.push(rl)
		}
		break
	}
	return Buffer.from(arr, 'hex')
}

function _binary2json(buf) {
	var res = {checked: true, lists: []}
	res.lists[0] = {id: 0, val: buf[0] < 24 ? 24 : buf[0]}
	res.lists[1] = {id: 1, val: buf[1]}
	res.lists[2] = {id: 2, val: buf[2]}
	var byte3 = num2binary8Bit(buf[3])
	res.lists[3] = {id: 3, val: parseInt(byte3.slice(3), 2)}
	res.lists[4] = {id: 4, val: parseInt(byte3.slice(0, 3), 2)}
	var byte4 = num2binary8Bit(buf[4])
	res.lists[5] = {id: 5, val: parseInt(byte4.slice(5), 2)}
	res.lists[6] = {id: 6, val: parseInt(byte4.slice(0, 5), 2)}
	var byte5 = num2binary8Bit(buf[5])
	res.lists[7] = {id: 7, val: parseInt(byte5.slice(3), 2)}
	res.lists[8] = {id: 8, val: parseInt(byte5.slice(0, 3), 2)}
	var byte6 = num2binary8Bit(buf[6])
	res.lists[9] = {id: 9, val: parseInt(byte6.slice(6), 2)}
	res.lists[10] = {id: 10, val: parseInt(byte6.slice(0, 6), 2)}
	res.lists[11] = {id: 11, val: buf[7]}
	if (buf.length > 8) {
		res.lists[12] = {id: 12, val: buf[8], vals: num2bitArr(+buf[8])}
		res.lists[13] = {id: 13, val: buf[9], vals: num2bitArr(+buf[9])}
	}
	return res
}

function _binary2jsonSw(bufArr) {
	var res = {
		lists: []
	}
	res.lists[0] = {val: bufArr[0]}
	res.lists[1] = {val: bufArr[1]}
	bufArr.slice(2).forEach((buf, i) => {
		var byteArr = num2binary8Bit(buf).split('')
		byteArr.forEach((b) => {
			res.lists.push({val: +b})
		})
	})
	return res
}

function num2bitArr(num) {
	var arr = []
	var bits = num.toString(2).split('')
	bits.reverse()
	var len = bits.length
	while (len--) {
		if (+bits[len]) arr.push(Math.pow(2, len))
	}
	return arr
}

function num2binary8Bit(num) {
	var tmp = '00000000'
	var str = num.toString(2)
	var len = str.length
	return `${tmp.slice(0, 8-len)}${str}`
}