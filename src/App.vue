<template>
  <div id="app">
    <el-container>
      <el-aside style="padding: 0;height: 100%;overflow-y: hidden" width="200px">
        <view-builder></view-builder>
      </el-aside>
      <el-main style="padding: 0">
        <painter></painter>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Painter from "./components/Painter.vue"
import ViewBuilder from "@/components/ViewBuilder.vue";

export default {
  name: 'App',

  data() {
    return {}
  },

  created() {
  },

  components: {
    Painter,
    ViewBuilder
  },
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
