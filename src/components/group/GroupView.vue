<template>
  <div>
    <div class="group" ref="group" style="position: absolute;overflow: scroll;" :style="style" @dblclick.stop="editView"
         @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup">
      <div v-for="(child,index) in data.children" :key="index">
        <group-view v-if="getDetailById(child.id).type=='group'" :data="child"></group-view>
        <focus-view v-else-if="getDetailById(child.id).type=='focus'" :data="child"></focus-view>
        <text-view v-else-if="getDetailById(child.id).type=='text'" :data="child"></text-view>
        <base-view v-else :data="child"></base-view>
      </div>

      <div v-if="showReferLine">
        <div class="v-line" v-for="(left,index) of referLine.vLineList" :key="'v'+index"
             :style="{left:left+'px',height:referLineHeight+'px'}"></div>
        <div class="h-line" v-for="(top,index) of referLine.hLineList" :key="'h'+index"
             :style="{top:top+'px',width:referLineWidth+'px'}"></div>

        <div class="h-short-line" v-for="(num,index) of Math.ceil(referLineHeight/10)" :key="'h-s'+index"
             :style="{top:index*10+'px',width:((index%10==0)?15:((index%5==0)?10:(5)))+'px',left:shortLineLeft+'px'}"></div>

        <div class="v-short-line" v-for="(num,index) of Math.ceil(referLineWidth/10)" :key="'v-s'+index"
             :style="{left:index*10+'px',height:((index%10==0)?15:((index%5==0)?10:(5)))+'px',top:shortLineTop+'px'}"></div>
      </div>
    </div>

    <div class="bg"
         :style="{width:width-2+'px',height:height-2+'px',left:left+'px',top:top+'px',background:selected?'gray':''}"></div>

    <div class="position" :style="{left:left+2+'px',top:top+2+'px'}" v-if="selected">
      {{ 'l:' + left + ',' + 't:' + top }}
    </div>
    <div class="size" :style="{left:left+2+'px',top:top+14+'px'}" v-if="selected">
      {{ 'w:' + width + ',' + 'h:' + height }}
    </div>

  </div>
</template>
<script>

import TextView from "@/components/text/TextView.vue";
import BaseView from "@/components/base/BaseView.vue";
import FocusView from "@/components/focus/FocusView.vue";
import viewUtils from "@/utils/viewUtils";

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
      showReferLine: false,

      referLineHeight: 0,
      referLineWidth: 0,

      shortLineLeft: 0,
      shortLineTop: 0,
    }
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

      value.zIndex = "1";

      return value;
    },

    referLine() {
      let value = {vLineList: [], hLineList: []};

      if (this.data.children && this.data.children.length > 0) {
        this.data.children.forEach(child => {
          if (this.$store.state.selectDataIdList.indexOf(child.id) >= 0) {
            return;
          }
          let childDetail = this.$store.getters.getDetailById(child.id)

          let left = childDetail.style.left;
          let right = childDetail.style.left + childDetail.style.width;

          let top = childDetail.style.top;
          let bottom = childDetail.style.top + childDetail.style.height;

          if (value.vLineList.indexOf(left) < 0) {
            value.vLineList.push(left);
          }

          if (value.vLineList.indexOf(right) < 0) {
            value.vLineList.push(right);
          }

          if (value.hLineList.indexOf(top) < 0) {
            value.hLineList.push(top);
          }

          if (value.hLineList.indexOf(bottom) < 0) {
            value.hLineList.push(bottom);
          }
        })
      }

      if (value.vLineList.indexOf(0) < 0) {
        value.vLineList.push(0);
      }

      if (value.vLineList.indexOf(this.width) < 0) {
        value.vLineList.push(this.width);
      }

      if (value.hLineList.indexOf(0) < 0) {
        value.hLineList.push(0);
      }

      if (value.hLineList.indexOf(this.height) < 0) {
        value.hLineList.push(this.height);
      }

      return value;
    },

    selected() {
      let flag = this.$store.getters.isSelected(this.data.id)
      return flag;
    },
  },

  mounted() {
    this.referLineWidth = this.width;
    this.referLineHeight = this.height;
    this.$refs.group.addEventListener("scroll", event => {
      this.referLineHeight = this.$refs.group.scrollHeight;
      this.referLineWidth = this.$refs.group.scrollWidth;

      this.shortLineLeft = this.$refs.group.scrollLeft;
      this.shortLineTop = this.$refs.group.scrollTop;
    })
  },

  methods: {
    editView() {
      this.$dialogViewEditor.editShow(this.data.id);
    },

    mousedown(event) {
      let preview = this.$movePreview.preview;
      if (preview) {
        return;
      }
      event.stopPropagation();
      this.$viewEffect.mousedown(event, this);
      this.$store.commit("selectView", {id: this.data.id});
    },
    mousemove(event) {
      let preview = this.$movePreview.preview;
      if (preview) {
        return;
      }

      let downType = viewUtils.judgeDownType(event, this);
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
      event.stopPropagation();

      this.$viewEffect.mousemove(event);
    },

    mouseup(event) {
      let preview = this.$movePreview.preview;
      if (!preview) {
        this.$viewEffect.mouseup(event);
        return;
      }
      event.stopPropagation();
      //把preview添加到这个group中
      this.$movePreview.preview = null;

      let rect = this.$refs.group.getBoundingClientRect();
      let left = rect.left;
      let top = rect.top;

      preview.style.left -= left;
      preview.style.top -= top;

      preview.style.left += this.$refs.group.scrollLeft;
      preview.style.top += this.$refs.group.scrollTop;

      this.$store.commit("addPreview", {fatherId: this.data.id, preview})
    },

    getDetailById(id) {
      return this.$store.getters.getDetailById(id);
    }
  },

  components: {FocusView, TextView, BaseView}
}
</script>
<style scoped>
.bg {
  position: absolute;
  border: 1px dashed white;
  pointer-events: none;
  opacity: 0.6;
  z-index: 1;
}

.group::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.v-line {
  position: absolute;
  width: 1px;
  border-left: 1px dashed #de2910;
}

.h-line {
  position: absolute;
  height: 1px;
  border-top: 1px dashed #de2910;
}

.v-short-line {
  position: absolute;
  width: 1px;
  border-left: 1px solid white;
}

.h-short-line {
  position: absolute;
  height: 1px;
  border-top: 1px solid white;
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