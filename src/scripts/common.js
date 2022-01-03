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
        Cation.warn(res.data.msg);
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
        console.warn(res.data.msg);
        Cation.warn(res.data.msg);
        return;
      }
      callBack(res);
    });
  }
}

export const Cation = {
  info: function(msg) {
    ElNotification({
      message: msg,
      type: 'info',
    });
  },

  success: function(msg) {
    ElNotification({
      message: msg,
      type: 'success',
    });
  },

  warn: function(msg) {
    ElNotification({
      message: msg,
      type: 'warning',
    });
  },

  erro: function(msg) {
    ElNotification({
      message: msg,
      type: 'erro',
    });
  }
}