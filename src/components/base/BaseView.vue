<template>
  <div>
    <div style="position: absolute;overflow: hidden;" v-if="type!='img'" :style="style" @dblclick.stop="editView"
         @mousedown.stop="mousedown" @mousemove.stop="mousemove">
    </div>
    <div style="position: absolute;" v-else :style="style" @dblclick.stop="editView"
         @mousedown.stop="mousedown" @mousemove.stop="mousemove">
      <img style="pointer-events: none;" :src="src" :style="{width:style.width,height:style.height}">
    </div>
  </div>
</template>
<script>

import utils from "@/utils/utils";

/**
 * 只用来布局
 */
export default {
  name: "BaseView",
  props: {
    data: Object
  },

  computed: {
    type() {
      let value = "div";
      if (this.data.type) {
        value = this.data.type;
      }
      return value;
    },
    left() {
      let value = 0;

      if (this.data.style && this.data.style.left) {
        value = this.data.style.left;
      }

      return value;
    },
    top() {
      let value = 0;
      if (this.data.style && this.data.style.top) {
        value = this.data.style.top;
      }
      return value;
    },
    width() {
      let value = 0;
      if (this.data.style && this.data.style.width) {
        value = this.data.style.width;
      }
      return value;
    },
    height() {
      let value = 0;
      if (this.data.style && this.data.style.height) {
        value = this.data.style.height;
      }

      return value;
    },
    style() {
      let value = {}

      value.width = this.width + 'px';
      value.height = this.height + 'px';

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

      value.background = this.data.style.background;

      return value;
    },
    src() {
      let value = "";

      if (this.data.props && this.data.props.src) {
        value = this.data.props.src;
      }

      return value;
    },
  },

  methods: {
    editView() {
      this.$dialogViewEditor.editShow(this.data.id);
    },

    mousedown(event) {
      this.downEvent = event;

      this.$painter.mousedown(event, this);
      console.log("mousedown", this.data.id)
      this.$set(this.$store.state.selectDataIdList, 0, this.data.id);
    },
    mousemove(event) {
      let downType = utils.judgeDownType(event, this);
      if (downType == "move") {
        event.target.style.cursor = "pointer";
      } else {
        if (downType.indexOf("left") >= 0 || downType.indexOf("right") >= 0) {
          event.target.style.cursor = "ew-resize";
        } else {
          event.target.style.cursor = "ns-resize";
        }
      }

      this.$painter.mousemove(event);
    }
  },
}
</script>
<style scoped>
.bg {
  position: absolute;
  border: 3px dashed gray;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  pointer-events: none;
}
</style>