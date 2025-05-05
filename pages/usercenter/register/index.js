Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/assets/images/no_login.png',
    contactName: '',
    companyName: ''
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl
    });
    
    // 可以在这里将头像上传到服务器或临时保存
    wx.setStorageSync('tempAvatarUrl', avatarUrl);
  },

  handleSubmit() {
    const { contactName, companyName, avatarUrl } = this.data;
    
    // 验证必填字段
    if (!contactName) {
      wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none'
      });
      return;
    }
    
    // 显示加载提示
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    
    // 构建用户注册数据
    const userData = {
      contactName,
      companyName,
      avatarUrl
    };
    
    // 调用注册云函数或API
    wx.cloud.callFunction({
      name: 'register',
      data: userData
    }).then(res => {
      wx.hideLoading();
      
      if (res.result && res.result.success) {
        // 注册成功，保存用户信息
        const userInfo = res.result.data;
        wx.setStorageSync('userInfo', userInfo);
        
        // 提示注册成功
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            setTimeout(() => {
              // 注册成功后跳转到首页或其他页面
              wx.switchTab({
                url: '/pages/home/home'
              });
            }, 1500);
          }
        });
      } else {
        // 注册失败
        wx.showToast({
          title: res.result.message || '注册失败，请重试',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '注册失败，请重试',
        icon: 'none'
      });
      console.error('注册失败:', err);
    });
  }
}); 