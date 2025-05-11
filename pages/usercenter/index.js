import { getToPayOrderCount, getToSendOrderCount, getToReceiveOrderCount } from '../../services/order/order';
import { ORDER_STATUS } from '../../services/order/order';
import Toast from 'tdesign-miniprogram/toast/index';
import AUTH from '../../utils/getauth';
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
    // {
    //   title: '帮助中心',
    //   tit: '',
    //   url: '',
    //   type: 'help-center',
    // },
    // {
    //   title: '优惠券',
    //   tit: '',
    //   url: '',
    //   type: 'coupon',
    // },
    // {
    //   title: '积分菜单',
    //   tit: '',
    //   url: '',
    //   type: 'point',
    // },
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
    userId: '',
    currAuthStep: 1,
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
    if (AUTH.isLoggedIn()) {
        this.setData({
            userInfo: {
              ...wx.getStorageSync('userInfo'),
              currAuthStep: 2,
            }
        })
        console.log(this.data.userInfo);
        this.userinfoinit();
    }
  },
  
  userinfoinit() {
    this.fetCountHandle();
    this.initOrderCount();
  },
  
  async initOrderCount() {
    const [pay, send, receive] = await Promise.all([
      getToPayOrderCount(this.data.userInfo.userId),
      getToSendOrderCount(this.data.userInfo.userId),
      getToReceiveOrderCount(this.data.userInfo.userId),
    ]);
    this.setData({
      'orderTagInfos[0].orderNum': pay,
      'orderTagInfos[1].orderNum': send,
      'orderTagInfos[2].orderNum': receive,
    });
  },

  fetCountHandle() {
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

  userlogin() {
    wx.navigateTo({
      url: '/pages/usercenter/login-phone/index'
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
    if (userInfo.currAuthStep === 2) {
      wx.navigateTo({ url: '/pages/usercenter/person-info/index' });
    } else {
      this.fetCountHandle();
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
