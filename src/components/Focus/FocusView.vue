<template>
  <div>
    <div class="bg" :style="{width:width-2+'px',height:height-2+'px',left:style.left,top:style.top}"></div>
    <div class="default-focus" :style="{width:width+'px',height:height+'px',left:(left<3?0:left-3)+'px',top:(top<3?0:top-3)+'px'}"
         v-if="!focus" v-show="selected"></div>
    <div class="focus" :style="style" @dblclick.stop="editView"
         @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup" >
      <div v-for="(child,index) in data.children" :key="index">
        <text-view v-if="$store.getters.getDetailById(child.id).type=='text'" :data="child"></text-view>
        <base-view v-else :data="child"></base-view>
      </div>
    </div>
    <div class="position" :style="{left:left+2+'px',top:top+2+'px'}" v-if="selected">{{'l:'+left+','+'t:'+top}}</div>
    <div class="size" :style="{left:left+2+'px',top:top+14+'px'}" v-if="selected">{{'w:'+width+','+'h:'+height}}</div>
  </div>
</template>
<script>

import BaseView from "@/components/base/BaseView.vue";
import utils from "@/utils/viewUtils";
import TextView from "@/components/text/TextView.vue";

/**
 * 只用来布局
 */
export default {
  name: "FocusView",
  props: {
    data: Object
  },

  computed: {
    detail() {
      let value = null;
      if (this.data) {
        value = this.$store.getters.getDetailById(this.data.id);
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

      if (this.disLeft < 0) {//有定制焦点的一般情况
        let left = this.left + this.disLeft;
        if (left < 0) {
          value.left = -this.disLeft + 'px';
        } else {
          value.left = this.left + 'px';
        }
      } else {
        value.left = this.left + 'px';
      }

      if (this.disTop < 0) {
        let top = this.top + this.disTop;
        if (top < 0) {
          value.top = -this.disTop + 'px';
        } else {
          value.top = this.top + 'px';
        }
      } else {
        value.top = this.top + 'px';
      }

      if(this.detail.style.borderRadius){
        value.borderRadius = this.detail.style.borderRadius + "px";
      }

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
      if (this.data.children && this.data.children.length > 0) {
        for (let child of this.data.children) {
          let detail = this.$store.getters.getDetailById(child.id)
          if (detail.props && detail.props.id == "focus") {
            value = detail;
            break;
          }
        }
      }
      return value;
    },

    selected() {
      let flag = this.$store.getters.isSelected(this.data.id)
      return flag;
    },
  },

  watch: {},

  methods: {
    editView() {
      this.$dialogViewEditor.editShow(this.data.id);
    },

    mousedown(event) {
      event.stopPropagation();

      this.$viewEffect.mousedown(event, this);
      if (!this.selected) {
        this.$store.commit("selectView", {id: this.data.id});
      }
    },
    mousemove(event) {
      let preview = this.$movePreview.preview;
      if (preview) {
        return;
      }

      event.stopPropagation();
      let downType = utils.judgeDownType(event, this);
      // console.log("downType",downType)
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
    },

    mouseup(event) {
      event.stopPropagation();

      let preview = this.$movePreview.preview;
      if (!preview) {
        this.$viewEffect.mouseup(event);
        return;
      }

      this.$parent.mouseup(event);
    },
  },

  components: {TextView, BaseView}
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

.default-focus {
  position: absolute;
  border: 3px solid white;
  pointer-events: none;
  border-radius: 7px;
  z-index: 1;
}
.focus{
  position: absolute;
  overflow: hidden;
}

.size,
.position {
  position: absolute;
  font-size: 12px;
  line-height: 12px;
  padding: 0 2px;
  color: white;
  z-index: 1;
  opacity: 0.8;
  pointer-events: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none;
}
</style>