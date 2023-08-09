<template>
  <div>
    <div ref="group" style="position: absolute;overflow: hidden;" :style="style" @dblclick.stop="editView"
         @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup">
      <fragment v-if="data.children.length>0" :data="data.children[detail.other.selectedIndex]"></fragment>
    </div>
    <div class="bg" :style="{width:width-2+'px',height:height-2+'px',left:left+'px',top:top+'px',background:selected?'gray':''}"></div>

    <div class="position" :style="{left:left+2+'px',top:top+2+'px'}" v-if="selected">
      {{ 'l:' + left + ',' + 't:' + top }}
    </div>
    <div class="size" :style="{left:left+2+'px',top:top+14+'px'}" v-if="selected">
      {{ 'w:' + width + ',' + 'h:' + height }}
    </div>

  </div>
</template>
<script>

import Fragment from "@/components/frame/Fragment.vue";
import viewUtils from "@/utils/viewUtils";

/**
 * 只用来布局
 */
export default {
  name: "FrameView",
  props: {
    data: Object
  },

  data() {
    return {
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

      if (this.detail.type == "group") {
        value.zIndex = "1";
      }

      return value;
    },

    selected() {
      let flag = this.$store.getters.isSelected(this.data.id)
      return flag;
    },
  },

  mounted() {
    this.$refs.group.addEventListener("scroll", event => {
      if (this.$refs.tag) {
        this.$refs.tag.scrollLeft = this.$refs.group.scrollLeft;
        this.$refs.tag.scrollTop = this.$refs.group.scrollTop;
      }

      if (this.$refs.vLineTag) {
        this.$refs.vLineTag.scrollLeft = this.$refs.group.scrollLeft;
      }

      if (this.$refs.hLineTag) {
        this.$refs.hLineTag.scrollTop = this.$refs.group.scrollTop;
      }
    })
  },

  methods: {
    editView() {
      this.$dialogViewEditor.editShow(this.data.id);
    },

    mousedown(event) {
      this.$viewEffect.mousedown(event, this);
      this.$store.commit("selectView", {id: this.data.id});
    },
    mousemove(event) {
      let preview = this.$movePreview.preview;
      if (preview) {
        return;
      }

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
      event.stopPropagation();

      this.$viewEffect.mousemove(event);
    },

    mouseup(event) {
      this.$viewEffect.mouseup(event, this);
    },

    getDetailById(id) {
      return this.$store.getters.getDetailById(id);
    }
  },

  components: {
    Fragment
  }
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