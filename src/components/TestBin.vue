<style scoped>
#main5 .buttonBox {
  text-align:left;
  min-width: 560px;
}
#main5 .buttonBox > div {
  display: inline-block;
  margin: 20px 0 0 20px;
}
#main5 .buttonBox > button {
  margin: 20px 0 0 20px;
}
#main5 .buttonBox .el-input {
  width: 100px !important;
}
#main5 .buttonBox .addr-select {
  width: 100px !important;
}
#main5 .buttonBox .el-statistic{
  display: inline-block;
  width: 70px;
  line-height: 20px;
  margin: 10px 5px;
}
#main5 .buttonBox .el-cascader {
  width: 120px !important;
}
#output-plane {
  width: 96%;
  height: 400px;
  overflow: scroll;
  position: relative;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  padding: 7% 2% 0 2%;
  border: 1px solid #eaeefb;
  background-color: #fafafa;
  border-radius: 4px;
}
#output-plane .plane-opts {
  position:absolute;
  right: 10px;
  top: 10px;
}
#output-plane .plane-opts > button {
  margin-right: 10px;
}
.el-divider__text {
  color: #409EFF;
}
.output-res-span {
  display: block;
}

</style>

<template>
  <div id="main5">
    
    <el-row><el-col :span="24">
      <div id="test-plane"></div>
    </el-col></el-row>
    <el-row>
    <el-col :span="12">
      <div id="output-plane">
        <div class="plane-opts">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="clearOutputBox" circle></el-button>
          <el-checkbox v-model="hex" @change="switchHex">hex</el-checkbox>
        </div>
        <span class="output-res-span" v-for="(r, i) in res" :key="i">
          {{r}}</span>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="buttonBox">
        <el-divider content-position="left">串口连接</el-divider>
        <el-select class="addr-select" v-model="port" placeholder="请选择">
          <el-option
            v-for="item in ports"
            :key="item.path"
            :label="item.path"
            :value="item.path">
          </el-option>
        </el-select>
        <el-input v-model="byte" placeholder="波特率"></el-input>
        <el-input v-model="deviceId" placeholder="机器型号"></el-input>
        <el-button type="primary" @click="connect" icon="el-icon-circle-check">连接</el-button>
        <el-divider content-position="left">bin读取/发送</el-divider>
        <el-select class="addr-select" v-model="addrIndex" placeholder="请选择">
          <el-option
            v-for="(item, i) in addrLists"
            :key="i"
            :label="'AUTO'+i"
            :value="i">
          </el-option>
        </el-select>
        <el-button :disabled="!connectValided" type="primary" @click="fetchBin" icon="el-icon-circle-check">读取</el-button>
        <el-cascader
        v-model="value"
        :options="options"
        @change="handleChange">
        </el-cascader>
          <el-button :disabled="!connectValided" type="primary" @click="updateBin" icon="el-icon-circle-check">发送</el-button>
        <el-divider content-position="left">肩位调整</el-divider>
        <el-tooltip content="上行" placement="bottom" effect="light">
          <el-button :disabled="!connectValided" @mousedown.native="startIncUpPos" @mouseup.native="stopSetPos" type="warning" icon="el-icon-caret-top" circle></el-button>
        </el-tooltip>
        <el-statistic :precision="0" :value="pos.jian" title="肩部位置"></el-statistic>
        <el-tooltip content="下行" placement="bottom" effect="light">
          <el-button :disabled="!connectValided" @mousedown.native="startDecUpPos" @mouseup.native="stopSetPos" type="warning" icon="el-icon-caret-bottom" circle></el-button>
        </el-tooltip>
        <el-tooltip content="肩位调整确定" placement="bottom" effect="light">
          <el-button :disabled="!connectValided" @click="savePosSet" type="success" icon="el-icon-finished" circle></el-button>
        </el-tooltip>
        <el-statistic :precision="0" :value="pos.up" title="上机芯位置"></el-statistic>
        <el-statistic :precision="0" :value="pos.down" title="下机芯位置"></el-statistic>
        <el-statistic :precision="0" :value="pos.curPos" title="3D推出位置"></el-statistic>
        <el-statistic :precision="0" :value="pos.curStep" title="当前步数"></el-statistic>
        <el-divider content-position="left">按摩椅操作</el-divider>
        <el-button :disabled="!connectValided" type="primary" @click="startPosSet" icon="el-icon-circle-check">启动</el-button>
        <el-button :disabled="!connectValided" type="primary" @click="sendCmd('3235')" icon="el-icon-circle-check">暂停</el-button>
        <el-button :disabled="!connectValided" type="primary" @click="sendCmd('3236')" icon="el-icon-circle-check">复位</el-button>
        <el-button :disabled="!connectValided" type="primary" @click="sendCmd('3230')" icon="el-icon-circle-check">关机</el-button>
        <el-divider content-position="left">指令发送</el-divider>
        <el-select
          v-model="commands"
          multiple
          filterable
          allow-create
          default-first-option
          @change="commandsChange"
          placeholder="选择或创建指令">
          <el-option
            v-for="item in allCommands"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button :disabled="!connectValided" type="primary" @click="sendCommands" icon="el-icon-circle-check">发送</el-button>
      </div>
    </el-col></el-row>
  </div>
