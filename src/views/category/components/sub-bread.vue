<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{
      category.top.name
    }}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{
        category.sub.name
      }}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>
<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
export default {
  name: 'SubBread',
  setup () {
    // 通过计算属性从vux 中获取顶级类目和二级类目
    // 数据对象: {top:{id, name}} sub: {id: name}
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      // 完成获取数据的逻辑
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id * 1 === route.params.id * 1)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })
    return {
      category
    }
  }
}
</script>
<style scoped lang="less">
// 面包屑动画
.fade-right-enter-from,
.fade-right-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.5s;
}
.fade-right-enter-to,
.fade-right-leave-from {
  transform: none;
  opacity: 1;
}
</style>
