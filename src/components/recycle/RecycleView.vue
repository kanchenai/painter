<template>
  <div>
    <div class="recycle" ref="recycle" style="position: absolute;overflow: scroll;" :style="style"
         @dblclick.stop="editView"
         @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup">
      <div v-if="!!adapterData">
        <div>
          <group-view v-if="getDetailById(adapterData.id).type=='group'" :data="adapterData"></group-view>
          <focus-view ref="focusView" v-else-if="getDetailById(adapterData.id).type=='focus'"
                      :data="adapterData"></focus-view>
          <text-view v-else-if="getDetailById(adapterData.id).type=='text'" :data="adapterData"></text-view>
          <base-view v-else :data="adapterData"></base-view>
        </div>
        <virtual-view v-for="(item,index) in parseInt(detail.other.dataNum)" :key="index" :detail="adapterDetail"
                      :position="getPositionBy(item)"></virtual-view>
      </div>
    </div>

    <div class="bg"
         :style="{width:width-2+'px',height:height-2+'px',left:left+'px',top:top+'px',background:selected?'gray':''}"
         v-if="$store.state.editMode"></div>

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
import VirtualView from "@/components/recycle/VirtualView.vue";

/**
 * 只用来布局
 */
export default {
  name: "RecycleView",
  props: {
    data: Object
  },

  data() {
    return {}
  },

  computed: {
    detail() {
      let value = null;
      if (this.data) {
        value = this.$store.getters.getDetailById(this.data.id);
      }
      return value;
    },

    adapterData() {
      let value = null;
      if (this.data.children && this.data.children.length > 0) {
        value = this.data.children[0]
      }

      return value;
    },

    adapterDetail() {
      let value = null;
      if (this.adapterData) {
        value = this.$store.getters.getDetailById(this.adapterData.id);
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

    adapterSeatSize() {
      let value = {
        width: 0,
        height: 0
      }

      if (this.adapterDetail) {
        value.width = this.adapterDetail.style.width;
        value.height = this.adapterDetail.style.height;
      }

      let disLeft = this.adapterDisLeft;
      let disTop = this.adapterDisTop;
      if (disLeft < 0) {
        value.width -= (2 * disLeft);
        value.height -= (2 * disTop);
      }

      let margin = parseInt(this.detail.props["view-margin"]);
      value.width += (2 * margin);
      value.height += (2 * margin);

      return value;
    },

    /**adapter focus的校准，一般小于0*/
    adapterDisLeft() {
      let value = 0;
      if (this.adapterFocus) {
        let width = this.adapterFocus.style.width;
        value = (this.adapterDetail.style.width() - width) / 2;
      } else {
        value = -3;
      }

      return value;
    },

    /**adapter focus的校准，一般小于0*/
    adapterDisTop() {
      let value = 0;
      if (this.adapterFocus) {
        let height = this.adapterFocus.style.height;
        value = (this.adapterDetail.style.height - height) / 2;
      } else {
        value = -3;
      }

      return value;
    },

    adapterFocus() {
      let value = null;
      if (this.adapterDetail.type == "focus") {
        if (this.adapterData.children && this.adapterData.children.length > 0) {
          for (let child of this.adapterData.children) {
            let detail = this.$store.getters.getDetailById(child.id)
            if (detail.props && detail.props.id == "focus") {
              value = detail;
              break;
            }
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

  mounted() {
    console.log(this.detail)
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
      event.stopPropagation();

      let preview = this.$movePreview.preview;
      if (preview) {
        let rect = this.$refs.recycle.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        this.$movePreview.mousemove(event, this.referLine, left, top);
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

      preview.style.left = 0;
      preview.style.top = 0;
      if (this.data.children.length == 0) {
        this.$store.commit("addPreview", {fatherId: this.data.id, preview})
      } else {
        this.$message.info("recycle内部只能设置一个控件");
      }
    },

    getDetailById(id) {
      return this.$store.getters.getDetailById(id);
    },

    getPositionBy(index) {
      let row = 0;
      let col = 0;
      let detail = this.detail;
      if (detail.props.orientation == "v") {//总向
        let viewCol = parseInt(detail.props["view-col"]);
        row = Math.floor(index / viewCol);
        col = index % viewCol;
      } else {
        let viewRow = parseInt(detail.props["view-row"]);
        row = index % viewRow;
        col = Math.floor(index / viewRow);
      }

      // console.log({row,col})

      let left = col * this.adapterSeatSize.width;
      let top = row * this.adapterSeatSize.height;

      if (left + this.adapterDisLeft <= 0) {
        left = -this.adapterDisLeft;
      }

      if (top + this.adapterDisTop <= 0) {
        top = -this.adapterDisTop;
      }

      return {left, top};
    }
  },

  components: {VirtualView, FocusView, TextView, BaseView}
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

.recycle::-webkit-scrollbar {
  width: 0;
  height: 0;
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