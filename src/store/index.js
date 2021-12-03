import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'

export default createStore({
  modules: {
    cart,
    user,
    category
  },
  // 配置插件
  plugins: [createPersistedState({
    // 本地存储的名字 默认存储在localStorage
    key: 'lioch3cooh',
    path: ['user', 'cart']
  })]
})

// export default createStore({
//   state: {
//     username: '张三'
//   },
//   getters: {
//     newName (state) {
//       return state.username + '!!!!'
//     }
//   },
//   mutations: {
//     updateName (state) {
//       state.username = '李四'
//     }
//   },
//   actions: {
//     updateName (context) {
//       console.log(context)
//       setTimeout(() => {
//         context.commit('updateName')
//       }, 1000)
//     }
//   },
//   modules: {
//   }
// })
