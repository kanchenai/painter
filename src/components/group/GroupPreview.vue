<template>
  <div>
    <div class="group-container" ref="group" style="position: absolute;overflow: scroll;" :style="style"
         @mousedown.stop="mousedown" @mousemove="mousemove" @mouseup="mouseup">
      <div v-for="(child,index) in detail.children" :key="index">
        <group-preview v-if="child.type=='group'" :detail="child" is-root="false"></group-preview>
        <focus-preview v-else-if="child.type=='focus'" :detail="child" is-root="false"></focus-preview>
        <text-preview v-else-if="child.type=='text'" :detail="child" is-root="false"></text-preview>
        <base-preview v-else :detail="child" is-root="false"></base-preview>
      </div>
    </div>
    <div class="bg"
         :style="bgStyle"
         v-if="detail.type=='group'"></div>
  </div>
</template>
<script>

import FocusPreview from "@/components/focus/FocusPreview.vue";
import TextPreview from "@/components/text/TextPreview.vue";
import BasePreview from "@/components/base/BasePreview.vue";
import viewUtils from "@/utils/viewUtils";

/**
 * 只用来布局
 */
export default {
  name: "GroupPreview",
  props: {
    detail: Object,
    moving: {
      type: Boolean,
      default: false
    },
    isRoot: {
      type: Boolean,
      default: true
    },
  },

  data() {
    return {
    }
  },

  computed: {
    left() {
      let value = 0;

      if (this.detail.style && this.detail.style.left) {
        value = this.detail.style.left;
      }

      return value;
    },
    top() {
      let value = 0;
      if (this.detail.style && this.detail.style.top) {
        value = this.detail.style.top;
      }
      return value;
    },
    width() {
      let value = 120;
      if (this.detail.style && this.detail.style.width) {
        value = this.detail.style.width;
      }
      return value;
    },
    height() {
      let value = 60;
      if (this.detail.style && this.detail.style.height) {
        value = this.detail.style.height;
      }

      return value;
    },
    scrollHeight() {
      let value = this.height;
      if (this.$refs.group) {
        value = this.$refs.group.scrollHeight;
      }
      return value;
    },
    scrollWidth() {
      let value = this.width;
      if (this.$refs.group) {
        value = this.$refs.group.scrollWidth;
      }
      return value;
    },
    style() {
      let value = {}

      value.width = this.width + 'px';
      value.height = this.height + 'px';

      value.background = this.detail.style.background;

      if (this.detail.type == "group") {
        value.zIndex = "1";
      }

      if (this.isRoot && !this.moving) {
        let {rate, left, top} = viewUtils.correctPreviewBy(this.width, this.height);

        value.left = left + 'px';
        value.top = top + 'px';

        value.transform = "scale(" + rate + ")";
      } else {
        let left = this.left;
        if (left < 0) {
          left = 0;
        }
        value.left = left + "px";

        let top = this.top;
        if (top < 0) {
          top = 0;
        }
        value.top = top + "px";
      }

      return value;
    },

    bgStyle() {
      let value = {...this.style}
      value.background = "gray";
      value.opacity = 0.6;
      return value;
    }
  },

  methods: {
    mousedown(event) {
      this.$movePreview.selectPreview(this.detail);
      this.$movePreview.mousedown(event);
    },

    mouseup(event) {
      this.$movePreview.mouseup(event);
    },

    mousemove(event) {
      this.$movePreview.mousemove(event);
    },
  },

  components: {
    FocusPreview,
    TextPreview,
    BasePreview
  }
}
</script>
<style scoped>
.group-container {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.bg {
  position: absolute;
  border: 1px dashed white;
  pointer-events: none;
  z-index: 1;
}

.group-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

</style>