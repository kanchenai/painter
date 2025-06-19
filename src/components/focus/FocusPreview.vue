<template>
  <div class="focus-container" @mousedown.stop="mousedown" @mouseup.stop="mouseup" @mousemove.stop="mousemove">
    <div class="default-focus" :style="focusStyle" v-if="!focus" v-show="selected"></div>
    <div class="focus" :style="style">
      <div v-for="(child,index) in detail.children" :key="index">
        <text-preview v-if="child.type=='text'" :detail="child" :is-root="false"></text-preview>
        <base-preview v-else :detail="child" :father-selected="selected" :father-height="height"
                      :father-width="width" :is-root="false"></base-preview>

      </div>
    </div>
  </div>
</template>
<script>

import viewUtils from "@/utils/viewUtils";
import BasePreview from "@/components/base/BasePreview.vue";
import TextPreview from "@/components/text/TextPreview.vue";

/**
 * 只用来布局
 */
export default {
  name: "FocusPreview",
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
      selected: false
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
    style() {
      let value = {}

      value.width = this.width + 'px';
      value.height = this.height + 'px';
      value.background = this.detail.style.background;

      if (this.isRoot && !this.moving) {
        let {rate, left, top} = viewUtils.correctPreviewBy(this.width, this.height);

        value.left = left + 'px';
        value.top = top + 'px';

        value.transform = "scale(" + rate + ")";
      } else {
        value.left = this.left + 'px';
        value.top = this.top + 'px';
      }

      if(this.detail.style.borderRadius){
        value.borderRadius = this.detail.style.borderRadius + "px";
      }

      return value;
    },

    focusStyle() {
      let value = {...this.style};
      delete value.background;

      value.left = parseInt(value.left) - 3 + "px";
      value.top = parseInt(value.top) - 3 + "px";
      return value;
    },

    /**focus的校准，一般小于0*/
    disLeft() {
      let value = 0;
      if (this.focus) {
        let width = this.focus.style.width;
        value = (this.width - width) / 2;
      } else {
        value = -3;
      }

      return value;
    },

    /**focus的校准，一般小于0*/
    disTop() {
      let value = 0;
      if (this.focus) {
        let height = this.focus.style.height;
        value = (this.height - height) / 2;
      } else {
        value = -3;
      }

      return value;
    },

    focus() {
      let value = null;
      if (this.detail.children && this.detail.children.length > 0) {
        for (let child of this.detail.children) {
          if (child.props && child.props.id == "focus") {
            value = child;
            break;
          }
        }
      }
      return value;
    },
  },

  watch: {},

  methods: {
    mousedown(event) {
      this.selected = true;
      this.$movePreview.selectPreview(this.detail);
      this.$movePreview.mousedown(event);
    },

    mouseup(event) {
      this.selected = false;
      this.$movePreview.mouseup(event);
    },

    mousemove(event) {
      this.selected = false;
      this.$movePreview.mousemove(event);
    },
  },

  components: {BasePreview,TextPreview}
}
</script>
<style scoped>
.focus-container {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.default-focus {
  position: absolute;
  border: 3px solid red;
  pointer-events: none;
  border-radius: 7px;
  z-index: 1;
}

.focus {
  position: absolute;
  overflow: hidden;
}
</style>