</template>

<script scoped>
import UpMana from './UpMana.vue'
import BothMana from './BothMana.vue'
import AirMana from './AirMana.vue'
import axios from '../lib/axios'
import func from '../lib/func'

const caches = {
  port: 'COM3', value: [], options: [], hex: true, byte: '38400', deviceId: 'GR241209', ports: [],
  activeComp: false, index: 0, connectValided: false, addrIndex: 0, addrLists: new Array(30),
  commands: [], allCommands: [], res: [], pos: {up: 0, down: 0, curStep: 0, curPos: 0, timer: null}
}
export default {
  data() {
    return caches
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      axios.get('/api/allkeys')
        .then(res => {
          caches.options = formatkeys(res.data)
        })
        .catch(e => {
          console.error('err ', e)
        })
      axios.get('/api/test/cmds')
        .then(res => {
          caches.allCommands = res.data
        })
        .catch(e => {
          console.error('err ', e)
        })
      setInterval(() => {
        axios.get('/api/ports')
          .then(res => {
            caches.ports = res.data
          })
          .catch(e => {
            console.error('err ', e)
          })
      }, 2000)
    },
    fetchBin() {
      axios.get(`/api/test/bin/cmd?port=${caches.port}&index=${caches.addrIndex}`)
        .then(res => {
          setTimeout(() => {
            this.readBin()
          }, 1000)
          this.$message({message: '读取成功！', type: 'success'})
        })
        .catch(e => {
          this.$message.error('读取失败，请稍后再试！', e)
        })
    },
    readBin() {
      axios.get(`/api/test/bin?port=${caches.port}`)
        .then(res => {
          this.$message({message: '读取成功！', type: 'success'})
          this.loadMana(res.data.type, null, res.data)
        })
        .catch(e => {
          this.$message.error('读取失败，请稍后再试！')
        })
    },
    connect() {
      axios.get(`/api/test/open?port=${caches.port}&byte=${caches.byte}&deviceId=${caches.deviceId}`)
        .then(() => {
          setTimeout(() => {
            axios.get(`/api/test/status?port=${caches.port}`)
              .then((res) => {
                if (res.data.valid) {
                  this.$message({message: '连接成功！', type: 'success'})
                  caches.connectValided = true
                  localStorage.setItem('isAuth', 'true')
                  this.setupFetchPortRes()
                } else {
                  this.$message.error('状态验证失败，请稍后再试！')
                  localStorage.setItem('isAuth', 'false')
                }
              })
              .catch(e => {
                this.$message.error('状态验证失败，请稍后再试！')
                localStorage.setItem('isAuth', 'false')
              })
          }, 200)
        })
        .catch(e => {
          this.$message.error('连接失败，请稍后再试！')
        })
    },
    updateBin() {
      if (!caches.activeComp) return
      var co = caches.activeComp._data.caches
      axios.post(`/api/test/bin`, {
        port: caches.port,
        type: co.type,
        data: co.obj[co.selected]
      })
        .then(res => {
          console.log(res)
          this.$message({message: '发送成功！', type: 'success'})
        })
        .catch(e => {
          console.error('updateBin err ', e)
          this.$message.error('发送失败，请稍后再试！')
        })
    },
    setupFetchPortRes() {
      caches.portTimer = setInterval(() => {
        this.fetchPortRes()
      }, 1000)
    },
    fetchPortRes() {
      axios.get(`/api/test/res?port=${caches.port}&index=${caches.index}`)
        .then(res => {
          if (res.data.length != 0) {
            res.data.forEach((d) => {
              this.renderPortRes(d)
            })
            if (caches.res.length > 100) {
              caches.res = caches.res.slice(caches.res.length - 100)
            }
          }
        })
        .catch(e => {
          console.error('fetchPortRes err ', e)
        })
    },
    clearOutputBox() {
      caches.res = []
    },
    renderPortRes(data) {
      var str = `[${(new Date()).toLocaleString()}] `
      var len = data.length
      var c = parseInt(len/8)
      for (var i = 0; i <=c; i++) {
        str += data.slice(i*8, (i+1)*8) + ' '
      }
      caches.res.push(str)
      caches.index++
    },
    switchHex() {

    },
    sendCommands() {
      var cmds = []
      caches.allCommands.forEach((cmd) => {
        if (caches.commands.includes(cmd.value)) {
          cmds.push(cmd)
        }
      })
      axios.post('/api/test/cmds', {
        port: caches.port,
        cmds: cmds
      }).then(() => {
        this.$message({message: '指令发送成功！', type: 'success'})
      })
      .catch(e => {
        this.$message.error('指令发送失败，请稍后再试！')
      })
    },
    sendCmd(cmd, mute) {
      if (cmd == '3236' && caches.pos.startTimer) { // 复位
        clearInterval(caches.pos.startTimer)
      }
      axios.get(`api/test/cmd?port=${caches.port}&cmd=${cmd}`)
      .then(() => {
        if (!mute) this.$message({message: '指令发送成功！', type: 'success'})
      })
      .catch(e => {
        if (!mute) this.$message.error('指令发送失败，请稍后再试！')
      })
    },
    refreshPos() {
      axios.get(`api/pos?port=${caches.port}`)
      .then((res) => {
        caches.pos.jian = res.data.jian
        caches.pos.up = res.data.up
        caches.pos.down = res.data.down
        caches.pos.curPos = res.data.curPos
        caches.pos.curStep = res.data.curStep
      })
      .catch(e => {
      })
    },
    commandsChange() {
      var len = caches.commands.length
      var last = caches.commands[len-1]
      if (!last) return
      var arr = last.split(' ')
      if (arr.length < 2) return
      var cmdObj = {
        value: arr[1],
        label: arr[0]
      }
      // caches.allCommands.pop()
      caches.allCommands.push(cmdObj)
      caches.commands.pop()
    },
    handleChange(val) {
      this.loadMana(val[0], val[1])
    },
    loadMana(type, selected, data) {
      const dom = document.querySelector('#test-plane')
      dom.innerHTML = ''
      var compIns
      switch(type){
        case 'uponly':
          compIns = func.addMainComp(dom, UpMana, 'test-bin-dom');
          break
        case 'both':
          compIns = func.addMainComp(dom, BothMana, 'test-bin-dom');
          break
        case 'air': 
          compIns = func.addMainComp(dom, AirMana, 'test-bin-dom');
          break
      }
      compIns._data.caches.selected = selected
      compIns._data.itemBoxId = 'TestBinTableItemBox'
      caches.activeComp = compIns
      setTimeout(()=>{
        compIns.load(data)
      }, 200)
    },
    startPosSet() {
      this.sendCmd('3234')
      caches.pos.startTimer = setInterval(() => {
        this.refreshPos()
      }, 1000)
    },
    startIncUpPos() {
      if (caches.pos.timer) clearInterval(caches.pos.timer)
      caches.pos.timer = setInterval(() => {
        this.sendCmd('3231', true)
        this.refreshPos()
      }, 100)
    },
    stopSetPos() {
      if (caches.pos.timer) clearInterval(caches.pos.timer)
      caches.pos.timer = null
    },
    startDecUpPos() {
      if (caches.pos.timer) clearInterval(caches.pos.timer)
      caches.pos.timer = setInterval(() => {
        this.sendCmd('3232', true)
        this.refreshPos()
      }, 100)
    },
    savePosSet() {
      this.sendCmd('3233')
    }
  }
}

const KeyNameMap = {
  'uponly': '单机芯',
  'both': '双机芯',
  'air': '气泵'
}
function formatkeys(keys) {
  var res = []
  Object.keys(keys).forEach((key) => {
    var obj = {value: key, label: KeyNameMap[key], children: []}
    keys[key].forEach((one) => {
      obj.children.push({value: one, label: one})
    })
    res.push(obj)
  })
  return res
}
</script>