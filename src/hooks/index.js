// 提供服用逻辑函数
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

/**
 *数据懒加载函数
 * @param {Element} target
 * @param {Function} apiFn
 */
export const useLazyData = (target, apiFn) => {
  const result = ref([])
  // stop  停止观察
  const { stop } = useIntersectionObserver(
    // 监听的目标元素
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting 是否进入可视区
      if (isIntersecting) {
        stop()
        // 调取API函数获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 配置选项 相交的比例大于0  就触发
    {
      threshold: 0.01
    }
  )
  return result
}
