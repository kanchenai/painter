<template>
  <div>
    <div class="text" :style="style" @dblclick.stop="editView"
         @mousedown="mousedown" @mousemove="mousemove" @mouseup.stop="mouseup">
      {{ text }}
    </div>
    <div class="bg" :style="{width:width-2+'px',height:height-2+'px',left:style.left,top:style.top,background:selected?'gray':''}"></div>

    <div class="position" :style="{left:left+2+'px',top:top+2+'px'}" v-if="selected">
      {{ 'l:' + left + ',' + 't:' + top }}
    </div>
    <div class="size" :style="{left:left+2+'px',top:top+14+'px'}" v-if="selected">
      {{ 'w:' + width + ',' + 'h:' + height }}
    </div>
  </div>
</template>
<script>
import viewUtils from "@/utils/viewUtils";

export default {
  name: "TextView",
  props: {
    data: Object
  },
  computed: {
    fatherDataId() {
      let {fatherFork} = this.$store.getters.getDataById(this.data.id);
      return fatherFork.id
    },
    fatherDetail() {
      let value = null;
      value = this.$store.getters.getDetailById(this.fatherDataId);
      return value;
    },
    detail() {
      let value = null;
      if (this.data) {
        value = this.$store.getters.getDetailById(this.data.id);
      }
      return value;
    },
    style() {
      let value = {...this.detail.style}

      value.width = this.width + 'px';
      value.height = this.height + 'px';
      value.left = this.left + 'px';
      value.top = this.top + 'px';
      value.fontSize = this.detail.style.fontSize + "px";
      value.lineHeight = this.height + 'px';

      if (viewUtils.insideConnot.indexOf(this.fatherDetail.type) >= 0) {
        value.pointerEvents = "none";
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
    selected() {
      let flag = this.$store.getters.isSelected(this.data.id)
      return flag;
    },
  },

  methods: {
    editView() {
      if (viewUtils.insideConnot.indexOf(this.fatherDetail.type) >= 0) {

      } else {
        this.$dialogViewEditor.editShow(this.data.id);
      }
    },

    mousedown(event) {
      if (viewUtils.insideConnot.indexOf(this.fatherDetail.type) >= 0) {

      } else {
        event.stopPropagation();
        this.$viewEffect.mousedown(event, this);
        this.$store.commit("selectView", {id: this.data.id});
      }
    },
    mousemove(event) {
      let preview = this.$movePreview.preview;
      if (preview) {
        return;
      }

      if (viewUtils.insideConnot.indexOf(this.fatherDetail.type) >= 0) {

      } else {
        event.stopPropagation();
        let downType = viewUtils.judgeDownType(event, this);
        if (!downType) {
          event.target.style.cursor = "auto";
          return;
        }
        if (downType == "move") {
          event.target.style.cursor = "pointer";
        } else {
          if (downType.indexOf("left") >= 0 || downType.indexOf("right") >= 0) {
            event.target.style.cursor = "ew-resize";
          } else {
            event.target.style.cursor = "ns-resize";
          }
        }

        this.$viewEffect.mousemove(event);
      }
    },

    mouseup(event) {
      let preview = this.$movePreview.preview;
      if (preview) {
        return;
      }

      event.stopPropagation();
      this.$viewEffect.mouseup(event);
    },
  },
}
</script>
<style scoped>
.bg {
  position: absolute;
  border: 1px dashed white;
  pointer-events: none;
  opacity: 0.8;
  z-index: 1;
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
.size,
.position {
  position: absolute;
  font-size: 12px;
  line-height: 12px;
  padding: 0 2px;
  color: white;
  z-index: 1;
  pointer-events: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none;
}
</style>