
// 购物车模块
export default {
  namespaced: true,
  state () {
    return {
      // 购物车列表
      list: []
    }
  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      // 约定加入购物车字段必须和后端保持一致
      // 他们是 id skuId name attrsText picture price nowPrice selected stock count isEffective
      // 插入数据规则：
      // 1 先找是否有相同的商品，
      // 2 如果有相同的商品，查询他的数量，累加到payload上，在保存最新位置 原来的商品删除
      // 3 如果没有相同的商品，保存最新位置即可
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来的
        state.list.splice(sameIndex, 1)
      }
      // 追加新的
      state.list.unshift(payload)
    }
  },
  actions: {
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        // 已登录
        if (ctx.rootState.user.profile.token) {

        }
        // 未登录
        ctx.commit('insertCart', payload)
        resolve()
      })
    }
  }
}
