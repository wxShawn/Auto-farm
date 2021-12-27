<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Steal Fruit</span>
        <el-button type="text" @click="outputWorkTime">Output</el-button>
      </div>
    </template>
    <el-row :gutter="10" class="form">
      <el-col :span="16">
        <el-select v-model="landValue" placeholder="选择土地类型">
          <el-option label="黑土地" value="3"></el-option>
          <el-option label="红土地" value="2"></el-option>
          <el-option label="黄土地" value="1"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-button @click="stealByUserId">Start steal</el-button>
      </el-col>
    </el-row>

    <el-row class="form" :gutter="10" style="margin-top: 10px">
      <el-col :span="16">
        <el-input-number v-model="customId" :min="1" controls-position="right"></el-input-number>
      </el-col>
      <el-col :span="8">
        <el-button @click="stealByCostomId">Steal by id</el-button>
      </el-col>
    </el-row>
    
    <div class="logs" ref="logs">
      <p v-for="log in logs" :key="log">{{ log }}</p>
      <p style="margin-bottom: 12px">{{ `Total: ${logs.length - 1}` }}</p>
    </div>
  </el-card>
</template>

<script>
import axios from "axios"

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
      this.getIslandByUserId(this.customId, landList => {
        for (let j = 0; j < landList.length; j++) {
          if (landList[j].status == 'pick') {
            if (landList[j].factoryId == this.landValue) {
              let msg = `${this.customId}号岛屿的第${j+1}块地有${landList[j].stolenNum}个果实可偷取。`;
              console.log(msg);
              this.pushMessage(msg);
              this.steal(landList[j].id);//偷取果实
            }
          } else {
            console.log('果实未成熟。')
          }
        }
      });
    },

    stealByUserId: function() {//根据好友列表ID偷取
      this.getUserList(userList => {
        for (let i = 0; i < userList.length; i++) {
          let id = userList[i].id;
          this.getIslandByUserId(id, landList => {
            for (let j = 0; j < landList.length; j++) {
              if (landList[j].status == 'pick') {
                if (landList[j].factoryId == this.landValue) {
                  let msg = `${id}号岛屿的第${j+1}块地有${landList[j].stolenNum}个果实可偷取。`;
                  console.log(msg);
                  this.pushMessage(msg);
                  this.steal(landList[j].id);//偷取果实
                }
              } else {
                console.log('果实未成熟。')
              }
            }
          });
        }
      });
    },

    outputWorkTime: function() {//打印土地worktime
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
          this.pushMessage(msg);
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
          this.pushMessage(msg);
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
            let msg = `你成功盗取了${temData}个果实`;
            console.log(msg);
            this.pushMessage(msg);
          } else {
            console.log(res.data.msg);
            this.pushMessage(res.data.msg);
          }
        });
    },

    pushMessage: function(msg) {//显示消息
      this.logs.push(msg);
      this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight;
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

.logs {
  margin-top: 10px;
  padding: 12px;
  width: 100%;
  height: 300px;
  border-radius: 5px;
  box-sizing: border-box;
  background: #ecf5ff;
  overflow-y: auto;
}

.logs > p {
  margin: 0;
  font-size: 13px;
  line-height: 21px;
  color: #888;
  font-weight: 100;
}
</style>