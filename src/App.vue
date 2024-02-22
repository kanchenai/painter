<template>
  <div id="app">
    <painter></painter>
  </div>
</template>

<script>
import Painter from "@/components/Painter.vue";

export default {
  name: 'App',
  components:{
    Painter
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
}

body {
  display: block;
  margin: 0px;
}
</style>
