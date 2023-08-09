<template>
  <div>
    <div class="fragment" ref="fragment" :style="style" @dblclick="editView" @mousedown.stop="mousedown"
         @mousemove="mousemove" @mouseup="mouseup">
      <div v-for="(child,index) in data.children" :key="index">
        <frame-view v-if="getDetailById(child.id).type=='frame'" :data="child"></frame-view>
        <group-view v-else-if="getDetailById(child.id).type=='group'" :data="child"></group-view>
        <focus-view v-else-if="getDetailById(child.id).type=='focus'" :data="child"></focus-view>
        <button-view v-else-if="getDetailById(child.id).type=='button'" :data="child"></button-view>
        <text-view v-else-if="getDetailById(child.id).type=='text'" :data="child"></text-view>
        <base-view v-else :data="child"></base-view>
      </div>
    </div>

    <div ref="tag" style="position: absolute;pointer-events: none;overflow: hidden;z-index: 1;" v-if="showReferLine"
         :style="{width:style.width,height:style.height,left:style.left,top:style.top,}">
      <div class="v-line" v-for="(left,index) of referLine.vLineList" :key="'v'+index"
           :style="{left:left+'px',height:scrollHeight+'px'}"></div>
      <div class="h-line" v-for="(top,index) of referLine.hLineList" :key="'h'+index"
           :style="{top:top+'px',width:scrollWidth+'px'}"></div>
    </div>

    <div ref="vLineTag" style="position: absolute;pointer-events: none;overflow: hidden;z-index: 1;"
         v-if="showReferLine"
         :style="{width:style.width,height:style.height,left:style.left,top:style.top,}">
      <div class="v-short-line" v-for="(num,index) of Math.ceil(scrollWidth/10)" :key="'v-s'+index"
           :style="{left:index*10+'px',height:((index%10==0)?15:((index%5==0)?10:(5)))+'px'}"></div>
    </div>

    <div ref="hLineTag" style="position: absolute;pointer-events: none;overflow: hidden;z-index: 1;"
         v-if="showReferLine"
         :style="{width:style.width,height:style.height,left:style.left,top:style.top,}">
      <div class="h-short-line" v-for="(num,index) of Math.ceil(scrollHeight/10)" :key="'h-s'+index"
           :style="{top:index*10+'px',width:((index%10==0)?15:((index%5==0)?10:(5)))+'px'}"></div>
    </div>
  </div>
</template>
<script>

import GroupView from "@/components/group/GroupView.vue";
import ButtonView from "@/components/button/ButtonView.vue";
import TextView from "@/components/text/TextView.vue";
import BaseView from "@/components/base/BaseView.vue";
import FocusView from "@/components/focus/FocusView.vue";
import FrameView from "@/components/frame/FrameView.vue";

/**
 * 只用来布局
 */
export default {
  name: "Fragment",
  props: {
    data: Object
  },

  data() {
    return {
      showReferLine: false
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
    scrollHeight() {
      let value = this.height;
      if (this.$refs.fragment) {
        value = this.$refs.fragment.scrollHeight;
      }
      return value;
    },
    scrollWidth() {
      let value = this.width;
      if (this.$refs.fragment) {
        value = this.$refs.fragment.scrollWidth;
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

      if (this.detail.type == "group") {
        value.zIndex = "1";
      }

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

  watch: {
    data() {
      // console.log("data更新",this.data)
    }
  },

  created() {
  },

  mounted() {
    this.$refs.fragment.addEventListener("scroll", event => {
      if (this.$refs.tag) {
        this.$refs.tag.scrollLeft = this.$refs.fragment.scrollLeft;
        this.$refs.tag.scrollTop = this.$refs.fragment.scrollTop;
      }

      if (this.$refs.vLineTag) {
        this.$refs.vLineTag.scrollLeft = this.$refs.fragment.scrollLeft;
      }

      if (this.$refs.hLineTag) {
        this.$refs.hLineTag.scrollTop = this.$refs.fragment.scrollTop;
      }
    })
  },

  methods: {
    editView() {
      this.$parent.editView();
    },
    mousedown(event) {
      let preview = this.$movePreview.preview;
      if (preview) {
        return;
      }
      event.stopPropagation();
      this.$parent.mousedown(event);
    },
    mousemove(event) {
      let preview = this.$movePreview.preview;
      if (preview) {
        return;
      }
      this.$parent.mousemove(event);
    },

    mouseup(event) {
      let preview = this.$movePreview.preview;
      if (!preview) {
        this.$parent.mouseup(event);
        return;
      }

      event.stopPropagation();
      //把preview添加到这个group中
      this.$movePreview.preview = null;

      let rect = this.$refs.fragment.getBoundingClientRect();
      let left = rect.left;
      let top = rect.top;

      preview.style.left -= left;
      preview.style.top -= top;

      this.$store.commit("addPreview", {fatherId: this.data.id, preview})
    },

    getDetailById(id) {
      return this.$store.getters.getDetailById(id);
    }
  },

  components: {
    FrameView,
    FocusView,
    TextView,
    ButtonView,
    BaseView,
    GroupView
  }
}
</script>
<style scoped>
.fragment {
  position: absolute;
  overflow: scroll;

}

.fragment::-webkit-scrollbar {
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

</style>