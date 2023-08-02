<template>
  <div style="position: relative;width: 100%;height: 100%;">
    <div class="line"></div>
    <div class="all-view">
      <div class="view-container" v-for="(preview,index) of previewList" :key="index">
        <div class="view-bg">
          <text-preview v-if="preview.type=='text'" :detail="preview" :moving="false"></text-preview>
          <focus-preview v-if="preview.type=='focus'" :detail="preview" :moving="false"></focus-preview>
          <group-preview v-if="preview.type=='group'" :detail="preview" :moving="false"></group-preview>
          <base-preview v-if="!preview.type||preview.type=='img'||preview.type=='div'" :detail="preview"
                        :moving="false"></base-preview>
        </div>
        <div class="info">{{ preview.label + "(" + preview.style.width + "," + preview.style.height + ")" }}</div>
      </div>

    </div>
  </div>

</template>
<script>

import viewList from "@/components/module/viewList";
import TextPreview from "@/components/text/TextPreview.vue";
import FocusPreview from "@/components/focus/FocusPreview.vue";
import BasePreview from "@/components/base/BasePreview.vue";
import GroupPreview from "@/components/group/GroupPreview.vue";

export default {
  name: "AllPreview",

  data() {
    return {
      previewList: viewList
    }
  },

  methods: {},

  components: {
    GroupPreview,
    TextPreview,
    FocusPreview,
    BasePreview
  },
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

.view-bg {
  width: 150px;
  height: 60px;
  background: #f3f3f3;
  border-radius: 12px;
}

.info {
  position: relative;
  user-select: none;
}

</style>