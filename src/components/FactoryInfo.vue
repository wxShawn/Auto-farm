<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Factory infomation</span>
        <el-button type="text" @click="getFactInfo">Reload</el-button>
      </div>
    </template>
    
    <el-table :data="factoryList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"/>
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="pickTime" label="收获时间" />
      <el-table-column fixed="right" label="操作" width="170">
        <template #default="f">
          <span v-if="f.row.land">
            <el-button type="text" @click="work(f.row.id)">播种</el-button>
            <el-button type="text" @click="water">浇水</el-button>
            <el-button type="text" @click="fertilize">施肥</el-button>
            <el-button type="text" @click="pick(f.row.id)">收获</el-button>
          </span>
          <span v-else>
            <el-button type="text" @click="work(f.row.id)">生产</el-button>
            <el-button type="text" @click="pick(f.row.id)">收获</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
// import axios from 'axios'
import { Ax } from '../scripts/common.js'
import { ElNotification } from 'element-plus'

export default {
  props: [
    'token',
  ],
  data() {
    return {
      factoryList: [],
    }
  },
  methods: {
    pick: function(id) {//收获
      Ax.post(`https://gas.mtvs.tv/api/app/record/factory/pick?memberFactoryId=${id}`, this.token, res => {
        console.log(`收获${res.data.data}`);
        ElNotification({
          message: res.data.msg,
          type: 'info',
        });
      });
    },

    work: function(id) {//生产/播种
      Ax.post(`https://gas.mtvs.tv/api/app/record/factory/work?memberFactoryId=${id}`, this.token, res => {
        console.log(res.data.msg);
        ElNotification({
          message: res.data.msg,
          type: 'info',
        });
      });
    },

    water: function() {//浇水
      console.log('浇水')
    },

    fertilize: function() {//施肥
      console.log('施肥')
    },

    getFactInfo: function() {//获取已登录岛屿信息
      Ax.get('https://gas.mtvs.tv/api/app/member/factory', this.token, res => {
        let list = res.data.data;
        let fList = [];
        for (let i = 0; i < list.length; i++) {
          let f = {};
          f.id = list[i].id;
          f.status = list[i].status;
          let d = new Date(list[i].workTime);
          f.pickTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
          switch (list[i].factoryId) {
            case 1:
              f.type = '黄土地';
              f.land = true;
              break;
            case 2:
              f.type = '红土地';
              f.land = true;
              break;
            case 3:
              f.type = '黑土地';
              f.land = true;
              break;
            case 4:
              f.type = '一级水厂';
              f.land = false;
              break;
            case 5:
              f.type = '二级水厂';
              f.land = false;
              break;
            case 6:
              f.type = '三级水厂';
              f.land = false;
              break;
            case 7:
              f.type = '一级化肥厂';
              f.land = false;
              break;
            case 8:
              f.type = '二级化肥厂';
              f.land = false;
              break;
            case 9:
              f.type = '三级化肥厂';
              f.land = false;
              break;
            default:
              break;
          }
          fList.push(f);
        }
        console.log(fList);
        this.factoryList = fList;
      })
    },
  },
}
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header > .el-button {
  padding: 0;
  min-height: 0;
}

.factory-list > div {
  font-size: 14px;
}

.factory-list > div:nth-child(odd) {
  background: #eee;
}

.factory-list > div > * {
  margin: 0 20px;
}
</style>