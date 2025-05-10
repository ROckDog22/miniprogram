import AUTH from '../../utils/getauth';
Component({
  data: {
    isLoggedIn: false
  },
  
  lifetimes: {
    attached() {
      // 初始化时检查登录状态
      this.checkLoginStatus();

      // 设置观察者
      const app = getApp();
      this.loginObserverIndex = app.addLoginObserver(() => {
        this.checkLoginStatus();
      });
    },

    detached() {
      const app = getApp();
      app.removeLoginObserver(this.loginObserverIndex); 
    }
  },
  methods: {
    checkLoginStatus() {
      this.setData({
        isLoggedIn: AUTH.isLoggedIn()
      });
    },
    handleLogin() {
      wx.navigateTo({
        url: '/pages/usercenter/login-phone/index'
      });
    }
  }
}); 