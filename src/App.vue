<template>
<el-row justify="center">
  <el-col :span="24" :sm="20" :md="16" :lg="24" :xl="18">
    <el-row :gutter="16" class="login">
      <el-col :span="18" :lg="21">
        <el-input style="margin-bottom: 16px" v-model="address" placeholder="Set your address" />
      </el-col>
      <el-col :span="6" :lg="3">
        <el-button type="primary" @click="login">Login</el-button>
      </el-col>
    </el-row>
    <p class="token">{{ `current token: ${token}` }}</p>
    
    <el-row :gutter="16" class="tools">
      <el-col :span="24" :lg="12"><user-info :token="token" /></el-col>
      <el-col :span="24" :lg="12"><buy-water :token="token" style="height: 282px"/></el-col>
      <el-col :span="24" :lg="12"><factory-info :token="token" style="height: 600px"/></el-col>
      <el-col :span="24" :lg="12"><steal-fruit :token="token" style="height: 600px"/></el-col>
    </el-row>
  </el-col>
</el-row>
  
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import StealFruit from './components/StealFruit.vue'
import BuyWater from './components/BuyWater.vue'
import FactoryInfo from './components/FactoryInfo.vue'
import UserInfo from './components/UserInfo.vue'

export default {
  name: 'App',
  components: {
    StealFruit,
    BuyWater,
    FactoryInfo,
    UserInfo,
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
  word-wrap: break-word;
  position: relative;
  top: -20px;
}

.tools > * {
  margin-bottom: 16px;
}

.tools > *:last-child {
  margin-bottom: 0;
}
</style>
