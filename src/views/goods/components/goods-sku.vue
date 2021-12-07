<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.name">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected }"
            @click="changeSku(item, val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            :class="{ selected: val.selected }"
            @click="changeSku(item, val)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
// 得到一个路径字典对象
import powerSert from '@/vender/power-set'
const spliter = '★'
const getPathMap = (skus) => {
  // 1 得到所有的sku集合 props.goods.skus
  // 2 从所有sku中筛选出有效的sku
  // 3 根据有效的sku使用power-set算法得到子集
  // 4 根据子集王路径字典对象中存储
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0 && sku.specs.length > 0) {
      // 计算当前有库存的sku子集
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      const valueArrPowerSert = powerSert(valueArr)
      // 遍历子集 王pathMap冲入数据
      valueArrPowerSert.forEach(arr => {
        // 根据arr得到字符串的key，约定key是['蓝色','美国']===>'蓝色-美国'
        const key = arr.join(spliter)
        // 给pathMap设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({ specs: [], skus: [] })
    }
  },
  setup (props) {
    const pathMap = getPathMap(props.goods.skus)
    console.log(pathMap)
    // 选中与取消选中 约定在每一个按钮都拥有自己的选中状态数据:selected
    //  点击的是已经选中，只需要取消当前选中
    //  点击的是为未选中，把同一个规格的改成为未选中，当前点击改成选中
    const changeSku = (item, val) => {
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
    }
    return { changeSku }
  }
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
