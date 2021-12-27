<template>
  <el-row :gutter="16" class="login">
    <el-col :span="22">
      <el-input style="margin-bottom: 16px" v-model="address" placeholder="Set your address" />
    </el-col>
    <el-col :span="2">
      <el-button type="primary" @click="login">Login</el-button>
    </el-col>
  </el-row>
  <p class="token">{{ `current token: ${token}` }}</p>
  
  <el-row :gutter="16">
    <el-col :span="8"><steal-fruit :token="token"/></el-col>
    <el-col :span="8"><buy-water :token="token"/></el-col>
  </el-row>
  
</template>

<script>
import axios from 'axios'
import StealFruit from './components/StealFruit.vue'
import BuyWater from './components/BuyWater.vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'App',
  components: {
    StealFruit,
    BuyWater,
  },
  data() {
    return {
      address: '',
      token: '',
    }
  },
  methods: {
    login: function() {//获取token
      if (this.address.length != 42) {
        console.log('地址格式不正确');
        ElMessage({
          message: '地址格式不正确',
          type: 'error',
        });
        return;
      }
      axios.post(`https://gas.mtvs.tv/api/app/member/login?account=${this.address}&inviteCode=`)
        .then(res => {
          if (res.data.code == 200) {
            this.token = res.data.data;
            console.log('Login success.');
            ElMessage({
              message: 'Login success.',
              type: 'success',
            });
          } else {
            console.log(res.data);
            ElMessage('Login failed!');
            ElMessage({
              message: 'Login failed!',
              type: 'error',
            });
          }
        });
    }
  },
}
</script>

<style>
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 5px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #d8d8d82c;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background   : #ededed3a;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 16px;
}

.login .el-input, .login .el-button {
  width: 100%;
}

.token {
  font-size: 12px;
  color: #aaa;
}
</style>
