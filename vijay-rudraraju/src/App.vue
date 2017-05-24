<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import store from './vuex/store'

export default {
  store,

  name: 'app',

  data () {
    return {
    }
  },

  created () {
    console.log('App', 'created')
  }
}
</script>

<style src="bulma/css/bulma.css"></style>
<style>
</style>
