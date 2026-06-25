<template>
  <div id="app">
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane></el-tab-pane>
      <el-tab-pane label="单机芯配置" name="up"><UpMana ref="uponly" /></el-tab-pane>
      <el-tab-pane label="双机芯配置" name="both"><BothMana ref="both" /></el-tab-pane>
      <el-tab-pane label="气泵配置" name="air"><AirMana ref="air" /></el-tab-pane>
      <el-tab-pane label="刷机" name="update"><UpdateBin /></el-tab-pane>
      <el-tab-pane label="串口测试" name="test"><TestBin /></el-tab-pane>
      <el-tab-pane label="转源文件" name="txt"><TxtDrop /></el-tab-pane>
    </el-tabs>
    <div id="app-body"></div>
    <FileDrop v-show="showDrop" />
  </div>
</template>

<script>
import UpMana from './components/UpMana.vue'
import BothMana from './components/BothMana.vue'
import AirMana from './components/AirMana.vue'
import UpdateBin from './components/UpdateBin.vue'
import TestBin from './components/TestBin.vue'
import FileDrop from './components/FileDrop.vue'
import TxtDrop from './components/TxtDrop.vue'

export default {
  name: 'app',
  data() {
    return {
      activeName: 'up',
      showDrop: true
    };
  },
  components: {
    UpMana,
    BothMana,
    AirMana,
    UpdateBin,
    TestBin,
    FileDrop,
    TxtDrop
  },
  methods: {
    handleClick(e) {
      if (+e.index <= 3) {
        this.showDrop = true
      } else {
        this.showDrop = false
      }
    },
    dropSuc(type, data) {
      console.log(type, data)
      switch(type) {
      case 'air':
        this.$refs.air.ups = data.ups
        this.$refs.air.load(data)
        break
      case 'uponly':
        this.$refs.uponly.ups = data.ups
        break
      case 'both':
        this.$refs.both.ups = data.ups
        this.$refs.both.downs = data.downs
        this.$refs.both.sws = data.sws
        break
      }
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

#dropBox {
  width: 500px;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  text-align: center;
  line-height: 200px;
  font-size: 16px;
  color: #666;
  margin: 30px auto;
  transition: all 0.2s;
}
#dropBox.active {
  border-color: #409eff;
  background: #f0f7ff;
}
</style>
