<template>
  <div v-show="visible">
    <div style="position: absolute;overflow: hidden;z-index: 1;" v-if="type!='img'" :style="style"
         @mousedown="mousedown" @mousemove="mousemove">
    </div>
    <!--    <div style="position: absolute;z-index: 1;" v-else :style="style" @dblclick="editView"-->
    <!--         @mousedown="mousedown" @mousemove="mousemove">-->
    <!--      <img style="pointer-events: none;" :src="src" :style="{width:style.width,height:style.height}">-->
    <!--    </div>-->
  </div>
</template>
<script>

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

      value.background = this.detail.style.background;
      value.borderRadius = this.detail.style.borderRadius + "px";

      if (this.isFocus) {
        value.pointerEvents = "none";
      }

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
    },
    mousemove(event) {
    }
  },
}
</script>
<style scoped>
.bg {
  position: absolute;
  pointer-events: none;
  opacity: 0.8;
  z-index: 1;
}

.size,
.position {
  position: absolute;
  font-size: 12px;
  line-height: 12px;
  padding: 0 2px;
  color: white;
  z-index: 1;
}
</style>