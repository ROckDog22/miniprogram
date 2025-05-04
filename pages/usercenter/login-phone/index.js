Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 检查是否已经登录
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo._id) {
      this.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 获取手机号
  getPhoneNumber(e) {
    // 检查用户是否同意协议
    if (!this.data.isAgree) {
      wx.showToast({
        title: '请先阅读并同意协议',
        icon: 'none'
      });
      return;
    }

    // 用户拒绝授权
    if (!e.detail.code) {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      });
      return;
    }

    // 显示加载提示
    wx.showLoading({
      title: '登录中...',
      mask: true
    });

    // 调用云函数获取手机号并登录
    wx.cloud.callFunction({
      name: 'login',
      data: {
        phoneCode: e.detail.code
      }
    }).then(res => {
      wx.hideLoading();
      
      if (res.result && res.result.success) {
        // 登录成功，保存用户信息
        const userInfo = res.result.data;
        wx.setStorageSync('userInfo', userInfo);
        
        // 提示登录成功
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            setTimeout(() => {
              this.navigateBack();
            }, 1500);
          }
        });
      } else {
        // 登录失败
        wx.showToast({
          title: res.result.message || '登录失败，请重试',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
      console.error('登录失败:', err);
    });
  },

  // 切换协议同意状态
  toggleAgreement() {
    this.setData({
      isAgree: !this.data.isAgree
    });
  },

  // 显示服务协议
  showServiceAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/service/index'
    });
  },

  // 显示隐私政策
  showPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/agreement/privacy/index'
    });
  },

  // 暂不登录
  skipLogin() {
    this.navigateBack();
  },

  // 返回上一页或首页
  navigateBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({
        url: '/pages/home/home'
      });
    }
  }
})