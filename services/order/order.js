import { model, getAll } from '../../services/_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { ORDER, createId, DELIVERY_INFO } from '../cloudbaseMock/index';

const ORDER_MODEL_KEY = DATA_MODEL_KEY.ORDER;

const ORDER_STATUS_INFO = {
  TO_PAY: { value: 'TO_PAY', label: '待付款' },
  TO_SEND: { value: 'TO_SEND', label: '待发货' },
  TO_RECEIVE: { value: 'TO_RECEIVE', label: '待收货' },
  FINISHED: { value: 'FINISHED', label: '已完成' },
  CANCELED: { value: 'CANCELED', label: '已取消' },
  RETURN_APPLIED: { value: 'RETURN_APPLIED', label: '申请退货' },
  RETURN_REFUSED: { value: 'RETURN_REFUSED', label: '拒绝退货申请' },
  RETURN_FINISH: { value: 'RETURN_FINISH', label: '退货完成' },
  RETURN_MONEY_REFUSED: { value: 'RETURN_MONEY_REFUSED', label: '拒绝退款' },
};

export const ORDER_STATUS = new Proxy(ORDER_STATUS_INFO, {
  get(target, prop) {
    return target[prop]?.value;
  },
});

export const orderStatusToName = (status) => Object.values(ORDER_STATUS_INFO).find((x) => x.value === status)?.label;

/**
 *
 * @param {{
 *   status: String,
 *   addressId: String
 * }} param0
 * @returns
 */
export async function createOrder({ status, addressId, userId }) {
  return (
    await model()[ORDER_MODEL_KEY].create({
      data: {
        status,
        delivery_info: {
          _id: addressId,
        },
        user: {
          _id: userId,
        },
      },
    })
  ).data;
}

export function getAllOrder() {
  return getAll({
    name: ORDER_MODEL_KEY,
  });
}

/**
 *
 * @param {{
 *   pageSize: Number,
 *   pageNumber: Number,
 *   status?: String
 * }}} param0
 * @returns
 */
export async function listOrder({ pageSize, pageNumber, status, userId }) {
    return (
      await model()[ORDER_MODEL_KEY].list({
        filter: {
          where: {
            status: {
              $eq: status,
            },
            user: {
              $eq: userId,
            },
          },
        },
        pageSize,
        pageNumber,
        getCount: true,
      })
    ).data;
}

async function getOrderCountOfStatus(status, userId) {
  if (cloudbaseTemplateConfig.useMock) {
    return ORDER.filter((x) => x.status === status).length;
  }

  return (
    await model()[ORDER_MODEL_KEY].list({
      filter: { where: { status: { $eq: status }, user: { $eq: userId }}},
      select: { _id: true },
      getCount: true,
    })
  ).data.total;
}

export async function getToPayOrderCount(userId) {
  return getOrderCountOfStatus(ORDER_STATUS.TO_PAY, userId);
}

export async function getToSendOrderCount(userId) {
  return getOrderCountOfStatus(ORDER_STATUS.TO_SEND, userId);
}

export async function getToReceiveOrderCount(userId) {
  return getOrderCountOfStatus(ORDER_STATUS.TO_RECEIVE, userId);
}

/**
 *
 * @param {String} orderId
 */
export async function getOrder(orderId) {
  return (
    await model()[ORDER_MODEL_KEY].get({
      filter: {
        where: {
          _id: { $eq: orderId },
        },
      },
      select: {
        $master: true,
        delivery_info: {
          _id: true,
          phone: true,
          address: true,
          name: true,
        },
      },
    })
  ).data;
}

export async function updateOrderDeliveryInfo({ orderId, deliveryInfoId }) {
  return model()[ORDER_MODEL_KEY].update({
    data: {
      delivery_info: {
        _id: deliveryInfoId,
      },
    },
    filter: {
      where: {
        _id: {
          $eq: orderId,
        },
      },
    },
  });
}

/**
 *
 * @param {{orderId: String, status: String}}} param0
 * @returns
 */
export async function updateOrderStatus({ orderId, status }) {
  return await model()[ORDER_MODEL_KEY].update({
    data: {
      status,
    },
    filter: {
      where: {
        _id: {
          $eq: orderId,
        },
      },
    },
  });
}
