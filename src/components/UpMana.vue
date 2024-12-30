<template>
  <div id="main1">
    <div class="buttonBox">
      <el-button type="success" @click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>
      <el-button type="primary" @click="save" size="mini" icon="el-icon-upload2">保存</el-button>
      <el-select size="mini" v-model="caches.selected" filterable placeholder="请选择">
        <el-option
          v-for="(value, name) in caches.obj"
          :key="name"
          :label="name"
          :value="name">
        </el-option>
      </el-select>
      <el-button type="primary" @click="load()" size="mini" icon="el-icon-download">载入</el-button>
      <el-button type="danger" @click="clear" size="mini" icon="el-icon-delete">清空</el-button>
    </div> 
    <TabHead />
    <div :id="itemBoxId">
    </div>
  </div>
</template>

<script scoped>
import TabItem from '../components/ManaTableItemUp.vue'
import TabHead from '../components/ManaTableHead.vue'
import axios from '../lib/axios'
import func from '../lib/func'
const caches = {selected: "", obj: {}}
const localData = {ups: [], count: 0}
const children = []

export default {
  name: 'UpMana',
  components: {
    TabHead
  },
  data() {
    return {ups: localData.ups, caches, itemBoxId: 'TableItemBox'}
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      axios.get('/api/data?type=uponly')
        .then(res => {
          caches.obj = res.data
        })
        .catch(e => {
          console.error('err ', e)
        })
    },
    add() {
      const dom = document.querySelector(`#${this._data.itemBoxId}`)
      var clearedData = func.addComp(dom, TabItem, 'up-item-dom', localData.count+1, this)
      localData.ups.push(clearedData)
      children.push(clearedData)
      localData.count++
      return clearedData
    },
    save() {
      this.$prompt('保存名称', '保存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        var _d = {ups: localData.ups.slice(), count: localData.count, type: 'uponly'}
        axios.post('/api/data', {
          key: value,
          data: _d
        }).then(()=> {
          caches.obj[value] = _d
          caches.selected = value
          this.$message({message: '保存成功！', type: 'success'})
        }).catch(e => {
          console.log('save', e)
          this.$message.error('保存失败，请稍后再试！');
        })
      }).catch((e) => {
        console.log('save', e)
        this.$message.error('保存失败，请稍后再试！');     
      });
    },
    load(data) {
      this._clear()
      var d = data || caches.selected && caches.obj[caches.selected]
      if (!d) return
      const loading = this.$loading({
        lock: true,
        text: '数据加载中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        const dom = document.querySelector(`#${this._data.itemBoxId}`)
        func.addCompMutil(dom, TabItem, d.ups.length, this, (vd, i) => {
          func.match(d.ups[i], vd)
          vd.refresh && vd.refresh()
          children.push(vd)
        })
        localData.ups = d.ups
        localData.count = d.ups.length
        this.$nextTick(() => {
          loading.close()
        })
      }, 100)
    },
    clear() {
      this.$confirm('确认清空?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._clear()
      }).catch(() => {
      });
    },
    _clear() {
      var dom = document.querySelector(`#${this._data.itemBoxId}`)
      if(dom) dom.innerHTML = ''
      localData.ups = [] 
      localData.count = 0
      children = []
    },
    childRemove(id) {
      localData.ups.splice(id-1, 1)
      children.splice(id-1, 1)
      localData.count--
      refreshListId()
      console.log(id, localData.ups, children)
    },
    refreshListId() {
      children.forEach((child, i) => {
        child.listId = i+1
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main1 {
  overflow-x: scroll;
}
#TableItemBox {
  width: 1740px;
   max-height:600px;
  overflow-y: scroll;
  overflow-x: hidden;
}
#TestBinTableItemBox {
  width: 1740px;
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.buttonBox {
  position: absolute;
  left: 30px;
  z-index: 99;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#main1 .el-select {
  width: 100px !important;
  margin-left:12px;
}
</style>
