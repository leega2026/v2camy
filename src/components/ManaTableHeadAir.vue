<script setup>
var lists = [{
    name: '启用'
  }, {
    name: '序号'
  }, {
    name: '力度1'
  }, {
    name: '力度2'
  }, {
    name: '力度3'
  }, {
    name: '力度4'
  }, {
    name: '力度5'
  }, {
    name: '气泵1'
  }, {
    name: '气泵2'
  }]
var liste = [{
    name: '小腿上'
  }, {
    name: '小腿下'
  }, {
    name: '靠背上'
  }, {
    name: '靠背下'
  }, {
    name: '脚伸出'
  }, {
    name: '脚缩回'
  }, {
    name: '腿/脚出',
    label: '腿部上升/左脚部掰出'
  }, {
    name: '腿/脚回',
    label: '腿部下降/左脚部掰回'
  }, {
    name: '右伸出',
    label: '右脚部伸出'
  }, {
    name: '右缩回',
    label: '右脚部缩回'
  }, {
    name: '右掰出',
    label: '右脚部掰出'
  }, {
    name: '右掰回',
    label: '右脚部掰回'
  }, {
    name: '操作'
  }]
for (var i = 1; i <= 16; i++) {
    lists.push({name: 'V'+i})
}
lists = lists.concat(liste)
</script>

<template>
  <div id="tableHead" class="tableItem">
    <li v-for="list in lists" :key="list.name">
      <el-tooltip :content="list.label || list.name" placement="bottom" effect="light">
        <span>{{ list.name }}</span>
      </el-tooltip>
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
  width:2050px;
}
.tableItem li {
  float: left;
  width: 44px;
  list-style: none;
  font-size: 12px;
  line-height: 28px;
}
.tableItem li:first-child {
}
.tableItem li:nth-child(3) {
  width: 104px;
}
.tableItem li:nth-child(4) {
  width: 104px;
}
.tableItem li:nth-child(5) {
  width: 104px;
}
.tableItem li:nth-child(6) {
  width: 104px;
}
.tableItem li:nth-child(7) {
  width: 104px;
}
.el-divider {
  float: left;
  margin:6px 0 12px 0;
}
</style>