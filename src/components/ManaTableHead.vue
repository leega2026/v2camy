<script setup>
const lists = [{
    name: '启用'
  }, {
    name: '序号'
  }, {
    name: '上显示'
  }, {
    name: '上行走定位方式'
  }, {
    name: '上行走定位参数'
  }, {
    name: '上揉捏电机工作模式'
  }, {
    name: '上揉捏电机参数'
  }, {
    name: '上敲打电机工作模式'
  }, {
    name: '上敲打电机运行时间'
  }, {
    name: '上敲打电机停止时间'
  }, {
    name: '上机芯速度'
  }, {
    name: '3D电机工作模式'
  }, {
    name: '3D电机工作参数'
  }, {
    name: '机芯循环步数'
  }, {
    name: '推杆控制'
  }, {
    name: '拉伸气阀控制'
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
  width:1740px;
}
.tableItem li {
  width: 110px;
  list-style: none;
  font-size: 12px;
  line-height: 28px;
  display: inline-block;
}
.tableItem li:first-child {
  width: 60px;
}
.tableItem li:nth-child(17) {
  width: 60px;
}
.tableItem li:nth-child(2) {
  width: 60px;
}
.el-divider {
  float: left;
  margin:6px 0 12px 0;
}
</style>