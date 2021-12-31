<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Steal Fruit</span>
        <el-button type="text" @click="outputWorkTime">Output</el-button>
      </div>
    </template>
    <el-row :gutter="10" class="form">
      <el-col :span="14">
        <el-select v-model="landValue" placeholder="选择土地类型">
          <el-option label="黑土地" value="3"></el-option>
          <el-option label="红土地" value="2"></el-option>
          <el-option label="黄土地" value="1"></el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-button @click="stealByUserId">Start steal</el-button>
      </el-col>
    </el-row>

    <el-row class="form" :gutter="10" style="margin-top: 10px">
      <el-col :span="14">
        <el-input-number v-model="customId" :min="1" controls-position="right"></el-input-number>
      </el-col>
      <el-col :span="10">
        <el-button @click="stealByCostomId">Steal by id</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import axios from "axios"
import { ElNotification } from 'element-plus'

export default {
  props: [
    'token',
  ],
  data() {
    return {
      landValue: '3',
      logs: ['"messages" :'],
      customId: 1,
    }
  },
  methods: {
    stealByCostomId: function() {//根据自定义ID偷取
      let tag = false;
      this.getIslandByUserId(this.customId, landList => {
        for (let j = 0; j < landList.length; j++) {
          if (landList[j].status == 'pick') {
            if (landList[j].factoryId == this.landValue) {
              let msg = `${this.customId}号岛屿的第${j+1}块地有${landList[j].stolenNum}个果实可偷取。`;
              console.log(msg);
              this.steal(landList[j].id);//偷取果实
            }
          } else {
            console.log('果实未成熟。')
          }
        }
      });
      if (!tag) {
        ElNotification({
          message: '本次未偷取到果实。',
          type: 'info',
        });
      }
    },

    stealByUserId: function() {//根据好友列表ID偷取
      ElNotification({
        message: '发送请求中，请勿重复操作...',
        type: 'warning',
      });
      let tag = false;
      this.getUserList(userList => {
        for (let i = 0; i < userList.length; i++) {
          let id = userList[i].id;
          this.getIslandByUserId(id, landList => {
            for (let j = 0; j < landList.length; j++) {
              if (landList[j].status == 'pick') {
                if (landList[j].factoryId == this.landValue) {
                  let msg = `${id}号岛屿的第${j+1}块地有${landList[j].stolenNum}个果实可偷取。`;
                  console.log(msg);
                  this.steal(landList[j].id);//偷取果实
                }
              } else {
                console.log('果实未成熟。')
              }
            }
          });
        }
        if (!tag) {
          ElNotification({
            message: '本次未偷取到果实。',
            type: 'info',
          });
        }
      });
    },

    outputWorkTime: function() {//打印土地worktime
      ElNotification({
        message: '发送请求中，请勿重复操作...',
        type: 'warning',
      });
      this.getUserList(userList => {
        for (let i = 0; i < userList.length; i++) {
          let id = userList[i].id;
          this.getIslandByUserId(id, landList => {
            for (let j = 0; j < landList.length; j++) {
              if (landList[j].factoryId == this.landValue) {
                console.log(`${landList[j].memberId}>${new Date(landList[j].workTime)}`);
              }
            }
          });
        }
        ElNotification({
          message: 'Work time 输出成功。',
          type: 'success',
        });
      });
    },

    getUserList: function(callback) {//获取用户列表
      axios.get(`https://gas.mtvs.tv/api/app/member/friend?size=1&page=0`, {
        headers: {
          'token': this.token,
        }
      }).then(res => {
        if (res.data.code != 200) {
          let msg = 'Token已过期！';
          console.warn(msg);
          return;
        }
        let num = res.data.data.totalElements;
        axios.get(`https://gas.mtvs.tv/api/app/member/friend?size=${num}&page=0`, {
          headers: {
            'token': this.token,
          }
        }).then(res => {
          let idList = res.data.data.content;
          callback(idList);
        });
      });
    },

    getIslandByUserId: function(id, callback) {//根据用户ID获取岛屿信息
      axios.get(`https://gas.mtvs.tv/api/app/member/factory?memberId=${id}`, {
        headers: {
          'token': this.token,
        }
      }).then(res => {
        if (res.data.code != 200) {
          let msg = 'Token已过期！';
          console.warn(msg);
          return;
        }
        let data = res.data.data;
        if (data) {
          if (data.length == 0) {
            console.log('Island is empty');
          } else {
            callback(data);
          }
        } else {
          console.log('Island is not found!');
        }
      });
    },

    steal: function(id) {//根据土地ID偷取果实
      axios.post(`https://gas.mtvs.tv/api/app/record/factory/steal?memberFactoryId=${id}`,{},{
          headers: {
            'token': this.token,
          }
        }).then(res => {
          if (res.data.code == 200){
            let temData = Math.floor(res.data.data * 100) / 100;
            let msg = `成功盗取了${temData}个果实`;
            console.log(msg);
            ElNotification({
              message: msg,
              type: 'success',
            });
          } else {
            console.log(res.data.msg);
          }
        });
    },
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