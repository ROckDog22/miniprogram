import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import { getToPayOrderCount, getToSendOrderCount, getToReceiveOrderCount } from '../../services/order/order';
import { ORDER_STATUS } from '../../services/order/order';
import Toast from 'tdesign-miniprogram/toast/index';

const menuData = [
  [
    {
      title: '收货地址',
      tit: '',
      url: '',
      type: 'address',
    },
  ],
];

const orderTagInfos = [
  {
    title: '待付款',
    iconName: 'wallet',
    orderNum: 0,
    tabType: ORDER_STATUS.TO_PAY,
    status: 1,
  },
  {
    title: '待发货',
    iconName: 'deliver',
    orderNum: 0,
    tabType: ORDER_STATUS.TO_SEND,
    status: 1,
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 0,
    tabType: ORDER_STATUS.TO_RECEIVE,
    status: 1,
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: ORDER_STATUS.FINISHED,
    status: 1,
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 0,
    status: 1,
  },
];

const getDefaultData = () => ({
  showMakePhone: false,
  openid: '',
  userInfo: {
    avatarUrl: '',
    nickName: '',
    phoneNumber: '',
    userInfo_tank: false,
    currAuthStep: 1,
  },
  menuData,
  orderTagInfos,
  customerServiceInfo: {},
  showKefu: true,
  versionNo: '',
  toPayOrderCount: 0,
  toSendOrderCount: 0,
  toReceiveOrderCount: 0,
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.getVersionInfo();
  },

  onShow() {
    this.init();
    this.getTabBar().init();
  },

  onPullDownRefresh() {
  },
  init(){
    var user = wx.getStorageSync('userInfo')
    if (user && user.avatarUrl) {
        this.setData({
            userInfo: user,
        })
    }
  },
  closeTank() {
    if (!this.data.userInfo.userInfo_tank) {
        this.setData({
            userInfo: {
                ...this.data.userInfo,
                userInfo_tank: true
            },
        })

    }else{
      this.setData({
        userInfo: {
            ...this.data.userInfo,
            userInfo_tank: false
        },
      })
    }
  },

  userinfoinit() {
    this.getOpenid();
    this.fetUseriInfoHandle();
    this.initOrderCount();
  },
  onChooseAvatar(e) {
    console.log(e);
    this.setData({
        avatarUrl: e.detail.avatarUrl
    })
  },
  getNickName(e) {
      console.log(e);
      this.setData({
          nickName: e.detail.value
      })
  },
  userlogin() {
    wx.showModal({
      title: '',  
      content: '您确定要使用微信登陆吗？', 
      confirmText: '确定',  
      cancelText: '取消',  
      success: (res) => {
        // 判断存储
        if (res.confirm) {
          var res = wx.cloud.callFunction({
            name: 'login',
          });
          if (res.result && res.result.records && res.result.records.length > 0){
            this.setData({ 
              userInfo: {
                ...this.data.userInfo,
                avatarUrl: res.result.records[0].avatar,
                nickName: res.result.records[0].nickName,
                phoneNumber: res.result.records[0].phoneNumber,
                gender: res.result.records[0].gender,
                currAuthStep: 3,
              } 
            });
            wx.setStorageSync('userInfo', this.data.userInfo);
          }else{
            this.setData({
              userInfo: {
                  ...this.data.userInfo,
                  userInfo_tank: true
              },
            })
          }
        } else if (res.cancel) {
          
        }
      },
      fail: (err) => {
        console.error('showModal调用失败', err);
      }
    });
  },
  submit(e) {
    if (!this.data.avatarUrl) {
        return wx.showToast({
            title: '请选择头像',
            icon: 'error'
        })
    }
    if (!this.data.nickName) {
        return wx.showToast({
            title: '请输入昵称',
            icon: 'error'
        })
    }
    this.setData({
        userInfo: {
            ...this.data.userInfo,
            userInfo_tank: false
        }
    })
    wx.showLoading({
        title: '正在注册',
        mask: 'true'
    })
    let tempPath = this.data.avatarUrl

    let suffix = /\.[^\.]+$/.exec(tempPath)[0];
    console.log(suffix);

    //上传到云存储
    wx.cloud.uploadFile({
        cloudPath: 'userimg/' + new Date().getTime() + suffix, //在云端的文件名称
        filePath: tempPath, // 临时文件路径
        success: res => {
            let fileID = res.fileID
            wx.hideLoading()
            wx.cloud.callFunction({
              name: 'signup',
              data: {
                avatarUrl: fileID,
                nickName: this.data.nickName,
              },
              success: res => {
                if (res.result.success) {
                  this.setData({ 
                    userInfo: {
                      ...this.data.userInfo,
                      avatarUrl: fileID,
                      nickName: this.data.nickName,
                      phoneNumber: "15939659170",
                    gender: 2,
                    currAuthStep: 3,
                  } 
                  });
    
                  wx.setStorageSync('userInfo', this.data.userInfo);
                }
              },
              fail: err => {
                console.log('err---', err)
              }
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
  },

  getUserdata() {
    const openid = wx.getStorageSync('openid');
    if (openid) {
      this.setData({ openid });
    } else {
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          this.setData({ openid: res.result.openid });
          wx.setStorageSync('openid', res.result.openid);
        },
        fail: err => {
          console.error('云函数失败', err);
        }
      });
    }
  },
  
  async initOrderCount() {
    const [pay, send, receive] = await Promise.all([
      getToPayOrderCount(),
      getToSendOrderCount(),
      getToReceiveOrderCount(),
    ]);
    this.setData({
      'orderTagInfos[0].orderNum': pay,
      'orderTagInfos[1].orderNum': send,
      'orderTagInfos[2].orderNum': receive,
    });
  },

  fetUseriInfoHandle() {
    fetchUserCenter(this.data.openid).then(({ userInfo, countsData, customerServiceInfo }) => {
      // eslint-disable-next-line no-unused-expressions
      menuData?.[0].forEach((v) => {
        countsData.forEach((counts) => {
          if (counts.type === v.type) {
            // eslint-disable-next-line no-param-reassign
            v.tit = counts.num;
          }
        });
      });
      this.setData({
        userInfo,
        menuData,
        customerServiceInfo,
        currAuthStep: 2,
      });
      wx.stopPullDownRefresh();
    });
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'address': {
        wx.navigateTo({ url: '/pages/usercenter/address/list/index' });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了帮助中心',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'point': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了积分菜单',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'coupon': {
        wx.navigateTo({ url: '/pages/coupon/coupon-list/index' });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const status = e.detail.tabType;

    if (status === 0) {
      wx.navigateTo({ url: '/pages/order/after-service-list/index' });
    } else {
      wx.navigateTo({ url: `/pages/order/order-list/index?status=${status}` });
    }
  },

  jumpAllOrder() {
    wx.navigateTo({ url: '/pages/order/order-list/index' });
  },

  openMakePhone() {
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    this.setData({ showMakePhone: false });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  gotoUserEditPage() {
    var userInfo  = wx.getStorageSync('userInfo');
    if (userInfo.currAuthStep === 3) {
      wx.navigateTo({ url: '/pages/usercenter/person-info/index' });
    } else {
      this.fetUseriInfoHandle();
    }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
