<template>
  <div>
    <div class="group" style="position: absolute;overflow: scroll;" :style="style" @dblclick.stop="editView"
         @mousedown.stop="mousedown" @mousemove.stop="mousemove">
      <div v-for="(child,index) in data.children" :key="index">
        <group-view v-if="getDetailById(child.id).type=='group'" :data="child"></group-view>
        <focus-view v-else-if="getDetailById(child.id).type=='focus'" :data="child"></focus-view>
        <button-view v-else-if="getDetailById(child.id).type=='button'" :data="child"></button-view>
        <text-view v-else-if="getDetailById(child.id).type=='text'" :data="child"></text-view>
        <base-view v-else :data="child"></base-view>
      </div>
    </div>
    <div class="bg" :style="{width:width-2+'px',height:height-2+'px',left:left+'px',top:top+'px',background:selected?'gray':''}" v-if="detail.type=='group'"></div>
    <div style="position: absolute;overflow: hidden;pointer-events: none;" :style="style" v-show="showReferLine">
      <div class="v-line" v-for="(left,index) of referLine.vLineList" :key="'v'+index" :style="{left:left+'px'}"></div>
      <div class="h-line" v-for="(top,index) of referLine.hLineList" :key="'h'+index" :style="{top:top+'px'}"></div>
    </div>

  </div>
</template>
<script>

import ButtonView from "@/components/button/ButtonView.vue";
import TextView from "@/components/text/TextView.vue";
import BaseView from "@/components/base/BaseView.vue";
import utils from "@/utils/utils";
import FocusView from "@/components/focus/FocusView.vue";

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
    detail(){
      let value = null;
      if(this.data){
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

      value.background = this.detail.style.background;

      return value;
    },

    referLine() {
      let value = {vLineList: [], hLineList: []};

      if (this.data.children && this.data.children.length > 0) {
        this.data.children.forEach(child => {
          if(this.$store.state.selectDataIdList.indexOf(child.id) >= 0){
            return;
          }
          let childDetail = this.$store.getters.getDetailById(child.id)

          let left = childDetail.style.left;
          let right = childDetail.style.left+childDetail.style.width;

          let top = childDetail.style.top;
          let bottom = childDetail.style.top + childDetail.style.height;

          value.vLineList.push(left);
          value.vLineList.push(right);
          value.hLineList.push(top);
          value.hLineList.push(bottom);
        })
      }

      return value;
    },

    selected() {
      let flag = this.$store.getters.isSelected(this.data.id)
      return flag;
    },
  },

  watch:{
  },

  created() {
  },

  methods: {
    editView() {
      if(this.detail.type != "group"){
        return;
      }
      this.$dialogViewEditor.editShow(this.data.id);
    },

    mousedown(event) {
      if(this.detail.type != "group"){
        this.$set(this.$store.state, "selectDataIdList", []);
      }else{
        this.$painter.mousedown(event, this);
        this.$store.commit("selectView",{id:this.data.id});
      }
    },
    mousemove(event) {
      if(this.detail.type == "group"){
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
      }

      this.$painter.mousemove(event);
    },

    getDetailById(id) {
      return this.$store.getters.getDetailById(id);
    }
  },

  components: {FocusView, TextView, ButtonView, BaseView}
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