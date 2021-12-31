import axios from "axios";
import { ElNotification } from 'element-plus'

export const Ax = {
  get: function(url,token,callBack) {
    axios.get(url, {
      headers: {
        'token': token,
      }
    }).then(res => {
      if (res.data.code != 200) {
        console.warn(res.data.msg);
        ElNotification({
          message: res.data.msg,
          type: 'warning',
        });
        return;
      }
      callBack(res);
    });
  },

  post: function(url,token,callBack) {
    axios.post(url, {}, {
      headers: {
        'token': token,
      }
    }).then(res => {
      if (res.data.code != 200) {
        console.warn(res);
        ElNotification({
          message: res.data.msg,
          type: 'warning',
        });
        return;
      }
      callBack(res);
    });
  }
}