<template>
  <el-card>
    <template #header>
      <div>
        <span>Buy Water</span>
      </div>
    </template>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-input-number
          v-model="num"
          :min="1"
          controls-position="right"
        />
      </el-col>
      <el-col :span="7">
        <el-button @click="stopListen">Stop</el-button>
      </el-col>
      <el-col :span="7">
        <el-button @click="listenWaterStore">Listen</el-button>
      </el-col>
    </el-row>

    <audio ref="music" src="/caocao.mp3"></audio>

    <el-dialog
      v-model="dialogVisible"
      title="水来了"
      width="300px"
    >
      <el-input v-model="gCode" type="number" placeholder="请输入验证码" @keyup.enter="buyWater" />
      <template #footer>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button @click="closeDialog">取消</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="buyWater">购买</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from 'axios'

export default {
  props: [
    'token',
  ],
  data() {
    return {
      num: 0,//水数量
      second: 3,//请求间隔时间
      timer: null,
      gCode: 0,
      dialogVisible: false,
    }
  },
  methods: {
    listenWaterStore: function() {//监听商店库存
      this.timer = setInterval(() => {
        axios.get('https://gas.mtvs.tv/api/app/info/product', {
          headers: {
            'token': this.token,
          }
        }).then(res => {
          if (res.data.code != 200) {
            let msg = 'Token已过期！';
            console.warn(msg);
            return;
          }
          let water = res.data.data[1];
          let msg = `商店有 ${water.stock}L 水.`
          console.log(msg);
          if (water.stock != 0) {
            this.num = (water.stock < this.num) ? water.stock : this.num;
            this.openDialog();
          }
        })
      }, this.second * 1000);
    },

    stopListen: function() {//停止监听
      clearInterval(this.timer);
      console.log('监听已停止');
    },

    buyWater: function() {//买水
      this.closeDialog();
      axios.post(`https://gas.mtvs.tv/api/app/record/product?type=buy&productId=2&productNum=${this.num}&code=${this.gCode}`, {}, {
        headers: {
          'token': this.token,
        }
      }).then(res => {
        console.log(res.data);
        // this.pushMessage(res.data.data.msg);
      })
    },

    openDialog: function() {//打开购买窗口
      clearInterval(this.timer);
      this.$refs.music.play();
      this.dialogVisible = true;
    },

    closeDialog: function() {//关闭购买窗口
      this.$refs.music.pause();
      this.$refs.music.load();
      this.dialogVisible = false;
    },
  },
}
</script>

<style scoped>
.el-input-number, .el-button {
  width: 100%;
}
</style>