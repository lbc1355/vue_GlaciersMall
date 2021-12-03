<template>
  <div>
    <p>{{$store.state.username}}</p>
    <hr>
    <p>{{$store.getters.newName}}</p>
    <hr>
    <p>{{$store.getters['newName']}}</p>
    <hr>
    <button @click="updata">改变姓名</button>
  </div>
</template>

<script >
import { useStore } from 'vuex'
export default {
  name: 'App',
  setup () {
    const store = useStore()
    console.log(store.state.username)

    console.log(store.getters.newName)

    function updata () {
      // store.commit('updateName')
      store.dispatch('updateName')
    }
    return {
      updata
    }
  }
}
</script>
