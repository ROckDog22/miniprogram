import updateManager from './common/updateManager';
import { init } from '@cloudbase/wx-cloud-client-sdk';

wx.cloud.init({
  env: 'cloud1-3g0k5nc5f246ac21', // 指定云开发环境 ID
});
// 第二个是在云开发上做了进一步封装，对数据库进行更加方便的更改
const client = init(wx.cloud);
const models = client.models;
globalThis.dataModel = models;
// 接下来就可以调用 models 上的数据模型增删改查等方法了

App({
  onLaunch: function () {},
  onShow: function () {
    updateManager();
  },
});
