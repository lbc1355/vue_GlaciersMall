// 封装购物车相关的API函数
import request from '@/utils/request'

/**
 * 获取商品的 最新价格  库存  是否有效
 * @param {String} skuId - SKU id
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}
