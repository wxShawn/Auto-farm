<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>User infomation</span>
        <el-button type="text" @click="getUserInfo">Reload</el-button>
      </div>
    </template>

    <el-descriptions border direction="vertical" :column="5">
      <el-descriptions-item label="种子">{{ userInfo.seed }}</el-descriptions-item>
      <el-descriptions-item label="水">{{ userInfo.water }}</el-descriptions-item>
      <el-descriptions-item label="化肥">{{ userInfo.fertilizer }}</el-descriptions-item>
      <el-descriptions-item label="果实">{{ userInfo.fruit }}</el-descriptions-item>
      <el-descriptions-item label="净水器">{{ userInfo.purifier }}</el-descriptions-item>
      <el-descriptions-item label="ME">{{ userInfo.coin1 }}</el-descriptions-item>
      <el-descriptions-item label="MEC">{{ userInfo.coin3 }}</el-descriptions-item>
      <el-descriptions-item label="MEG">{{ userInfo.coin2 }}</el-descriptions-item>
      <el-descriptions-item label="剩余偷取次数">{{ userInfo.stealTimes }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>
import { Ax } from '../scripts/common.js'
import { Cation } from '../scripts/common.js'

export default {
  props: [
    'token',
  ],
  data() {
    return {
      userInfo: {
        seed: 0,
        water: 0,
        fertilizer: 0,
        fruit: 0,
        purifier: 0,
        coin1: 0,
        coin2: 0,
        coin3: 0,
        stealTimes: 0,
      }
    }
  },
  methods: {
    getUserInfo: function() {
      Ax.get('https://gas.mtvs.tv/api/app/member', this.token, res => {
        this.userInfo = res.data.data;
        console.log('user info 加载成功');
        Cation.success('user info 加载成功');
      });
    }
  },
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
</style>