// utils/auth.js
const AUTH = {
  isLoggedIn() {
    const token = wx.getStorageSync('token');
    if (!token) return false;
    
    // 可以增加token有效期检查
    const expireTime = wx.getStorageSync('expireTime');
    if (expireTime && new Date().getTime() > expireTime) {
      this.clearLoginInfo();
      return false;
    }
    
    return true;
  },
  
  setLoginInfo(data) {
    wx.setStorageSync('token', data.token);
    wx.setStorageSync('userInfo', data.userInfo);
    // 设置过期时间
    const expireTime = new Date().getTime() + 24 * 3 * 60 * 60 * 1000;
    wx.setStorageSync('expireTime', expireTime);

    
    // 更新全局状态
    const app = getApp();
    app.globalData.isLoggedIn = true;
    app.globalData.userInfo = data.userInfo;

    // 通知观察者
    app.notifyLoginObservers();
  },
  
  clearLoginInfo() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('expireTime');
    
    // 更新全局状态
    const app = getApp();
    app.globalData.isLoggedIn = false;
    app.globalData.userInfo = null;
    
    // 通知观察者
    app.notifyLoginObservers();
  }
};

export default AUTH;