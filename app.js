import updateManager from './common/updateManager';
import { init } from '@cloudbase/wx-cloud-client-sdk';

wx.cloud.init({
  env: 'cloud1-3g0k5nc5f246ac21',
});
const client = init(wx.cloud);
const models = client.models;
globalThis.dataModel = models;
App({
  onLaunch: function () {},
  onShow: function () {
    updateManager();
  },
});
