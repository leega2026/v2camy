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
      <el-button type="danger" @click="deleteOne" size="mini" icon="el-icon-delete">删除</el-button>
      <el-button type="danger" @click="clear" size="mini" icon="el-icon-delete">清空</el-button>
      <el-button type="primary" @click="excel" size="mini" icon="el-icon-eleme">转Excel</el-button>
    </div> 
    <TabHead />
    <div :id="itemBoxId">
      <TabItem  v-for="up in ups" :key="up.vId" :up=up />
    </div>
  </div>
</template>

<script scoped>
import TabItem from '../components/ItemUp.vue'
import TabHead from '../components/ManaTableHead.vue'
import axios from '../lib/axios'
import func from '../lib/func'
const caches = {selected: "", obj: {}, type: 'uponly'}
var vId = 0

export default {
  name: 'UpMana',
  components: {
    TabHead, TabItem
  },
  data() {
    return {ups: [], caches, itemBoxId: 'TableItemBox'}
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
      var up = {
        lists: [
          {val: 0}, {val: 0}, {val: 1}, {val: 0}, {val: 1}, {val: 0},{val: 1}, {val: 1}, 
          {val: 1}, {val: 0}, {val: 1}, {val: 0,vals: []}, {val: 0,vals: []}, {val: 0,vals: []}
        ],
        checked: true,
        listId: 0,
        vId: ++vId
      }
      this._data.ups.push(up)
      this.refreshListId()
    },
    save() {
      this.$prompt('保存名称', '保存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: caches.selected
      }).then(({ value }) => {
        var _d = {ups: this._data.ups.slice(), type: 'uponly'}
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
      var d = data || caches.selected && caches.obj[caches.selected]
      if (!d) return
      this._clear()
      d.ups.forEach((up) => {
        up.listId = 0
        up.vId = ++vId
        this._data.ups.push(up)
      })
      this.refreshListId()
    },
    excel() {
      axios.get(`/api/excel?type=uponly&name=${caches.selected}`, { responseType: 'blob' })
        .then(res => {
          const url = URL.createObjectURL(res.data)
          const a = document.createElement('a')
          a.href = url
          a.download = caches.selected + '.xlsx'
          a.click()
          URL.revokeObjectURL(url)
          this.$message({message: '转换成功！', type: 'success'})
        })
        .catch(e => {
          this.$message.error('转换失败，请稍后再试！')     
        })
    },
    deleteOne() {
      this.$confirm(`确认删除 ${caches.selected} 吗?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteOne()
      }).catch(() => {
      });
    },
    _deleteOne() {
      axios.get(`/api/data/del?type=uponly&name=${caches.selected}`)
        .then(res => {
          delete caches.obj[caches.selected]
          caches.selected = ''
          this.$message({message: '删除成功！', type: 'success'})
        })
        .catch(e => {
          this.$message.error('删除失败，请稍后再试！');     
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
      this._data.ups = [] 
    },
    childRemove(id) {
      this._data.ups.splice(id-1, 1)
      this.refreshListId()
    },
    refreshListId() {
      var c = 0
      this._data.ups.forEach((up, i) => {
        if (up.checked) {
          up.listId = ++c
        } else {
          up.listId = ''
        }
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
