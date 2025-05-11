const AuthStepType = {
  ONE: 1,
  TWO: 2,
};

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    currAuthStep: {
      type: Number,
      value: AuthStepType.ONE,
    },
    userInfo: {
      type: Object,
      value: {},
    },
    isNeedGetUserInfo: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    defaultAvatarUrl:
      '/assets/images/no_login.png',
    AuthStepType,
  },
  methods: {
    gotoUserEditPage() {
      this.triggerEvent('gotoUserEditPage');
    },
    userlogin() {
      this.triggerEvent('userlogin');
    }
  },
});
