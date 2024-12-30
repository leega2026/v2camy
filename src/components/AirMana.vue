<template>
  <div id="main3">
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
import TabItem from '../components/ManaTableItemAir.vue'
import TabHead from '../components/ManaTableHeadAir.vue'
import axios from '../lib/axios'
import func from '../lib/func'
const caches = {selected: "", obj: {}}
const localData = {ups: [], count: 0}

export default {
  name: 'HelloWorld',
  components: {
    TabHead
  },
  data() {
    return {ups: localData.ups, caches, itemBoxId: 'TableItemBoxAir'}
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      axios.get('/api/data?type=air')
        .then(res => {
          caches.obj = res.data
        })
        .catch(e => {
          console.error('err ', e)
        })
    },
    add() {
      const dom = document.querySelector(`#${this._data.itemBoxId}`)
      var clearedData = func.addComp(dom, TabItem, 'air-item-dom', localData.count+1, this)
      localData.ups.push(clearedData)
      localData.count++
      return clearedData
    },
    save() {
      this.$prompt('保存名称', '保存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        var _d = {ups: localData.ups.slice(), count: localData.count, type: 'air'}
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
    load() {
      this.clear()
      var d = caches.selected && caches.obj[caches.selected]
      if (!d) return
      d.ups.forEach((list) => {
        var data = this.add()
        func.match(list, data)
      })
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
      localData.count = 0
    },
    reload() {
      var ups = localData.ups
      this._clear()
      ups.forEach((list) => {
        var data = this.add()
        func.match(list, data)
      })
    },
    childRemove(id) {
      localData.ups.splice(id-1, 1)
      localData.count--
      this.reload()
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main3 {
  overflow-x: scroll;
}
#TableItemBoxAir {
  width: 2050px;
  max-height:600px;
  overflow-y: scroll;
  overflow-x: hidden;
}
#TestBinTableItemBox {
  width: 2050px;
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
}
#main3 .el-select {
  width: 100px !important;
  margin-left:12px;
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
</style>
