import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCaegory = () => import('@/views/category/index')
const SubCaegory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const Cart = () => import('@/views/cart/index')
const Checkout = () => import('@/views/member/pay/checkout')

// 路由规则
const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCaegory },
      { path: '/category/sub/:id', component: SubCaegory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart },
      { path: '/member/checkout', component: Checkout }

    ]
  },
  { path: '/login', component: Login }
]
// vue2.0 new VueRouter({})
// vue3.0 createRouter({})
const router = createRouter({
  // 使用hash 的路由模式
  history: createWebHashHistory(),
  routes: routes,
  // 每次切换路由的时候滚动到页面顶部
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 需要登录的路由：地址是以 /member 开头
  const { profile } = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
