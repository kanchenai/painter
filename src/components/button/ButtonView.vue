<template>
  <div style="position: absolute;z-index: 1;" :style="style" @dblclick.stop="editView"
       @mousedown.stop="mousedown" @mousemove.stop="mousemove">
    <div style="position: absolute">
      <img v-if="bg" style="position: absolute;pointer-events: none;" :src="bg.props.src"
           :width="width" :height="height">
      <div class="bg" v-else :style="{width:width-2+'px',height:height-2+'px'}"></div>
    </div>

    <div style="position: absolute" v-show="selected">
      <img v-if="focus" style="position: absolute;pointer-events: none;" :src="focus.props.src"
           :style="{left:disLeft+'px',top:disTop+'px'}" :width="focus.style.width" :height="focus.style.height">
      <div class="focus" v-else
           :style="{width:width+'px',height:height+'px',background:detail.props['focus-color']}"></div>
    </div>
    <div class="text" :style="{lineHeight: height + 'px',color:detail.props['value-color']}">{{ text }}</div>
  </div>
</template>
<script>
import utils from "@/utils/utils";

export default {
  name: "ButtonView",
  props: {
    data: Object
  },

  computed: {
    detail(){
      let value = null;
      if(this.data){
        value = this.$store.getters.getDetailById(this.data.id);
      }
      return value;
    },
    selected() {
      let flag = false;
      if (this.$store.state.selectDataIdList.indexOf(this.data.id) >= 0) {
        flag = true;
      }
      return flag;
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

    style() {
      let value = {}
      // let focusEnlarge = this.detail.props["focus-enlarge"];
      // if (focusEnlarge != 100 && focusEnlarge != 0) {
      //   value.transform = "scale(" + focusEnlarge + "%)"
      // }

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
      return value;
    },

    /**focus的校准，一般小于0*/
    disLeft() {
      let value = 0;
      if (this.focus) {
        let width = this.focus.style.width;
        value = (this.width - width) / 2;
      }

      return value;
    },

    /**focus的校准，一般小于0*/
    disTop() {
      let value = 0;
      if (this.focus) {
        let height = this.focus.style.height;
        value = (this.height - height) / 2;
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

    focus() {
      let value = null;
      if (this.detail.children && this.detail.children.length > 0) {
        for (let child of this.detail.children) {
          if (child.id == "focus") {
            value = child;
            break;
          }
        }
      }
      return value;
    },

    bg() {
      let value = null;
      if (this.data.children && this.data.children.length > 0) {
        for (let child of this.data.children) {
          if (child.id == "bg") {
            value = child;
            break;
          }
        }
      }
      return value;
    },
  },

  methods: {
    editView() {
      this.$dialogViewEditor.editShow(this.data.id);
    },

    mousedown(event) {
      this.$viewEffect.mousedown(event, this);

      this.$store.commit("selectView",{id:this.data.id});
    },
    mousemove(event) {
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
  }
}
</script>
<style scoped>
.bg {
  position: absolute;
  border: 1px solid #de2910;
  border-radius: 7px;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  pointer-events: none;
}

.focus {
  position: absolute;
  border-radius: 7px;
  pointer-events: none;
  background: #de2910;
}

.text {
  position: absolute;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  font-size: 22px;
  color: #dcdfe6;
  pointer-events: none;
  overflow: hidden;
}
</style>