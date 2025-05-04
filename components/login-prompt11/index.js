Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示登录提示
    show: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 去登录页面
     */
    goToLogin() {
      wx.navigateTo({
        url: '/pages/usercenter/login/login-phone/index'
      });
    }
  }
}) 