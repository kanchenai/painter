<template>
  <div style="position: relative;width: 100%;height: 100%;">
    <div class="line"></div>
    <div class="all-view">
      <div class="view-container" v-for="(preview,index) of previewList" :key="index">
        <div class="view-bg">
          <focus-preview v-if="preview.type=='focus'" :detail="preview" :moving="false"></focus-preview>
        </div>
        <div class="info">{{preview.label + "("+preview.style.width+","+preview.style.height+")"}}</div>
      </div>

    </div>
  </div>

</template>
<script>

import viewList from "@/components/module/viewList";
import FocusPreview from "@/components/focus/FocusPreview.vue";

export default {
  name: "AllPreview",

  data() {
    return {
      previewList: viewList
    }
  },

  methods:{
  },

  components: {FocusPreview},
}
</script>
<style scoped>
.all-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.line {
  position: relative;
  float: left;
  width: 100%;
  height: 1px;
  background: black;
}

.view-container {
  position: relative;
  float: left;
  margin-left: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  width: 150px;
  //height: 120px;
}

.view-bg{
  width: 150px;
  height: 60px;
  background: #f3f3f3;
  border-radius: 12px;
}

.info{
  position: relative;
  user-select: none;
}

</style>