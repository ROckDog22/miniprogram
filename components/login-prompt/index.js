Component({
  properties: {
    text: {
      type: String,
      value: '您还未登录'
    },
    buttonText: {
      type: String,
      value: '去登录'
    }
  },
  
  methods: {
    handleLogin() {
      wx.navigateTo({
        url: '/pages/usercenter/login-phone/index'
      });
    }
  }
}); 