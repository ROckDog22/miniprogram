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
    {
      title: '客服服务',
      tit: '',
      url: '',
      type: 'service',
    },
    {
      title: '帮助中心',
      tit: '',
      url: '',
      type: 'help-center',
    },
    {
      title: '优惠券',
      tit: '',
      url: '',
      type: 'coupon',
    },
    {
      title: '积分菜单',
      tit: '',
      url: '',
      type: 'point',
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
    _id: '',
  },
  menuData,
  orderTagInfos,
  customerServiceInfo: {
    servicePhone: '15939659170',
    serviceTimeDuration: '每周一至周五 10:00-12:00  14:00-17:00',
  },
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
        this.userinfoinit();
    }
  },
  
  closeTank() {
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        userInfo_tank: !this.data.userInfo.userInfo_tank
      }
    })
  },

  userinfoinit() {
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
          wx.cloud.callFunction({
            name: 'login',
          }).then(res => {
            if (res.result && res.result.records && res.result.records.length > 0){
              this.setData({ 
                userInfo: {
                  ...this.data.userInfo,
                  avatarUrl: res.result.records[0].avatar,
                  nickName: res.result.records[0].nickName,
                  phoneNumber: res.result.records[0].phoneNumber,
                  gender: res.result.records[0].gender,
                  currAuthStep: 3,
                  _id: res.result.records[0]._id,
                } 
              });
              wx.setStorageSync('userInfo', this.data.userInfo);
              this.userinfoinit();
            }else{
              this.setData({
                userInfo: {
                    ...this.data.userInfo,
                    userInfo_tank: true
                },
              })
            }
          }).catch(err => {
            console.error('login error:', err);
          });
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
        userInfo_tank: !this.data.userInfo.userInfo_tank
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
                      _id: res.result.data.id,
                     } 
                  });
                  console.log('this.data.userInfo---', this.data.userInfo)
                  wx.setStorageSync('userInfo', this.data.userInfo);
                  this.userinfoinit();
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

  async initOrderCount() {
    console.log('this.data.userInfo._id---', this.data.userInfo._id)
    const [pay, send, receive] = await Promise.all([
      getToPayOrderCount(this.data.userInfo._id),
      getToSendOrderCount(this.data.userInfo._id),
      getToReceiveOrderCount(this.data.userInfo._id),
    ]);
    this.setData({
      'orderTagInfos[0].orderNum': pay,
      'orderTagInfos[1].orderNum': send,
      'orderTagInfos[2].orderNum': receive,
    });
    console.log('this.data.orderTagInfos---', this.data.orderTagInfos)
  },

  fetUseriInfoHandle() {
    const countsData = [
      {
        num: 2,
        name: '积分',
        type: 'point',
      },
      {
        num: 10,
        name: '优惠券',
        type: 'coupon',
      },
    ];

    menuData?.[0].forEach((v) => {
      countsData.forEach((counts) => {
        if (counts.type === v.type) {
          v.tit = counts.num;
        }
      });
    });
    this.setData({
      menuData,
    });
    wx.stopPullDownRefresh();
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
