<template>
  <div class="text-container" @mousedown.stop="mousedown" @mouseup.stop="mouseup" @mousemove.stop="mousemove">
    <div class="text" :style="style">{{ text }}</div>
  </div>
</template>
<script>

import viewUtils from "@/utils/viewUtils";

export default {
  name: "TextPreview",
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
  computed: {
    style() {
      let value = {...this.detail.style}

      value.width = this.width + 'px';
      value.height = this.height + 'px';
      value.background = this.detail.style.background;

      value.fontSize = this.detail.style.fontSize + "px";
      value.lineHeight = this.height + 'px';

      if (this.isRoot && !this.moving) {
        let {rate, left, top} = viewUtils.correctPreviewBy(this.width, this.height);

        value.left = left + 'px';
        value.top = top + 'px';

        value.transform = "scale(" + rate + ")";
      } else {
        value.left = this.left + 'px';
        value.top = this.top + 'px';
      }

      if (!this.isRoot) {
        value.pointerEvents = "none";
      } else {
        value.background = "gray";
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
    text() {
      let value = "";
      if (this.detail.props && this.detail.props.value) {
        value = this.detail.props.value;
      }
      return value;
    },
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
    }
  },
}
</script>
<style scoped>
.text-container {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.text {
  position: absolute;
  overflow: hidden;
  z-index: 1;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none;
}
</style>