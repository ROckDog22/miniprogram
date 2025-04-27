export async function checkLogin() {
  const userInfo = wx.getStorageSync('userInfo');
  return !!userInfo;
}

export async function login() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const userInfo = res.userInfo;
        // 正常这里还要调用后端，发 openid 之类
        resolve(userInfo);
      },
      fail: (err) => {
        reject('用户拒绝授权');
      }
    });
  });
}
