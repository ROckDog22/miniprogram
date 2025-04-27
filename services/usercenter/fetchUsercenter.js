import { config } from '../../config/index';
import { getAll, model } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';


const USER_MODEL_KEY = DATA_MODEL_KEY.USER;

/** 获取个人中心信息 */
function mockFetchUserCenter() {
  const { delay } = require('../_utils/delay');
  const { genUsercenter } = require('../../model/usercenter');
  return delay(200).then(() => genUsercenter());
}

/** 获取个人中心信息 */
export function fetchUserCenter({openid}) {
  if (config.useMock) {
    return mockFetchUserCenter();
  }


  new Promise((resolve) => {
    model()[USER_MODEL_KEY].list({
      filter: {
        where: {
          _openid: {
            $eq: openid,
          },
        },
      },
      getCount: true,
    }).then((res) => {
      console.log('用户数据', res);
      resolve(res);
    });
  });
  
  // const { data: data2 } = model()[USER_MODEL_KEY].create({
  //   data: {
  //     nickName: "你好，世界👋",
  //   },
  // });
  // console.log('woshifsdf data', data);


}
