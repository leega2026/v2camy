<script>
 
  export default {
    data() {
      return {
        uLists: [{
          id: 0,
          selecs: [{key: 'KNEAD', val: 0}, {key: 'KNOCK', val: 1}, {key: 'PRESS', val: 2}, 
            {key: 'WAVELET', val: 3}, {key: 'PAT', val: 4}, {key: 'SHIATSU', val: 5}, 
            {key: 'SWING', val: 6}, {key: 'STRETCH', val: 7}],
          val: 0
        }, {
          id: 1,
          selecs: [{key: 'PARK', val: 0}, {key: 'ABSULATE', val: 1}, {key: 'SHOULDER', val: 2}, 
            {key: 'TOP', val: 3}, {key: 'NeckSwitch', val: 4}, {key: 'NeckMed', val: 5}, 
            {key: 'PressNeck', val: 6}, {key: 'FULL', val: 7}, {key: 'SH1PART', val: 8}, 
            {key: 'SH2PART', val: 9}, {key: 'SH3PART', val: 10}, {key: 'SH4PART', val: 11}, 
            {key: 'SH5PART', val: 12}],
          val: 0
        }, {
          id: 2,
          range: [0, 255],
          val: 1
        }, {
          id: 3,
          selecs: [
            {key: 'STOP', val: 0}, {key: 'P_MIN', val: 1}, {key: 'P_MED', val: 2}, 
            {key: 'P_WAX', val: 3}, {key: 'RN_F', val: 4}, {key: 'RN_P_OFF', val: 5}, 
            {key: 'RN_P_MIN', val: 6}, {key: 'RN_P_MED', val: 7}, 
            {key: 'RN_P_MAX', val: 8}, {key: 'R_P_MIN', val: 9}, 
            {key: 'R_P_MED', val: 10}, {key: 'R_P_WAX', val: 11}, 
            {key: 'RN_R', val: 12}, {key: 'RNR_P_OFF', val: 13}, 
            {key: 'RNR_P_MIN', val: 14}, {key: 'RNR_P_MED', val: 15}, 
            {key: 'RNR_P_WAX', val: 16}, {key: 'RN_MZ', val: 17}, 
            {key: 'RN_KM', val: 18}, {key: 'RN_KZ', val: 19}],
          val: 0
        }, {
          id: 4,
          range: [0, 7],
          val: 1
        }, {
          id: 5,
          selecs: [{key: 'STOP', val: 0}, {key: 'QD_WID', val: 1}, 
            {key: 'QD', val: 2}, {key: 'PD', val: 3}, 
            {key: 'QD_MP3', val: 4}],
          val: 0
        },{
          id: 6,
          range: [0, 31],
          val: 1
        }, {
          id: 7,
          range: [0, 31],
          val: 1
        }, {
          id: 8,
          range: [0, 7],
          val: 1
        }, {
          id: 9,
          selecs: [{key: '3D_STOP', val: 0}, {key: '3D_UP', val: 1}, 
            {key: '3D_DN', val: 2}, {key: '3D_DNUP', val: 3}],
          val: 0
        }, {
          id: 10,
          range: [0, 64],
          val: 1
        }, {
          id: 11,
          switch: true,
          selecs: [{key: '循环步数+1', val: 1}, {key: '循环步数+2', val: 2}, 
            {key: '循环步数+4', val: 4}, {key: '循环步数+8', val: 8},
            {key: 'BLWUPR', val: 16}, {key: 'BLWDWR', val: 32},
            {key: 'BFWUPR', val: 64}, {key: 'BFWDWR', val: 128}],
          range: [0, 255],
          val: 0,
          vals: []
        }],
        dLists: [{
          id: 20,
          selecs: [{key: 'BLUP', val: 1}, {key: 'BLDW', val: 2}, {key: 'BLBUP', val: 4}, 
            {key: 'BLBDW', val: 8}, {key: 'BLWUP', val: 16}, {key: 'BLWDW', val: 32},
            {key: 'BFWUP', val: 64}, {key: 'BFWDW', val: 128}],
          mutil: true,
          val: 0,
          vals: []
        }, {
          id: 21,
          selecs: [{key: 'PARK', val: 0}, {key: 'ABSULATE', val: 1}, 
            {key: 'TOP', val: 2}, {key: 'TOP_FW', val: 3}, {key: 'LOW_FW', val: 4}, 
            {key: '1PART', val: 5}, {key: '2PART', val: 6}, {key: '3PART', val: 7}, 
            {key: '4PART', val: 8}, {key: '5PART', val: 9}, {key: 'FULL', val: 10}],
          val: 0
        }, {
          id: 22,
          range: [0, 255],
          val: 1
        }, {
          id: 23,
          selecs: [{key: 'STOP', val: 0}, {key: 'P_MIN', val: 1}, {key: 'P_MED', val: 2}, 
            {key: 'P_WAX', val: 3}, {key: 'RN_F', val: 4}, {key: 'RN_P_OFF', val: 5}, 
            {key: 'RN_P_MIN', val: 6}, {key: 'RN_P_MED', val: 7}, 
            {key: 'RN_P_MAX', val: 8}, {key: 'R_P_MIN', val: 9}, 
            {key: 'R_P_MED', val: 10}, {key: 'R_P_WAX', val: 11}, 
            {key: 'RN_R', val: 12}, {key: 'RNR_P_OFF', val: 13}, 
            {key: 'RNR_P_MIN', val: 14}, {key: 'RNR_P_MED', val: 15}, 
            {key: 'RNR_P_WAX', val: 16}, {key: 'RN_MZ', val: 17}, 
            {key: 'RN_KM', val: 18}, {key: 'RN_KZ', val: 19}],
          val: 0
        }, {
          id: 24,
          range: [0, 7],
          val: 1
        }, {
          id: 25,
          selecs: [{key: 'STOP', val: 0}, {key: 'QD_WID', val: 1}, 
            {key: 'QD', val: 2}, {key: 'PD', val: 3}, 
            {key: 'QD_MP3', val: 4}],
          val: 0
        },{
          id: 26,
          range: [0, 31],
          val: 1
        }, {
          id: 27,
          range: [0, 31],
          val: 1
        }, {
          id: 28,
          range: [0, 7],
          val: 1
        }, {
          id: 29,
          selecs: [{key: '3D_STOP', val: 0}, {key: '3D_UP', val: 1}, 
            {key: '3D_DN', val: 2}, {key: '3D_DNUP', val: 3}],
          val: 0
        }, {
          id: 30,
          range: [0, 64],
          val: 1
        }, {
          id: 31,
          switch: true,
          selecs: [{key: 'V1', val: 1}, {key: 'V2', val: 2}, 
            {key: 'V3', val: 4}, {key: 'V4', val: 8},
            {key: 'V5', val: 16}, {key: 'V6', val: 32},
            {key: 'V7', val: 64}, {key: 'V8', val: 128}],
          range: [0, 255],
          val: 0
        }],
        doSwitch: false
      };
    },
    props: ['up', 'down'],
    mounted() {
    	this.refresh()
  	},
    methods: {
      handleChange(list, i) {
        if (i == 0) {
          var doSwitch = list.val == 7
          if (doSwitch != this._data.doSwitch) {
            this.up.lists[11].val = 0
            this._data.uLists[11].vals = []
            this.down.lists[11].val = 0
            this._data.dLists[11].vals = []
          }
          this._data.doSwitch = doSwitch
        }
      },
      handleMultiChange(item, i) {
        item.val = this._data.uLists[i].vals.reduce((acc, val) => acc + val, 0)
      },
      handleMultiChangeDown(item, i) {
        item.val = this._data.dLists[i].vals.reduce((acc, val) => acc + val, 0)
      },
      handleChecked() {
      	this.$parent.refreshListId()
      },
      remove() {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$parent.childRemove(this.up.listId)
        }).catch(() => {
        });
      },
      refresh() {
		this.doSwitch = this.up.lists[0].val == 7
		this._data.uLists[11].vals = val2binaryArr(this.up.lists[11].val)
		this._data.dLists[11].vals = val2binaryArr(this.down.lists[11].val)
		this._data.dLists[0].vals = val2binaryArr(this.down.lists[0].val)
	  }
    }
  };

