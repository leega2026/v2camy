<template>
  <div id="app">
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane></el-tab-pane>
      <el-tab-pane label="单机芯配置" name="up"><UpMana /></el-tab-pane>
      <el-tab-pane label="双机芯配置" name="both"><BothMana /></el-tab-pane>
      <el-tab-pane label="气泵配置" name="air"><AirMana /></el-tab-pane>
      <el-tab-pane label="刷机" name="update"><UpdateBin /></el-tab-pane>
      <el-tab-pane label="串口测试" name="test"><TestBin /></el-tab-pane>
    </el-tabs>
    <div id="app-body"></div>
    
  </div>
</template>

<script>
import UpMana from './components/UpMana.vue'
import BothMana from './components/BothMana.vue'
import AirMana from './components/AirMana.vue'
import UpdateBin from './components/UpdateBin.vue'
import TestBin from './components/TestBin.vue'

export default {
  name: 'app',
  data() {
    return {
      activeName: 'up'
    };
  },
  components: {
    UpMana,
    BothMana,
    AirMana,
    UpdateBin,
    TestBin
  },
  methods: {
    handleClick(val, event) {
      console.log(val, event)
    }
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 1024px;
}

.tableItem .el-select .el-select__tags-text{
  max-width: 17px !important;
}

.tableItem .el-select .el-tag__close.el-icon-close{
  display:none !important;
}

.tableItem .el-select .el-tag{
  margin: 2px 0 2px 4px !important;
}
</style>
