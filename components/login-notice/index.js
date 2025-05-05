Component({
  properties: {},
  
  methods: {
    handleLogin() {
      wx.navigateTo({
        url: '/pages/usercenter/login-phone/index'
      });
    }
  }
}); 