function val2binaryArr(val) {
  var bArr = val.toString(2).split('')
  var len = bArr.length
  var res = []
  bArr.forEach((b, i) => {
    if (+b == 1) res.push(2**(len-1-i))
  })
  return res
}
</script>

<template>
  <div>
  <div class="tableItem">
    <li>
      <span>{{up.listId}}</span>
    </li>
    <li><span>上机芯</span></li>
    <li v-for="(list, i) in up.lists" :key="uLists[i].id">
      <el-input-number v-if="!uLists[i].switch && uLists[i].range" size="mini" type="number" :min=uLists[i].range[0] :max=uLists[i].range[1] v-model="list.val"> 
      </el-input-number>
      <el-select v-if="!uLists[i].switch && uLists[i].selecs" size="mini" @change="handleChange(list, i)" v-model="list.val" placeholder="请选择">
        <el-option
          v-for="item in uLists[i].selecs"
          :key="item.val"
          :label="item.key"
          :value="item.val">
        </el-option>
      </el-select>
      <el-input-number v-show="!doSwitch" v-if="uLists[i].switch" size="mini" type="number" :min=uLists[i].range[0] :max=uLists[i].range[1] v-model="list.val"> 
      </el-input-number>
      <el-select v-show="doSwitch" v-if="uLists[i].switch" @change="handleMultiChange(list, i)" size="mini" v-model="uLists[i].vals" multiple collapse-tags placeholder="请选择">
        <el-option
          v-for="item in uLists[i].selecs"
          :key="item.val"
          :label="item.key"
          :value="item.val">
        </el-option>
      </el-select>
    </li>
    <li>
    <el-button type="danger"  size="mini" @click="remove" icon="el-icon-delete" circle></el-button>
    </li>
  </div>
  <div class="tableItem">
    <li>
      <el-switch
        v-model="up.checked"
        active-color="#13ce66"
        inactive-color="#ff4949" @change="handleChecked">
      </el-switch>
    </li>
    <li><span>下机芯</span></li>
    <li v-for="(list, i) in down.lists" :key="dLists[i].id">
      <el-input-number v-if="!dLists[i].switch && !dLists[i].mutil && dLists[i].range" size="mini" type="number" :min=dLists[i].range[0] :max=dLists[i].range[1] v-model="list.val"> 
      </el-input-number>
      <el-select v-if="!dLists[i].switch && !dLists[i].mutil && dLists[i].selecs" size="mini" v-model="list.val" placeholder="请选择">
        <el-option
          v-for="item in dLists[i].selecs"
          :key="item.val"
          :label="item.key"
          :value="item.val">
        </el-option>
      </el-select>
      <el-input-number v-show="!doSwitch" v-if="dLists[i].switch" size="mini" type="number" :min=dLists[i].range[0] :max=dLists[i].range[1] v-model="list.val"> 
      </el-input-number>
      <el-select v-show="doSwitch" v-if="dLists[i].switch" @change="handleMultiChangeDown(list, i)" size="mini" v-model="dLists[i].vals" multiple collapse-tags placeholder="请选择">
        <el-option
          v-for="item in dLists[i].selecs"
          :key="item.val"
          :label="item.key"
          :value="item.val">
        </el-option>
      </el-select>
      <el-select v-if="dLists[i].mutil" @change="handleMultiChangeDown(list, i)" size="mini" v-model="dLists[i].vals" multiple collapse-tags placeholder="请选择">
        <el-option
          v-for="item in dLists[i].selecs"
          :key="item.val"
          :label="item.key"
          :value="item.val">
        </el-option>
      </el-select>
    </li>
    <li>
      <div style="width:30px;height:20px"></div>
    </li>
    <el-divider></el-divider>
  </div>
  </div>
</template>

<style scoped>
.tableItem {
  min-width:1510px;
}
.tableItem li {
  width: 110px;
  list-style: none;
  display: inline-block;
}
.tableItem li:first-child {
  width: 60px;
  clear:both;
}
.tableItem li:nth-child(2) {
  width: 60px;
}
.tableItem li:nth-child(15) {
  width: 60px;
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

/deep/ .tableItem .el-select .el-select__tags-text{
  max-width: 17px !important;
}

/deep/ .tableItem .el-select .el-tag__close.el-icon-close{
  display:none !important;
}

/deep/ .tableItem .el-select .el-tag{
  margin: 2px 0 2px 4px !important;
}

.el-divider {
  float: left;
  margin:12px 0;
}

</style>