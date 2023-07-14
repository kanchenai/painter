<template>
  <div>
    <div class="top-container">
      <div class="title">Page</div>
      <div style="float: right;margin-right: 10px;">
        <el-button size="mini" type="text" @click="buildPage">生成</el-button>
        <el-button class="top-button" size="mini" type="text" @click="addView(0)">新增</el-button>
      </div>

    </div>
    <div style="width:100%;height: 1px;background: gray;"></div>
    <el-tree
        class="tree"
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
              type="text"
              size="mini"
              v-if="data.type=='group'"
              @click="addView(data.id)">
            新增
          </el-button>
          <el-button
              type="text"
              size="mini"
              @click="editView(data.id)">
            编辑
          </el-button>
          <el-button
              type="text"
              size="mini"
              @click="removeView(node.parent,data.id)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <dialog-view-editor ref="dialogViewEditor"></dialog-view-editor>
  </div>
</template>
<script>
import DialogViewEditor from "@/components/DialogViewEditor.vue";
import utils from "@/store/utils";

export default {
  name: "ViewBuilder",

  computed: {
    painterData() {
      return this.$store.state.painterData;
    },
    data() {
      return utils.buildTree(this.painterData);
    },
  },

  methods: {
    addView(id) {
      this.$refs.dialogViewEditor.addShow(id);
    },

    editView(id) {
      this.$refs.dialogViewEditor.editShow(id);
    },

    removeView(parent, id) {
      let fatherId = 0;
      if (parent.data.id) {
        fatherId = parent.data.id;
      }
      console.log("fatherId", fatherId)
      this.$store.commit("deletePainterData", {fatherId, id})
    },

    buildPage() {
      console.log(this.$store.state.painterData);
      let ele = utils.buildPage(this.$store.state.painterData);
      console.log(ele);

      let html = '<template>' +
          ele.innerHTML
          + '</template>'

      this.$alert('根据当前布局生成一个页面', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          console.log(action)
          if(action == "confirm"){
            utils.writeFile("test", html, "html");
          }
        }
      });
    }
  },

  components: {
    DialogViewEditor
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