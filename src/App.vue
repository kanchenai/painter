<template>
  <div id="app">
    <el-container>
      <el-aside style="padding: 0;height: 100%;overflow-y: hidden" width="250px">
        <view-builder @changePage="changePage"></view-builder>
      </el-aside>
      <el-main style="padding: 0">
        <painter :pageId="currentPageId"></painter>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Painter from "./components/ViewEffect.vue"
import ViewBuilder from "@/components/ViewTree.vue";

export default {
  name: 'App',

  data() {
    return {
      currentPageId: ""
    }
  },

  created() {
  },

  methods: {
    changePage(id) {
      console.log("changePage", id)
      this.currentPageId = id;
    }
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
