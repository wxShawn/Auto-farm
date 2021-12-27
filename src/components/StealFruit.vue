<template>
  <el-card>
    <template #header>
      <div>
        <span>Steal Fruit</span>
      </div>
    </template>
    <el-row :gutter="10">
      <el-col :span="16">
        <el-select v-model="landValue" placeholder="选择土地类型">
          <el-option label="黑土地" value="黑土地"></el-option>
          <el-option label="红土地" value="红土地"></el-option>
          <el-option label="黄土地" value="黄土地"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-button @click="stealByUsersId">Start steal</el-button>
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
      landValue: '黑土地',
      logs: ['"messages" :']
    }
  },
  methods: {
    startSteal: function(id) {//根据id查询岛屿是否有果实可以偷取，id：岛屿主id
      let level = 3;//默认偷取黑土地
      switch (this.landValue) {
        case '黑土地':
          level = 3;
          break;
        case '红土地':
          level = 2;
          break;
        case '黄土地':
          level = 1;
          break;
      }
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
            for (let j = 0; j < data.length; j++) {
              if (data[j].status && data[j].status == 'pick') {
                if(data[j].factoryId == level){//设置土地等级
                  let msg = `${id}号岛屿的第${j+1}块地有${data[j].stolenNum}个果实可偷取。`
                  console.log(msg);
                  this.pushMessage(msg);
                  //偷取果实
                  this.steal(data[j].id);
                }
              } else {
                console.log('果实未成熟或无法偷取。')
              }
            }
          }
        } else {
          console.log('Island is not found!');
        }
      })
    },

    steal: function(id) {//偷取果实，id：土地id
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

    stealByUsersId: function() {//根据好友列表ID偷取
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
          for (let i = 0; i < idList.length; i++) {
            let id = idList[i].id;
            this.startSteal(id);
          }
        });
      });
    },

    pushMessage: function(msg) {
      this.logs.push(msg);
      this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight;
    }
  }
}
</script>

<style scoped>
.el-select, .el-button {
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