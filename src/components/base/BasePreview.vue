<template>
  <div class="base-container" v-show="visible" @mousedown.stop="mousedown" @mouseup.stop="mouseup"
       @mousemove.stop="mousemove">
    <div style="position: absolute;overflow: hidden;z-index: 1;" v-if="type!='img'" :style="style">
    </div>
    <div style="position: absolute;z-index: 1;" v-else :style="style">
      <div :style="defaultImgBg">
        <img style="pointer-events: none;" :style="imgStyle" src="../../assets/default-pic.png">
      </div>
    </div>
  </div>
</template>
<script>

import viewUtils from "@/utils/viewUtils";

/**
 * 只用来布局
 */
export default {
  name: "BasePreview",
  props: {
    detail: Object,
    fatherSelected: Boolean,
    fatherWidth: Number,
    fatherHeight: Number,
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
    visible() {
      let flag = false;
      if (!this.isFocus || this.isRoot) {
        flag = true;
      } else {
        if (this.fatherSelected) {
          flag = true;
        }
      }
      return flag;
    },

    type() {
      let value = "div";
      if (this.detail.type) {
        value = this.detail.type;
      }
      return value;
    },

    isFocus() {
      let flag = false;
      if (this.detail.props && this.detail.props.id == "focus") {
        flag = true;
      }

      return flag;
    },

    left() {
      let value = 0;

      if (!this.isFocus || this.isRoot) {
        if (this.detail.style && this.detail.style.left) {
          value = this.detail.style.left;
        }
      } else {
        value = (this.fatherWidth - this.width) / 2;
      }

      return value;
    },
    top() {
      let value = 0;
      if (!this.isFocus) {
        if (this.detail.style && this.detail.style.top) {
          value = this.detail.style.top;
        }
      } else {
        value = (this.fatherHeight - this.height) / 2;
      }

      return value;
    },
    width() {
      let value = 0;
      if (this.detail.style && this.detail.style.width) {
        value = this.detail.style.width;
      }
      return value;
    },
    height() {
      let value = 0;
      if (this.detail.style && this.detail.style.height) {
        value = this.detail.style.height;
      }

      return value;
    },
    style() {
      let value = {}

      value.width = this.width + 'px';
      value.height = this.height + 'px';

      value.background = this.detail.style.background;
      if (this.detail.style.borderRadius || this.detail.style.borderRadius == 0) {
        value.borderRadius = this.detail.style.borderRadius + "px";
      }

      if (!this.isRoot) {
        value.pointerEvents = "none";
      }

      if (this.isRoot && !this.moving) {
        let {rate, left, top} = viewUtils.correctPreviewBy(this.width, this.height);

        value.left = left + 'px';
        value.top = top + 'px';

        console.log("{rate, left, top}", {rate, left, top})

        value.transform = "scale(" + rate + ")";
      } else {
        let left = this.left;
        if (!this.isFocus) {
          if (left < 0) {
            left = 0;
          }
        }

        value.left = left + "px";

        let top = this.top;
        if (!this.isFocus) {
          if (top < 0) {
            top = 0;
          }
        }

        value.top = top + "px";
      }

      return value;
    },

    defaultImgBg() {
      let value = {...this.style};

      value.background = "gray";
      value.opacity = 0.6;
      delete value.transform;

      return value;
    },

    imgStyle() {
      let value = {};

      let min = 500;
      if (this.width < this.height) {
        if (this.width < min) {
          min = this.width * 0.8;
        }
      } else {
        if (this.height < min) {
          min = this.height * 0.8;
        }
      }

      value.width = min + "px";
      value.left = (this.width - min) / 2 + "px";
      value.top = (this.height - min) / 2 + "px";

      value.position = "absolute";

      return value;

    },

    src() {
      let value = "";

      if (this.detail.props && this.detail.props.src.url) {
        value = this.detail.props.src.url;
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
.base-container {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>