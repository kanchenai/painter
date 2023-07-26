<template>
  <div>
    <div style="width: 1px;height: 100%;min-height: 720px;float: left;background: gray;"></div>
    <div style="position: relative;" v-if="data" @mouseup="mouseup" @mouseenter="mouseIn=true"
         @mouseleave="mouseleave">
      <group-view :data="data"></group-view>
    </div>
  </div>

</template>
<script>
import GroupView from "@/components/group/GroupView.vue";
import Vue from "vue";
import utils from "@/utils/utils";

export default {
  name: "Painter",

  props: {
    pageId: String
  },

  data() {
    return {
      oldStyle: {},
      downEvent: null,
      operateComponent: null,
      downType: "",
      mouseIn: false,
    }
  },

  computed: {
    data() {
      let value = null;
      if (this.pageId) {
        let {aimFork} = this.$store.getters.getDataById(this.pageId);
        if (aimFork) {
          value = aimFork;
        }
      }
      return value;
    }
  },

  watch: {},

  created() {
    window.painter = this;
    Vue.prototype.$painter = this;

    this.initKeydown();
  },

  methods: {
    initKeydown() {
      window.onkeydown = (event) => {
        if (!this.mouseIn) {
          return;
        }

        if (this.$store.state.selectDataIdList.length == 0) {
          return;
        }

        this.$store.state.selectDataIdList.forEach(id => {
          let viewData = this.$store.getters.getDetailById(id);
          let style = viewData.style;
          var keyCode = event.which ? event.which : event.keyCode;
          switch (keyCode) {
            case 37://KEY_LEFT
              if (style.left > 0) {
                style.left--;
              }
              break;
            case 38://KEY_UP
              if (style.top > 0) {
                style.top--;
              }
              break;
            case 39://KEY_RIGHT
              style.left++;
              break;
            case 40://KEY_DOWN
              style.top++;
              break;
          }
        })
      }
    },

    mousedown(event, component) {
      this.downEvent = event;
      this.operateComponent = component;
      this.operateComponent.$parent.showReferLine = true;
      this.oldStyle = {...component.style};
      this.downType = utils.judgeDownType(event, component);
    },

    mousemove(event) {
      if (!this.operateComponent || !this.downEvent || !this.downType) {
        return;
      }
      this.operateComponent.$parent.showReferLine = true;

      let dx = event.screenX - this.downEvent.screenX;
      let dy = event.screenY - this.downEvent.screenY

      let left = parseInt(this.oldStyle.left);
      let top = parseInt(this.oldStyle.top);

      let width = parseInt(this.oldStyle.width);
      let height = parseInt(this.oldStyle.height);

      if (this.downType == "move") {
        left = left + dx;
        top = top + dy;

        if (left < 0) {
          left = 0;
        }

        if (top < 0) {
          top = 0;
        }

        let disPx = 6;
        let vReferLineList = this.operateComponent.$parent.referLine.vLineList;
        for (let vReferLine of vReferLineList) {
          if (Math.abs(left - vReferLine) < disPx) {
            left = vReferLine;
            break;
          }

          if (Math.abs(left + width - vReferLine) < disPx) {
            left = vReferLine - width;
            break;
          }
        }

        let hReferLineList = this.operateComponent.$parent.referLine.hLineList;
        for (let hReferLine of hReferLineList) {
          if (Math.abs(top - hReferLine) < disPx) {
            top = hReferLine;
            break;
          }

          if (Math.abs(top + height - hReferLine) < disPx) {
            top = hReferLine - height;
            break;
          }
        }
      } else {
        if (this.downType.indexOf("left") >= 0) {
          if (left + dx < 0) {
            dx = -left;
          } else if (dx > width - utils.boardWidth * 2) {
            dx = width - utils.boardWidth * 2
          }
          left += dx;
          width -= dx;
        } else if (this.downType.indexOf("right") >= 0) {
          width += dx;
          if (width < utils.boardWidth * 2) {
            width = utils.boardWidth * 2
          }
        } else if (this.downType.indexOf("top") >= 0) {
          if (top + dy < 0) {
            dy = -top;
          } else if (dy > height - utils.boardWidth * 2) {
            dy = height - utils.boardWidth * 2
          }
          top += dy;
          height -= dy;
        } else {
          height += dy;
          if (height < utils.boardWidth * 2) {
            height = utils.boardWidth * 2
          }
        }
      }

      let data = this.operateComponent.data;
      let id = data.id
      let detail = this.$store.getters.getDetailById(id);
      detail.style.width = width;
      detail.style.height = height;
      detail.style.left = left;
      detail.style.top = top;
      this.$store.commit("editView", {id, data: detail, name: data.label})
    },

    mouseup(event) {
      if (this.operateComponent) {
        this.operateComponent.$parent.showReferLine = false;
      }

      this.downEvent = null;
      this.operateComponent = null;
      this.oldStyle = {};
    },

    mouseleave(event) {
      this.mouseIn = false;
      this.mouseup(event);
    }
  },

  components: {GroupView},
}
</script>
<style scoped>
</style>