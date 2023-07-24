<template>
  <div>
    <div class="top-container">
      <div class="title">Page列表</div>
      <div style="float: right;margin-right: 10px;">
        <el-button class="top-button" size="mini" type="text" @click="addPage">新增Page</el-button>
      </div>

    </div>
    <div style="width:100%;height: 1px;background: gray;"></div>
    <el-tree
        class="tree"
        ref="tree"
        :data="treeData"
        node-key="id"
        :draggable="true"
        default-expand-all
        :current-node-key="selectedId"
        :expand-on-click-node="false"
        :highlight-current="true"
        @current-change="currentChange"
        @node-drag-end="nodeDragEnd"
        :allow-drop="allowDrop">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ isFocus(data.id)?"焦点":node.label }}</span>
        <span>
          <el-button
              type="text"
              size="mini"
              @click="addView(data.id)">
            新增
          </el-button>
          <el-button
              type="text"
              size="mini"
              v-if="getDetailById(data.id).type=='page'"
              @click="editPage(data.id)">
            编辑
          </el-button>
          <el-button
              type="text"
              size="mini"
              v-else
              @click="editView(data.id)">
            编辑
          </el-button>
          <el-button
              type="text"
              size="mini"
              @click="removeView(data.id)">
            删除
          </el-button>
          <el-button
              type="text"
              size="mini"
              v-if="getDetailById(data.id).type=='page'"
              @click="buildPage(data.id)">
            生成
          </el-button>
        </span>
      </span>
    </el-tree>
    <dialog-view-editor ref="dialogViewEditor"></dialog-view-editor>
    <dialog-page-editor ref="dialogPageEditor"></dialog-page-editor>
  </div>
</template>
<script>
import DialogViewEditor from "@/components/dialog/DialogViewEditor.vue";
import DialogPageEditor from "@/components/dialog/DialogPageEditor.vue";
import utils from "@/store/utils";

export default {
  name: "ViewBuilder",

  data() {
    return {
      selectedId: "",
    }
  },

  computed: {
    painterData() {
      return this.$store.state.painterData;
    },
    treeData() {
      return this.$store.state.viewTreeData;
    },
  },

  watch: {
    treeData() {
      console.log("treeData更新");
    }
  },

  created() {
    window.viewBuilder = this;
  },

  methods: {
    addPage() {
      this.$refs.dialogPageEditor.addShow();
    },
    addView(fatherId) {
      this.$refs.dialogViewEditor.addShow(fatherId);
    },

    editPage(id) {
      this.$refs.dialogPageEditor.editShow(id);
    },

    editView(id) {
      this.$refs.dialogViewEditor.editShow(id);
    },

    removeView(id) {
      this.$store.commit("deletePainterData", id)
    },

    buildPage(id) {
      let pageData = this.$store.getters.getDataById(id);
      console.log(pageData);
      // let ele = utils.buildPage(pageData,this.$store.state.viewDetailMap);
      // console.log(ele);
      //
      // let html = '<template>' +
      //     ele.innerHTML
      //     + '</template>'
      //
      // this.$alert('根据当前布局生成一个页面', '提示', {
      //   confirmButtonText: '确定',
      //   callback: action => {
      //     console.log(action)
      //     if (action == "confirm") {
      //       utils.writeFile("test", html, "html");
      //     }
      //   }
      // });
    },

    currentChange(data, node) {
      let detail = this.$store.getters.getDetailById(data.id);
      if (detail.type == "page") {
        this.$emit("changePage", data.id);
      } else {
        this.$store.commit("selectView", {id: data.id});
      }
    },

    allowDrop(draggingNode, dropNode, type) {
      let flag = true;

      let draggingDetail = this.$store.getters.getDetailById(draggingNode.data.id);
      let dropDetail = this.$store.getters.getDetailById(dropNode.data.id);

      if (type == "inner") {
        if (draggingDetail.type == "page") {
          flag = false;
        } else {
          if (dropDetail.type != "page" && dropDetail.type != "group") {
            flag = false;
          }
        }
      } else if (type == "none") {
        flag = false;
      } else {
        if (draggingDetail.type == "page" && dropDetail.type == "page") {
          flag = true;
        } else {
          flag = false;
        }
      }

      return flag;
    },


    nodeDragEnd(draggingNode, dropNode, dropType, ev) {
      if (!this.allowDrop(draggingNode, dropNode, dropType)) {
        return;
      }

      console.log({draggingNode, dropNode, dropType, ev})
      console.log("draggingNode", draggingNode.data.id)
      console.log("dropNode", dropNode.data.id)

      this.$store.commit("dragFork",
          {draggingId: draggingNode.data.id, dropId: dropNode.data.id, dropType: dropType})
    },

    getDetailById(id) {
      return this.$store.getters.getDetailById(id);
    },

    isFocus(id){
      let detail = this.$store.getters.getDetailById(id);
      let flag = false;
      if(detail && detail.props && detail.props.id == "focus" ){
        flag = true;
      }
      return flag;
    }
  },

  components: {
    DialogViewEditor,
    DialogPageEditor
  }
}
</script>
<style scoped>
.top-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 30px;
}

.title {
  text-align: left;
  margin-left: 10px;
  white-space: nowrap;
  width: 40%;
  height: 100%;
  line-height: 30px;
}


.tree {
  margin-top: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>