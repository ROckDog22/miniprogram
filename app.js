import updateManager from './common/updateManager';
import { init } from '@cloudbase/wx-cloud-client-sdk';

wx.cloud.init({
  env: 'cloud1-3g0k5nc5f246ac21',
});
const client = init(wx.cloud);
const models = client.models;
globalThis.dataModel = models;

App({
  globalData: {
    isLoggedIn: false,
    userInfo: null,
    loginObservers: []
  },

    // 添加观察者
  addLoginObserver(callback) {
    this.globalData.loginObservers.push(callback);
    return this.globalData.loginObservers.length - 1;
  },

  // 移除观察者
  removeLoginObserver(index) {
    if (index >= 0 && index < this.globalData.loginObservers.length) {
      this.globalData.loginObservers.splice(index, 1);
    }
  },

  // 通知所有观察者
  notifyLoginObservers() {
    this.globalData.loginObservers.forEach(callback => {
      callback();
    });
  },

  onLaunch: function () {},
  onShow: function () {
    updateManager();
  },
});
