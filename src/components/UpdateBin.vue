<style scoped>
.buttonBox {
  text-align:left;
}
.buttonBox > div {
  display: inline-block;
  margin: 20px 0 0 20px;
}
.buttonBox > button {
  margin: 20px 0 0 20px;
}
.buttonBox .el-input {
  width: 100px !important;
}
.buttonBox a {
  text-decoration: none;
  color: #fff;
}
.buttonBox a:link {
  text-decoration: none;
  color: #fff;
}
.buttonBox a:hover {
  text-decoration: none;
  color: #fff;
}
.buttonBox a:visited {
  text-decoration: none;
  color: #fff;
}
</style>

<template>
  <div id="main4">
    <div class="buttonBox">
      <el-cascader
      v-model="value"
      :options="options"
      @change="handleChange">
      </el-cascader>
      <el-input v-model="start" placeholder="起始地址"></el-input>
      <el-button type="primary"  icon="el-icon-circle-check"><a :href="href" target="_blank">刷机</a></el-button>
    </div> 
  </div>
</template>

<script scoped>
import axios from '../lib/axios'

const caches = {start: '', value: [], options: [], href: ''}
export default {
  data() {
    return caches
  },
  created() {
    this.fetchData()
  },
  updated() {
    caches.href = `http://localhost:3000/api/bin/update?type=${caches.value[0]}&name=${caches.value[1]}&start=${caches.start}`
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