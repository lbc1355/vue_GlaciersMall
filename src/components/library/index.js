// 扩展vue原有的功能： 全局组件 自定义指令 挂载原型方法，注意没有全局过滤器
// 这就是插件
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
import defaultImg from '@/assets/images/200.png'

import Message from './Message'
import Confirm from './Confirm'
const importFn = require.context('./', false, /\.vue$/)
export default {
  install (app) {
    // 在app上进项扩展，app提供 component directive
    // 如果要挂载 app.config.gloabalProperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    // 根据key批量注册
    importFn.keys().forEach(path => {
      const component = importFn(path).default
      app.component(component.name, component)
    })
    // 定义指令
    defineDirective(app)

    // 定义原型函数

    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}

// 定义指令
const defineDirective = (app) => {
  // 图片懒加载指令
  app.directive('lazyload', {
    mounted (el, binding) {
      // 创建一个观察对象 来观察当前使用指令的元素
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 停止观察
          observer.unobserve(el)
          // 如果加载失败 就 把错误图片值传递给el的src属性
          el.onerror = () => {
            el.src = defaultImg
          }
          // 如果加载成功 把 指令的值传递给el的src属性
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      // 开启观察
      observer.observe(el)
    }
  })
}
