Page({

  data: {
    isAgree: false,
  },

  onLoad(options) {
    // 检查是否已经登录
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo._id) {
      this.navigateBack();
    }
  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  },

  getPhoneNumber(e) {
    if (!this.data.isAgree) {
      wx.showToast({
        title: '请先阅读并同意协议',
        icon: 'none'
      });
      return;
    }

    if (!e.detail.code) {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      });
      return;
    }


    wx.showLoading({
      title: '登录中...',
      mask: true
    });

    const encryptedData = e.detail.encryptedData;
    const iv = e.detail.iv;

    wx.cloud.callFunction({
      name: 'login',
      data: {
        encryptedData: encryptedData,
        iv: iv
      }
    }).then(res => {
      console.log("login-phone", res);
      wx.hideLoading();
      
      if(res.result && !res.result.success){
        wx.navigateTo({
          url: `/pages/usercenter/register/index?code=${encodeURIComponent(e.detail.code)}`
        });
      }else{
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