<template>
  <span>Token</span>
  <el-input style="margin-bottom: 16px" v-model="token" placeholder="Set login token" />
  <el-row :gutter="16">
    <el-col :span="8"><steal-fruit :token="token"/></el-col>
    <el-col :span="8"><buy-water :token="token"/></el-col>
  </el-row>
  
</template>

<script>
import StealFruit from './components/StealFruit.vue'
import BuyWater from './components/BuyWater.vue'

export default {
  name: 'App',
  components: {
    StealFruit,
    BuyWater,
  },
  data() {
    return {
      token: '',
    }
  }
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
</style>
