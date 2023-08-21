<template>
  <div class="tree-container">
    <div class="top-container">
      <div class="title">Page列表</div>
      <div style="float: right;margin-right: 10px;">
        <div style="display: inline-flex;font-size: 12px;">编辑模式</div>
        <el-switch
            style="margin-left: 5px;"
            size="mini"
            v-model="$store.state.editMode"
            active-color="#13ce66"
            inactive-color="#808080">
        </el-switch>
        <el-button style="margin-left: 10px;" size="mini" type="text" @click="addPage">新增Page</el-button>
      </div>
    </div>
    <div style="width:100%;height: 1px;background: gray;"></div>
    <div>
      <el-tree
          class="tree"
          ref="tree"
          :data="treeData"
          node-key="id"
          :draggable="true"
          :expand-on-click-node="true"
          :highlight-current="true"
          :accordion="true"
          :render-after-expand="false"
          @current-change="currentChange"
          @node-drag-end="nodeDragEnd"
          :allow-drop="allowDrop">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="max-width: 150px;overflow:hidden;" v-if="getDetailById(data.id).type!='fragment'">{{
            node.label
          }}</span>
        <span style="max-width: 50px;overflow:hidden;" v-else :style="{color:fragmentLabelColor(node)}">{{
            node.label
          }}</span>
        <span>
          <el-button
              type="text"
              size="mini"
              v-if="showAddBtn(data)"
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
    </div>
  </div>
</template>
<script>
import utils from "@/store/utils";

