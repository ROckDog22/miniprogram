Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      phoneNumber: '',
      avatarUrl: '/assets/images/no_login.png',
      contactName: '',
      companyName: '',
    }
  },

  onLoad(options) {
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        phoneNumber: options.code
      }
    })
  },

  onChooseAvatar(e) {
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        avatarUrl: e.detail.avatarUrl
      }
    });
  },

  onContactNameInput(e) {
    this.setData({
      'userInfo.contactName': e.detail.value
    });
  },

  onCompanyNameInput(e) {
    this.setData({
      'userInfo.companyName': e.detail.value
    });
  },

  async handleSubmit() {
    const { contactName, companyName, avatarUrl } = this.data.userInfo;
    // 验证必填字段
    if (!contactName) {
      wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none'
      });
      return;
    }

    if (avatarUrl === '/assets/images/no_login.png') {
      wx.showToast({
        title: '请上传头像',
        icon: 'none'
      });
      return;
    }

    let tempPath = avatarUrl
    let suffix = /\.[^\.]+$/.exec(tempPath)[0];

    //上传到云存储
    await wx.cloud.uploadFile({
        cloudPath: 'user-img/' + new Date().getTime() + suffix, //在云端的文件名称
        filePath: tempPath, // 临时文件路径
        success: res => {
            let fileID = res.fileID
            this.setData({
              userInfo: {
                ...this.data.userInfo,
                avatarUrl: fileID
              }
            });

            // 显示加载提示
            wx.showLoading({
              title: '提交中...',
              mask: true
            });
            

            wx.showLoading({
              title: '登录中...',
              mask: true
            });


            // 调用注册云函数或API
            wx.cloud.callFunction({
              name: 'signup',
              data: this.data.userInfo
            }).then(res => {
              console.log("res", res);
              wx.hideLoading();
              if (res.result && res.result.success) {
                // 注册成功，保存用户信息
                const userInfo = res.result.data;
                const data = {
                  userInfo: userInfo,
                  token: res.result.token
                }
                wx.setStorageSync('data', data);
                
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
        },
        fail: err => {
            wx.hideLoading()
            console.log('上传失败', res)
            wx.showToast({
                icon: 'error',
                title: '上传头像错误',
            })
        }
    })

  }
}); 