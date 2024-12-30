<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main2 {
  overflow-x: scroll;
}
#TableItemBoxBoth {
  width: 1450px;
  font-size: 12px;
  line-height: 28px;
  max-height:600px;
  overflow-y: scroll;
  overflow-x: hidden;
}
#TestBinTableItemBox {
  width: 1450px;
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
#main2 .el-select {
  width: 100px !important;
  margin-left:12px;
}
</style>

<template>
  <div id="main2">
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
import TabItemBoth from '../components/ManaTableItemBoth.vue'
import TabHead from '../components/ManaTableHeadBoth.vue'
import axios from '../lib/axios'
import func from '../lib/func'
const caches = {selected: "", obj: {}}
const localData = {ups: [], downs: [], count: 0}


export default {
  name: 'ManaBoth',
  components: {
    TabHead
  },
  data() {
    return {ups: localData.ups, caches, itemBoxId: 'TableItemBoxBoth'}
  },
  created() {
    this.fetchData()
  },
  mounted() {
    console.log('mounted', new Date())
  },
  methods: {
    fetchData() {
      axios.get('/api/data?type=both')
        .then(res => {
          caches.obj = res.data
        })
        .catch(e => {
          console.error('err ', e)
        })
    },
    add() {
      const dom = document.querySelector(`#${this._data.itemBoxId}`)
      var clearedData = func.addComp(dom, TabItemBoth, 'both-item-dom')
      var clearedDataUp = {lists: clearedData.uLists, checked: true}
      var clearedDataDown = {lists: clearedData.dLists, checked: true}
      localData.ups.push(clearedDataUp)
      localData.downs.push(clearedDataDown)
      localData.count++
      return {clearedDataUp, clearedDataDown, clearedData}
    },
    save() {
      this.$prompt('保存名称', '保存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        var _d = {ups: localData.ups.slice(), downs: localData.downs.slice(), count: localData.count, type: 'both'}
        axios.post('/api/data', {
          key: value,
          data: func.clearData(_d)
        }).then(()=> {
          caches.obj[value] = _d
          caches.selected = value
          this.$message({message: '保存成功！', type: 'success'})
        }).catch(e => {
          this.$message.error('保存失败，请稍后再试！');
        })
      }).catch((e) => {
        this.$message.error('保存失败，请稍后再试！');     
      });
    },
    load(data) {
      this.clear()
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
        func.addCompMutil(dom, TabItemBoth, d.ups.length, (vd, i) => {
          func.match(d.ups[i], {lists: vd.uLists, checked: true})
          func.match(d.downs[i], {lists: vd.dLists, checked: true})
          vd.refresh()
        })
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
      document.querySelector(`#${this._data.itemBoxId}`).innerHTML = ''
      localData.ups = [] 
      localData.downs = [] 
      localData.count = 0
    },
    childRemove(id) {
      localData.ups.splice(id-1, 1)
      localData.downs.splice(id-1, 1)
      localData.count--
      this.load(localData)
    }
  }
}

</script>
