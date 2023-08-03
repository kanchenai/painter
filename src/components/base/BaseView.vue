<template>
  <div v-show="visible">
    <div style="position: absolute;overflow: hidden;z-index: 1;" v-if="type!='img'" :style="style" @dblclick="editView"
         @mousedown="mousedown" @mousemove="mousemove" @mouseup.stop="mouseup" >
    </div>
    <div style="position: absolute;z-index: 1;" v-else :style="style" @dblclick="editView"
         @mousedown="mousedown" @mousemove="mousemove" @mouseup.stop="mouseup" >
      <img style="pointer-events: none;" :src="src" v-if="src" :style="{width:style.width,height:style.height}">
      <div v-else :style="defaultImgBg">
        <img style="pointer-events: none;" src="../../assets/default-pic.png" :style="defaultImgStyle">
      </div>
    </div>

    <div class="bg"
         :style="{width:width+'px',height:height+'px',left:left+'px',top:top+'px',background:selected?'gray':''}"></div>
    <div class="position" :style="{left:left+2+'px',top:top+2+'px'}" v-if="selected">
      {{ 'l:' + left + ',' + 't:' + top }}
    </div>
    <div class="size" :style="{left:left+2+'px',top:top+14+'px'}" v-if="selected">
      {{ 'w:' + width + ',' + 'h:' + height }}
    </div>
  </div>
</template>
<script>

import utils from "@/utils/viewUtils";

/**
 * 只用来布局
 */
export default {
  name: "BaseView",
  props: {
    data: Object
  },

  computed: {
    visible() {
      let flag = false;
      if(!this.isFocus
          || this.$store.state.selectDataIdList.indexOf(this.fatherDataId)>=0
          || this.$store.state.selectDataIdList.indexOf(this.data.id)>=0){
        flag = true;
      }

      return flag;
    },
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

      if (!this.isFocus) {
        if (this.detail.style && this.detail.style.left) {
          value = this.detail.style.left;
        }
      } else {
        let fatherWidth = this.fatherDetail.style.width;
        value = (fatherWidth - this.width) / 2;
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
        let fatherHeight = this.fatherDetail.style.height;
        value = (fatherHeight - this.height) / 2;
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

    defaultImgBg() {
      let value = {...this.style};
      value.pointerEvents = "none";
      value.background = "gray";
      value.opacity = 0.6;

      return value;
    },

    defaultImgStyle() {
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

      if (this.detail.props && this.detail.props.src && this.detail.props.src.url) {
        value = this.detail.props.src.url;
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
      if (this.isFocus || utils.insideConnot.indexOf(this.fatherDetail.type) >= 0) {
      } else {
        this.$dialogViewEditor.editShow(this.data.id);
      }
    },

    mousedown(event) {
      if (this.isFocus || utils.insideConnot.indexOf(this.fatherDetail.type) >= 0) {

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

      if (this.isFocus || utils.insideConnot.indexOf(this.fatherDetail.type) >= 0) {

      } else {
        event.stopPropagation();
        let downType = utils.judgeDownType(event, this);
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
      this.$viewEffect.mouseup(event);
    },
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
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none;
}
</style>