export default {
  name: "ViewTree",

  data() {
    return {
      isWin: true,
    }
  },

  computed: {
    treeData() {
      return this.$store.state.viewTreeData;
    },
    selectId() {
      let value = "";
      if (this.$store.state.selectDataIdList.length > 0) {
        value = this.$store.state.selectDataIdList[0]
      }
      return value;
    }
  },

  watch: {
    treeData() {
      // console.log("treeData更新");
    },
    selectId() {
      // console.log("selectId更新");
      this.$refs.tree.setCurrentKey(this.selectId);
    }
  },

  created() {
    // window.viewTree = this;
    if (navigator.userAgent.toLowerCase().indexOf("win") > -1) {
      this.isWin = true;
    } else {
      this.isWin = false
    }
  },

  mounted() {
    document.onkeydown = (event) => {
      if (event.target != this.$refs.tree.$el && !this.$refs.tree.$el.contains(event.target)) {
        return;
      }

      let key = event.keyCode || event.which;
      // console.log("key", key);
      if (this.isWin) {//windows
        if (key === 67 && event.ctrlKey) {// 监听ctrl+C组合键
          this.copy();
        } else if (key === 86 && event.ctrlKey) {// 监听ctrl+V组合键
          this.paste();
        }
      } else {//mac
        if (key === 67 && event.metaKey) {
          this.copy();
        } else if (key === 86 && event.metaKey) {
          this.paste();
        }
      }

      if (key === 46) {// 监听delete键
        this.$store.state.selectDataIdList.forEach(id => {
          this.removeView(id)
        })
        this.$store.state.selectDataIdList = [];
      }
    }
  },

  methods: {
    addPage() {
      this.$dialogPageEditor.addShow();
    },

    changeMode() {
      this.$store.commit("changeMode")
    },

    addView(fatherId) {
      let fatherDetail = this.getDetailById(fatherId);
      if (fatherDetail.type == "frame") {
        this.$dialogFragmentEditor.addShow(fatherId);
      } else {
        this.$dialogViewEditor.addShow(fatherId);
      }

    },

    editPage(id) {
      this.$dialogPageEditor.editShow(id);
    },

    editView(id) {
      let detail = this.getDetailById(id);
      if (detail.type == "fragment") {
        this.$dialogFragmentEditor.editShow(id);
      } else {
        this.$dialogViewEditor.editShow(id);
      }
    },

    removeView(id) {
      let detail = this.getDetailById(id);

      if (detail.type == "fragment") {
        let {fatherFork} = this.$store.getters.getDataById(id);
        let fatherDetail = this.$store.getters.getDetailById(fatherFork.id);
        if (fatherFork.children.length - 1 == fatherDetail.other.selectedIndex) {
          fatherDetail.other.selectedIndex = fatherFork.children.length - 2;
          if (fatherDetail.other.selectedIndex < 0) {
            fatherDetail.other.selectedIndex = 0;
          }
        }
      }
      this.$store.commit("deleteView", id)
    },

    buildPage(id) {
      let {aimFork} = this.$store.getters.getDataById(id);
      this.$alert('布局生成一个' + aimFork.label + '页面', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          if (action == "confirm") {
            let viewDetailObj = this.$store.state.viewDetailObj;
            let {ele, imageList, frameObj} = utils.buildLayout(aimFork.label, aimFork, viewDetailObj);

            utils.downloadPage(aimFork.label, ele, imageList, frameObj);
          }
        }
      });
    },

    currentChange(data, node) {
      let detail = this.$store.getters.getDetailById(data.id);
      if (detail.type == "page" || detail.type == "dialog") {
        this.$emit("changePage", data.id);
        this.$store.commit("selectView", {id: data.id});
      } else {
        this.$store.commit("selectView", {id: data.id});

        if (detail.type == "fragment") {
          let parentData = node.parent.data;
          let parentDetail = this.$store.getters.getDetailById(node.parent.data.id);
          for (let i = 0; i < parentData.children.length; i++) {
            if (parentData.children[i].id == data.id) {
              parentDetail.other.selectedIndex = i;
              break;
            }
          }

          this.$store.state.viewDetailObj.__ob__.dep.notify();
        }
      }
    },

    allowDrop(draggingNode, dropNode, type) {
      let flag = true;
      if (!dropNode) {
        flag = false;
      } else {
        let draggingDetail = this.$store.getters.getDetailById(draggingNode.data.id);
        let dropDetail = this.$store.getters.getDetailById(dropNode.data.id);

        flag = this.allowOperate(draggingDetail, dropDetail, type);
      }

      return flag;
    },

    allowOperate(draggingDetail, dropDetail, type) {
      // console.log({draggingNode, dropNode, type})
      let flag = true;

      if (type == "inner") {
        if (dropDetail.type == "div" || dropDetail.type == "img" || dropDetail.type == "text") {
          flag = false;
        }else{
          if (draggingDetail.type == "page") {
            flag = false;
          }else if(draggingDetail.type == "dialog"){
            flag = false;
          } else if(draggingDetail.type == "frame"){
            if(dropDetail.type != "page"){
              flag = false;
            }
          } else if(draggingDetail.type == "fragment"){
            if(dropDetail.type != "frame"){
              flag = false;
            }
          }else {
            if (dropDetail.type == "focus") {
              if (draggingDetail.type == "div" || draggingDetail.type == "img" || draggingDetail.type == "text") {
                flag = true;
              } else {
                flag = false;
              }
            } else {
              if (dropDetail.type == "frame" && draggingDetail.type != "fragment") {
                flag = false;
              }
            }
          }
        }
      } else if (type == "none") {
        flag = false;
      } else {
        if (draggingDetail.type == "page" || draggingDetail.type == "dialog") {
          if (dropDetail.type == "page" || draggingDetail.type == "dialog") {
            flag = true;
          }
        } else {
          if (dropDetail.type == "fragment") {
            if(draggingDetail.type == "fragment"){
              flag = true;
            }else{
              flag = false;
            }
          }else{
            flag = true;
          }
        }
      }

      console.log("allowDrop", flag);
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

    copy() {
      let itemList = this.$store.state.selectDataIdList.filter(id => {
        let flag = false;
        let detail = this.$store.getters.getDetailById(id);
        if (detail.type == "page") {
          flag = true;
        }

        return flag;
      })

      if (itemList.length > 0) {
        this.$message.warning("当前选中的控件，无法被复制")
        return;
      }
      console.log("copy")
      this.$store.commit("copyView");
    },

    paste() {
      if (this.$store.state.selectDataIdList.length == 0) {
        return;
      }
      let itemList_1 = this.$store.state.selectDataIdList.filter(id => {
        let flag = false;
        let detail = this.$store.getters.getDetailById(id);

        for (let operateId of this.$store.state.copyDataIdList) {
          let operateDetail = this.$store.getters.getDetailById(operateId);
          if (!this.allowOperate(operateDetail, detail, "inner")) {
            flag = true;
            break;
          }
        }


        return flag;
      })

      if (itemList_1.length > 0) {
        this.$message.warning("被复制的控件无法粘贴到当前选中的控件")
        return;
      }

      console.log("copy")
      this.$store.commit("pasteView");
    },

    fragmentLabelColor(node) {
      let parentDetail = this.getDetailById(node.parent.data.id);
      let selectedId = node.parent.data.children[parentDetail.other.selectedIndex].id;

      let value = "black";
      if (selectedId == node.data.id) {
        value = "#ffde00";
      }
      return value;
    },

    showAddBtn(data) {
      let flag = true;
      let id = data.id;
      let detail = this.getDetailById(id);
      if (detail.type == 'div' || detail.type == 'img' || detail.type == 'text') {
        flag = false;
      } else if (detail.type == 'recycle' && data.children.length != 0) {
        flag = false;
      }
      return flag;
    }
  },

  components: {}
}
</script>
<style scoped>
.tree-container {
  overflow: hidden;
}

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
  width: 425px;
  height: 705px;
  overflow: scroll;
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