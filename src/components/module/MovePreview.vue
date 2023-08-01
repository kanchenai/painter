<template>
  <div class="move-container" v-if="preview">
    <focus-preview v-if="preview.type=='focus'" :detail="preview" :moving="true"></focus-preview>
  </div>
</template>
<script>
import FocusPreview from "@/components/focus/FocusPreview.vue";
import Vue from "vue";

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
    Vue.prototype.$movePreview = this;
  },

  methods: {
    selectPreview(preview) {
      this.preview = JSON.parse(JSON.stringify(preview));
    },
    mousedown(event) {
      console.log("mousedown")
      if (!this.preview) {
        return;
      }
      this.preview.style.left = event.clientX - this.preview.style.width / 2;
      this.preview.style.top = event.clientY - this.preview.style.height / 2;

      this.preview.__ob__.dep.notify();
    },
    mouseup(event) {
      console.log("mouseup");
      //TODO 添加view
      this.preview = null;
    },
    mousemove(event) {
      if (!this.preview) {
        return;
      }

      this.preview.style.left = event.clientX - this.preview.style.width / 2;
      this.preview.style.top = event.clientY - this.preview.style.height / 2;

      this.preview.__ob__.dep.notify();
    },
    mouseleave(event) {
      console.log("mouseleave");
      this.preview = null;
    }
  },

  components: {FocusPreview},
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