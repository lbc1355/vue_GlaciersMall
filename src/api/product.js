import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {String} id - 商品ID
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/**
 * 获取商品同类推荐-未传入ID为猜喜欢
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热销榜数据
 * @param {String} id - 商品ID
 * @param {Integer} limit -商品数量
 * @param {Integer} type - 热销类型 1为24小时 2为周榜 3为总榜 默认为1
 */
export const fondGoodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}

/**
 * 根据商品ID 查询评价信息
 * @param {Integer} id 商品ID
 * @returns
 */
export const findGoodsCommentInfo = (id) => {
  // return request(`/goods/${id}/evaluate`, 'get')

  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

/**
 * 查询商品评价列表
 * @param {Integer} id 商品ID
 * @param {object} params
 * @returns
 */
export const findGoodsCommentList = (id, params) => {
  // return request(`/goods/${id}/evaluate`, 'get')
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}
