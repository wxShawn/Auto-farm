<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Steal Fruit</span>
        <el-button type="text" @click="outputWorkTime">Output</el-button>
      </div>
    </template>
    <el-form
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="土地类型">
        <el-select v-model="stealLandValue" placeholder="选择土地类型">
          <el-option label="黑土地" value="3"></el-option>
          <el-option label="红土地" value="2"></el-option>
          <el-option label="黄土地" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标用户ID">
        <el-input-number v-model="stealId" :min="1" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addPlan">添加</el-button>
        <el-button @click="reloadPlan">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="stealPlanList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"/>
      <el-table-column prop="landId" label="土地ID" width="80" />
      <el-table-column prop="landType" label="类型" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="pickTime" label="收获时间" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="s">
          <el-button type="text" @click="steal(s.row)">偷取</el-button>
          <el-button type="text" @click="delPlan(s.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { Ax } from "../scripts/common.js"
import { Cation } from '../scripts/common.js'

export default {
  props: [
    'token',
  ],
  data() {
    return {
      stealId: 1,
      stealLandValue: '3',
      stealPlanList: [],//计划列表
    }
  },
  methods: {
    reloadPlan: function() {//刷新计划
      Cation.info('刷新中，请勿重复操作...')
      for (let i = 0; i < this.stealPlanList.length; i++) {
        this.getIslandByUserId(this.stealPlanList[i].id, landList => {
          for (let j = 0; j < landList.length; j++) {
            if (this.stealPlanList[i].landId == landList[j].id) {
              this.stealPlanList[i].status = landList[j].status;
            }
          }
        });
      }
    },

    addPlan: function() {//添加计划
      if (this.stealPlanList.length != 0) {
        for (let i = 0; i < this.stealPlanList.length; i++) {
          if (this.stealPlanList[i].id == this.stealId && this.stealPlanList[i].landValue == this.stealLandValue) {
            console.info('该计划已存在！');
            Cation.info('该计划已存在！');
            return false;
          }
        }
      }
      this.getIslandByUserId(this.stealId, landList => {
        let flag = false;
        for (let j = 0; j < landList.length; j++) {
          let land = landList[j];
          if (land.factoryId == this.stealLandValue) {
            this.stealPlanList.push({
              id: land.memberId,
              landId: land.id,
              landValue: land.factoryId,
              landType: land.factoryId == 1 ? '黄土地' : (land.factoryId == 2 ? '红土地' : '黑土地'),
              status: land.status,
              pickTime: `${new Date(land.workTime).getHours()}:${new Date(land.workTime).getMinutes()}:${new Date(land.workTime).getSeconds()}`
            });
            flag = true;
          }
        }
        if (flag) {
          console.log('添加成功');
          Cation.success('添加成功');
        } else {
          let msg = `该岛屿没有${this.stealLandValue == 1 ? '黄土地' : (this.stealLandValue == 2 ? '红土地' : '黑土地')}`;
          console.log(msg);
          Cation.info(msg);
        }
      });
    },

    delPlan: function(i) {//删除计划
      this.stealPlanList.splice(i, 1);
    },

    steal: function(row, status) {//开始偷取
      this.getIslandByUserId(row.id, landList => {
        for (let j = 0; j < landList.length; j++) {
          if (row.landId == landList[j].id) {
            row.status = landList[j].status;
            if (row.status == 'pick') {
              this.stealByLandId(row.landId);
            } else if (status == 'rest') {
              console.log(`土地${row.landId}闲置中`);
              Cation.info(`土地${row.landId}闲置中`);
            } else {
              console.log(`土地${row.landId}果实未成熟`);
              Cation.info(`土地${row.landId}果实未成熟`);
            }
          } 
        }
      });
    },

    outputWorkTime: function() {//打印土地worktime
      console.log('发送请求中！');
      Cation.info('发送请求中！');
      this.getUserList(userList => {
        for (let i = 0; i < userList.length; i++) {
          let id = userList[i].id;
          this.getIslandByUserId(id, landList => {
            for (let j = 0; j < landList.length; j++) {
              if (landList[j].factoryId == this.stealLandValue) {
                console.log(`${landList[j].memberId}>${new Date(landList[j].workTime)}`);
              }
            }
          });
        }
        console.log('等待服务器响应，这可能需要较长时间，请勿进行其他操作...');
        Cation.info('等待服务器响应，这可能需要较长时间，请勿进行其他操作...');
      });
    },

    getUserList: function(callBack) {//获取用户列表
      Ax.get('https://gas.mtvs.tv/api/app/member/friend?size=1&page=0', this.token, res => {
        let num = res.data.data.totalElements;
        Ax.get(`https://gas.mtvs.tv/api/app/member/friend?size=${num}&page=0`, this.token, res => {
          let idList = res.data.data.content;
          callBack(idList);
        })
      });
    },

    getIslandByUserId: function(id, callBack) {//根据用户ID获取岛屿信息
      Ax.get(`https://gas.mtvs.tv/api/app/member/factory?memberId=${id}`, this.token, res => {
        let data = res.data.data;
        if (data) {
          if (data.length == 0) {
            console.log('Island is empty');
            Cation.info('Island is empty');
          } else {
            callBack(data);
          }
        } else {
          console.log('Island is not found!');
          Cation.info('Island is not found!');
        }
      })
    },

    stealByLandId: function(id) {//根据factoryId偷取
      Ax.post(`https://gas.mtvs.tv/api/app/record/factory/steal?memberFactoryId=${id}`, this.token, res => {
        let temData = Math.floor(res.data.data * 100) / 100;
        let msg = `成功盗取了${temData}个果实`;
        console.log(msg);
        Cation.success(msg)
      })
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header > .el-button {
  padding: 0;
  min-height: 0;
}

.form > .el-col > * {
   width: 100%;
}
</style>