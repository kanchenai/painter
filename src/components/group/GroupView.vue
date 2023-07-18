<template>
  <div>
    <div class="group" style="position: absolute;overflow: scroll;" :style="style" @dblclick.stop="editView"
         @mousedown.stop="mousedown" @mousemove.stop="mousemove">
      <div v-for="(child,index) in data.children" :key="index">
        <button-view v-if="child.type=='button'" :data="child"></button-view>
        <text-view v-else-if="child.type=='text'" :data="child"></text-view>
        <group-view v-else-if="child.type=='group'" :data="child"></group-view>
        <base-view v-else :data="child"></base-view>
      </div>
    </div>
    <div class="bg" :style="{width:width-2+'px',height:height-2+'px',left:left+'px',top:top+'px',background:selected?'gray':''}"></div>
    <div style="position: absolute;overflow: hidden;pointer-events: none;" :style="style" v-show="showReferLine">
      <div class="v-line" v-for="(left,index) of referLine.vLineList" :key="'v'+index" :style="{left:left+'px'}"></div>
      <div class="h-line" v-for="(top,index) of referLine.hLineList" :key="'h'+index" :style="{top:top+'px'}"></div>
    </div>

  </div>
</template>
<script>

import ButtonView from "@/components/button/ButtonView.vue";
import TextView from "@/components/TextView.vue";
import BaseView from "@/components/base/BaseView.vue";
import utils from "@/utils/utils";

/**
 * 只用来布局
 */
export default {
  name: "GroupView",
  props: {
    data: Object
  },

  data() {
    return {
      showReferLine: false
    }
  },

  computed: {
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
      let value = 120;
      if (this.data.style && this.data.style.width) {
        value = this.data.style.width;
      }
      return value;
    },
    height() {
      let value = 60;
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

    referLine() {
      let value = {vLineList: [], hLineList: []};

      if (this.data.children && this.data.children.length > 0) {
        this.data.children.forEach(child => {
          if(this.$store.state.selectDataIdList.indexOf(child.id) >= 0){
            return;
          }
          let left = child.style.left;
          let right = child.style.left+child.style.width;

          let top = child.style.top;
          let bottom = child.style.top + child.style.height;

          value.vLineList.push(left);
          value.vLineList.push(right);
          value.hLineList.push(top);
          value.hLineList.push(bottom);
        })
      }

      return value;
    },

    selected() {
      let flag = false;
      if(this.$store.state.selectDataIdList.indexOf(this.data.id)>=0){
        flag = true;
      }
      return flag;
    }
  },

  created() {
  },

  methods: {
    editView() {
      if(this.data.id == 0){
        return;
      }
      this.$dialogViewEditor.editShow(this.data.id);
    },

    mousedown(event) {
      if(this.data.id == 0){
        this.$set(this.$store.state, "selectDataIdList", []);
      }else{
        this.$painter.mousedown(event, this);
        this.$set(this.$store.state.selectDataIdList, 0, this.data.id);
      }
    },
    mousemove(event) {
      if(this.data.id != 0){
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
      }

      this.$painter.mousemove(event);
    }
  },

  components: {TextView, ButtonView, BaseView}
}
</script>
<style scoped>
.bg {
  position: absolute;
  border: 1px dashed gray;
  pointer-events: none;
  opacity: 0.3;
}

.group::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.v-line {
  position: absolute;
  width: 1px;
  height: 100%;
  border-left: 1px dashed #de2910;
}

.h-line {
  position: absolute;
  width: 100%;
  height: 1px;
  border-top: 1px dashed #de2910;
}
</style>