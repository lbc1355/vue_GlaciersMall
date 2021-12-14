import { getNewCartGoods } from '@/api/cart'

// 购物车模块
export default {
  namespaced: true,
  state () {
    return {
      // 购物车列表
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      // 有效商品：库存大于0  stock  商品有效标识为  true  isEffective
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      // return (getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100).toFixed(2)
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
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
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods 商品信息：nowPrice stock isEffective
      // goods 商品对象的字段不固定，对象中有哪些字段就改哪些 字段，字段的值合理才改
      // goods 商品对象 必需有SKUID
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    }
  },
  actions: {
    // 全选与取消全选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录 TODO
        } else {
          // 未登录
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 修改购物车（选中状态，数量)
    updateCart (ctx, payload) {
      // payload 必须有skuId  可能：selected count
      return new Promise((resolve, reject) => {
        // 已登录
        if (ctx.rootState.user.profile.token) {

        } else {
          // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 删除购物车
    deleteCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        // 已登录
        if (ctx.rootState.user.profile.token) {

        } else {
          // 未登录
          // 单挑删除 payload 现在就是skuId
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        // 已登录
        if (ctx.rootState.user.profile.token) {

        } else {
          // 未登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 同时发送请求（有几个商品发几个请求）等所有请求成功，一并去修改本地数据。
          // Promise.all(promise数组).then((dataList)=>{})  同时发请求，所有请求成功，得到所有成功结果
          // Promise.resolve() Promise.reject() new Promise()
          // Promise.race(promise数组).then((data)=>{}) 同时发请求，最快的请求成功，得到成功结果
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })

          // dataList成功结果的集合，数据顺序和promiseArr顺序一致，它又是根据state.list而来
          Promise.all(promiseArr).then(dataList => {
            dataList.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            // 更新本地购物车
            // 调用resolve 代表操作成功
            resolve()
          })
        }
      })
    }
  }
}
