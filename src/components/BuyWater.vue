<template>
  <el-card>
    <template #header>
      <div>
        <span>Buy Water</span>
      </div>
    </template>
    <el-row :gutter="10">
      <el-col :span="16">
        <el-input-number
          v-model="num"
          :min="1"
          controls-position="right"
        />
      </el-col>
      <!-- <el-col :span="8">
        <el-input-number
          v-model="second"
          :min="3"
          :max="60"
          controls-position="right"
        />
      </el-col> -->
      <el-col :span="8">
        <el-button @click="listenWaterStore">Listen</el-button>
      </el-col>
    </el-row>

    <div class="logs" ref="logs">
      <p v-for="log in logs" :key="log">{{ log }}</p>
      <p style="margin-bottom: 12px">{{ `Total: ${logs.length - 1}` }}</p>
    </div>

    <audio ref="music" src="https://www.xzmp3.com/down/9d46373bbcfc.mp3"></audio>

    <el-dialog
      v-model="dialogVisible"
      title="水来了"
      width="300px"
    >
      <el-input v-model="gCode" type="number" placeholder="请输入验证码" />
      <template #footer>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button @click="dialogVisible = false">取消</el-button>
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
      second: 1,//请求间隔时间
      logs: ['"messages" :'],
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
            this.pushMessage(msg);
            return;
          }
          let water = res.data.data[1];
          let msg = `商店有 ${water.stock}L 水.`
          console.log(msg);
          this.pushMessage(msg);
          if (water.stock != 0) {
            this.num = (water.stock < this.num) ? water.stock : this.num;
            this.openDialog();
          }
        })
      }, this.second * 1000);
    },

    buyWater: function() {//买水
      this.closeDialog();
      axios.post(`https://gas.mtvs.tv/api/app/record/product?type=buy&productId=2&productNum=${this.num}&code=${this.gCode}`, {}, {
        headers: {
          'token': this.token,
        }
      }).then(res => {
        console.log(res);
        this.pushMessage(res.data.data.msg);
      })
    },

    openDialog: function() {//打开购买窗口
      this.$refs.music.play();
      this.dialogVisible = true;
    },

    closeDialog: function() {//关闭购买窗口
      this.$refs.music.pause();
      this.$refs.music.load();
      this.dialogVisible = false;
      clearInterval(this.timer);
    },

    pushMessage: function(msg) {
      this.logs.push(msg);
      this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight;
    },
  },
}
</script>

<style scoped>
.el-input-number, .el-button {
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