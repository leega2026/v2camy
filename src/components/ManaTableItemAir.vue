<script>
  function getLists() {
    var lists = []
    for (var i = 0; i < 35; i++) {
      if (i <= 29) {
        lists.push({
          id: i,
          val: 0
        })
      } else {
        lists.push({
          id: i,
          val: 0,
          range: [0, 255]
        })
      }
    }
    return lists
  }
  
  export default {
    data() {
      return {
        lists: getLists(),
        checked: true,
        listId: 0
      };
    },
    methods: {
      remove() {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$parent.childRemove(this._data.listId)
        }).catch(() => {
        });
      }
    }
  };
</script>

<template>

  <div class="tableItem">
    <li>
      <el-switch
        v-model="checked"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </li>
    <li><span>{{listId}}</span></li>
    <li v-for="list in lists" :key="list.id">
      <el-input-number v-if="list.range" size="mini" type="number" :min=list.range[0] :max=list.range[1] v-model="list.val"> 
      </el-input-number>
    </li>
    <li v-for="list in lists" :key="list.id">
      <el-switch v-if="!list.range"
        active-value=1
        inactive-value=0
        v-model="list.val"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </li>
    <li>
    <el-button type="danger"  size="mini" @click="remove" icon="el-icon-delete" circle></el-button>
    </li>
    <el-divider ></el-divider>
  </div>
</template>

<style scoped>
.tableItem {
  position: static;
  height: 28px;
  min-width:2050px;
}
.tableItem li {
  float: left;
  width: 44px;
  list-style: none;
  font-size:14px;
  line-height:28px;
}
.tableItem li:first-child {
  clear:both;
}
.tableItem li:nth-child(33) {
  width: 104px;
}
.tableItem li:nth-child(34) {
  width: 104px;
}
.tableItem li:nth-child(35) {
  width: 104px;
}
.tableItem li:nth-child(36) {
  width: 104px;
}
.tableItem li:nth-child(37) {
  width: 104px;
}
.tableItem .el-input-number {
  width: 100px !important;
}

.tableItem .el-select {
  width: 100px !important;
}

.tableItem .el-switch {
  height: 28px !important;
}

.el-divider {
  float: left;
  margin:12px 0;
}
</style>