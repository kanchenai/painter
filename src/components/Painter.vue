<template>
  <div>
    <el-container ref="mainFun" style="position:absolute;width:100%;">
      <el-container>
        <el-aside style="position:relative;padding: 0;height: 735px;overflow: hidden;"
                  :width="openFolder?'250px':'25px'">
          <div style="position:relative;height: 735px;width: 25px;float: left;background: #dcdfe6;">
            <el-button :icon="openFolder?'el-icon-folder-opened':'el-icon-folder'" type="text"
                       @click="openFolder=!openFolder" title="目录"></el-button>
            <el-button style="margin-left: 0px;" icon="el-icon-reading" type="text" :disabled="!currentPageId"
                       @click="showDrawer"
                       title="控件"></el-button>
          </div>
          <view-tree style="position:relative;width: 225px;height: 735px;float: left;" v-show="openFolder"
                     @changePage="changePage"></view-tree>
        </el-aside>
        <el-main style="padding: 0">
          <view-effect :pageId="currentPageId"></view-effect>
        </el-main>
      </el-container>
      <el-footer style="padding: 0;" :style="footerStyle">
        <all-preview></all-preview>
      </el-footer>
    </el-container>
    <move-preview ref="movePreview"></move-preview>
    <el-drawer
        :title="drawerTitle"
        size="700px"
        :visible.sync="drawerVisible"
        direction="ltr">
      <div style="text-align: left" v-html="code"></div>
    </el-drawer>

    <dialog-view-editor ref="dialogViewEditor"></dialog-view-editor>
    <dialog-page-editor ref="dialogPageEditor"></dialog-page-editor>
  </div>
</template>

<script>
import ViewEffect from "@/components/module/ViewEffect.vue";
import ViewTree from "@/components/module/ViewTree.vue";
import AllPreview from "@/components/module/AllPreview.vue";
import utils from "@/store/utils";
import {marked} from "marked";
import hljs from "highlight.js";
import MovePreview from "@/components/module/MovePreview.vue";
import DialogViewEditor from "@/components/dialog/DialogViewEditor.vue";
import DialogPageEditor from "@/components/dialog/DialogPageEditor.vue";

export default {
  name: 'App',

  data() {
    return {
      currentPageId: "",
      openFolder: true,
      drawerVisible: false,
      preview: null,
    }
  },

  computed: {
    footerStyle() {
      let value = {};

      value.height = window.innerHeight - 735 + "px";
      // value.minHeight = "120px";

      return value;
    },

    drawerTitle() {
      if (!this.drawerVisible || !this.currentPageId) {
        return "";
      }
      let value = "";
      let {aimFork} = this.$store.getters.getDataById(this.currentPageId);
      value = aimFork.label + " 的布局代码";
      return value;
    },

    code() {
      if (!this.drawerVisible) {
        return "";
      }

      if (!this.currentPageId) {
        return "请选择Page";
      }

      let {aimFork} = this.$store.getters.getDataById(this.currentPageId);
      let viewDetailObj = this.$store.state.viewDetailObj;
      let {html} = utils.getPageHtml(aimFork.label, aimFork, viewDetailObj);

      html =
          "```html\n" +
          html
          + '\n```';

      this.$nextTick(() => {
        hljs.highlightAll();
      })

      return marked(html);
    },
  },

  created() {
    window.painter = this;
  },

  mounted() {
    this.$el.addEventListener("mousedown", event => {
      this.$refs.movePreview.mousedown(event);
    });
    this.$el.addEventListener("mouseup", event => {
      this.$refs.movePreview.mouseup(event);
    });
    this.$el.addEventListener("mousemove", event => {
      this.$refs.movePreview.mousemove(event);

    });
    this.$el.addEventListener("mouseleave", event => {
      this.$refs.movePreview.mouseleave(event);
    });
  },

  methods: {
    changePage(id) {
      console.log("changePage", id)
      this.currentPageId = id;
    },

    showDrawer() {
      if (!this.currentPageId) {
        this.$message("请选择Page")
        return;
      }

      this.drawerVisible = true;
    },
  },

  components: {
    DialogPageEditor,
    DialogViewEditor,
    MovePreview,
    AllPreview,
    ViewEffect,
    ViewTree,
  },
}
</script>
<style>
</style>
