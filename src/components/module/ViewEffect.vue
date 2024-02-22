<template>
  <div>
    <div style="width: 1px;height: 100%;min-height: 720px;float: left;background: gray;"></div>
    <div style="position: relative;" v-if="data" @mouseup="mouseup" @mouseenter="mouseIn=true"
         @mouseleave="mouseleave">
      <page v-if="detail.type=='page'" :data="data"></page>
      <dialog-view v-if="detail.type=='dialog'" :data="data"></dialog-view>
    </div>
  </div>

</template>
<script>
import Page from "@/components/page/Page.vue";
import Vue from "vue";
import viewUtils from "@/utils/viewUtils";
import DialogView from "@/components/page/DialogView.vue";

export default {
  name: "ViewEffect",

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
    },
    detail(){
      let value = null;
      if(this.data){
        value = this.$store.getters.getDetailById(this.data.id);
      }

      return value;
    }
  },

  watch: {},

  created() {
    Vue.prototype.$viewEffect = this;

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

          this.$store.state.viewDetailObj.__ob__.dep.notify();
        })
      }
    },

    mousedown(event, component) {
      this.downEvent = event;
      this.operateComponent = component;
      this.operateComponent.$parent.showReferLine = true;
      this.oldStyle = {...component.style};
      this.downType = viewUtils.judgeDownType(event, component);
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

        let obj = viewUtils.correctMoveView(left, top, width, height, this.operateComponent.$parent.referLine);

        left = obj.left;
        top = obj.top;
      } else {
        if (this.downType.indexOf("left") >= 0) {
          if (left + dx < 0) {
            dx = -left;
          } else if (dx > width - viewUtils.boardWidth * 2) {
            dx = width - viewUtils.boardWidth * 2
          }
          left += dx;
          width -= dx;
        } else if (this.downType.indexOf("right") >= 0) {
          width += dx;
          if (width < viewUtils.boardWidth * 2) {
            width = viewUtils.boardWidth * 2
          }
        } else if (this.downType.indexOf("top") >= 0) {
          if (top + dy < 0) {
            dy = -top;
          } else if (dy > height - viewUtils.boardWidth * 2) {
            dy = height - viewUtils.boardWidth * 2
          }
          top += dy;
          height -= dy;
        } else {
          height += dy;
          if (height < viewUtils.boardWidth * 2) {
            height = viewUtils.boardWidth * 2
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

      if (detail.type == "frame") {
        data.children.forEach(child => {
          let childDetail = this.$store.getters.getDetailById(child.id);

          childDetail.style.width = width;
          childDetail.style.height = height;

          this.$store.commit("editView", {id: child.id, data: childDetail, name: child.label})
        })
      }
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

  components: {DialogView, Page},
}
</script>
<style scoped>
</style>