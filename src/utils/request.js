// 创建一个新的axios实例

// 请求拦截器， 如果有token进行头不携带

// 相应拦截器： 1 剥离无效数据  2 处理token失效

// 导出一个函数，调用当前axios实例发请求 返回promise

import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基准地址 原因将来有些地方不是通过axios发请求的地方用上基准地址
// export const baseURL = 'http://pcapi-xiaotuxian-front.itheima.net/'
export const baseURL = 'http://localhost:9000/glaciersmall/'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(

  function (config) {
    // 拦截业务逻辑
    // 进行请求配置的修改
    // 如果本地有token就在头部携带

    // 1 获取用户信息对象
    const { profile } = store.state.user
    // 2 判断是否有token
    if (profile.token) {
      // 设置token
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  // 去除data数据，将来调用接口的时候直接拿到的就是后台的数据
  function (response) {
    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    // 401 状态码 进入该函数
    if (error.response && error.response.status === 401) {
      // 1. 清空本地无效信息
      // 2. 跳转到登录页码
      // 3. 跳转需要传参(当前路由地址) 给登录页
      // 1
      store.commit('user/setUser', {})
      // 当前路由地址
      // js模块中：router.currentRouter.value.fullPath 就是当前路由地址,router.currentRouter 是ref响应式数据
      // encodeUrlComponent 转换url编码 防止解析出问题
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(error)
  })

// 请求工具函数
export default function (url, method, submitData) {
  // 负责发送请求：请求地址 请求方式 提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求需要使用params来传递submitData

    // 2. 如果不是get请求需要使用data来传递submitData

    // [] 设置一个动态的key 写js表达式 js表达式的结果当做key
    // method参数: get GET get 转化小写 再来判断
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
