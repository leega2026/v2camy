<script setup>
const lists = [{
    name: '启用'
  }, {
    name: '双机芯'
  }, {
    name: '上显示/下推杆'
  }, {
    name: '行走定位方式'
  }, {
    name: '行走定位参数'
  }, {
    name: '揉捏电机工作模式'
  }, {
    name: '揉捏电机参数'
  }, {
    name: '敲打电机工作模式'
  }, {
    name: '敲打电机运行时间'
  }, {
    name: '敲打电机停止时间'
  }, {
    name: '机芯速度'
  }, {
    name: '3D电机工作模式'
  }, {
    name: '3D电机工作参数'
  }, {
    name: '循环次数/拉伸'
  }, {
    name: '操作'
  }]
</script>

<template>
  <div id="tableHead" class="tableItem">
    <li v-for="list in lists" :key="list.name">
      {{ list.name }}
    </li>
    <el-divider ></el-divider>
  </div>
</template>

<style scoped>
#tableHead {
  padding-top: 40px;
}
.tableItem {
  position: relative;
  height: 28px;
  width:1510px;
}
.tableItem li {
  float: left;
  width: 110px;
  list-style: none;
  font-size: 12px;
  line-height: 28px;
}
.tableItem li:first-child {
  width: 60px;
}
.tableItem li:nth-child(2) {
  width: 60px;
}
.tableItem li:nth-child(15) {
  width: 60px;
}
.el-divider {
  float: left;
  margin:6px 0 12px 0;
}
</style>