<template>
  <div class="move-container" v-if="preview">
    <text-preview v-if="preview.type=='text'" :detail="preview" :moving="true"></text-preview>
    <focus-preview v-if="preview.type=='focus'" :detail="preview" :moving="true"></focus-preview>
    <group-preview v-if="preview.type=='group'" :detail="preview" :moving="true"></group-preview>
    <base-preview v-if="!preview.type||preview.type=='img'||preview.type=='div'" :detail="preview"
                  :moving="true"></base-preview>
  </div>
</template>
<script>
import FocusPreview from "@/components/focus/FocusPreview.vue";
import Vue from "vue";
import TextPreview from "@/components/text/TextPreview.vue";
import BasePreview from "@/components/base/BasePreview.vue";
import GroupPreview from "@/components/group/GroupPreview.vue";

export default {
  name: "MovePreview",
  props: {},
  data() {
    return {
      preview: null
    }
  },

  watch: {
    preview() {
      // console.log("preview", this.preview);
    }
  },

  created() {
    window.movePreview = this;
    Vue.prototype.$movePreview = this;
  },

  methods: {
    selectPreview(preview) {
      this.preview = JSON.parse(JSON.stringify(preview));
    },
    mousedown(event) {
      if (!this.preview) {
        return;
      }

      this.preview.style.left = event.clientX - this.preview.style.width / 2;
      this.preview.style.top = event.clientY - this.preview.style.height / 2;

      this.preview.__ob__.dep.notify();
    },
    mouseup(event) {
      this.preview = null;
    },
    mousemove(event) {
      if (!this.preview) {
        return;
      }
      // console.log(event.target,event.clientX,event.clientY)
      this.preview.style.left = event.clientX - this.preview.style.width / 2;
      this.preview.style.top = event.clientY - this.preview.style.height / 2;

      this.preview.__ob__.dep.notify();
    },
    mouseleave(event) {
      this.preview = null;
    }
  },

  components: {GroupPreview, BasePreview, TextPreview, FocusPreview},
}
</script>
<style scoped>
.move-container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}
</style>