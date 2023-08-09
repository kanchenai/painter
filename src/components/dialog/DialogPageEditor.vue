<template>
  <el-dialog
      :title="title"
      :visible.sync="visible"
      v-if="visible"
      width="50%">
    <el-form ref="form" size="mini" label-width="150px">
      <el-form-item label="页面名">
        <el-input ref="labelInput" v-model="label"></el-input>
      </el-form-item>
      <!--      <el-form-item label="背景颜色">-->
      <!--        <el-color-picker style="float: left;" v-model="data.style.background"></el-color-picker>-->
      <!--        <div style="float: left;margin-left: 10px;">{{ data.style.background }}</div>-->
      <!--      </el-form-item>-->
    </el-form>
    <div style="width: 100%">
      <el-button type="primary" size="mini" @click="submit">确认</el-button>
      <el-button size="mini" @click="visible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Vue from "vue";

export default {
  name: "DialogPageEditor",
  data() {
    return {
      visible: false,
      title: "",
      editType: "",
      label: "",

      dataId: "",
    }
  },

  created() {
    window.dialogPageEditor = this;
    Vue.prototype.$dialogPageEditor = this;
  },

  methods: {
    addShow() {
      this.visible = true;
      this.editType = "add";
      this.title = "新增页面";
      this.label = "";

      this.$nextTick(() => {
        this.$refs.labelInput.focus();
      })
    },

    editShow(id) {
      this.visible = true;
      this.editType = "edit";
      this.dataId = id;
      this.title = "编辑页面";
      let {aimFork} = this.$store.getters.getDataById(id);

      this.label = aimFork.label;

      this.$nextTick(() => {
        this.$refs.labelInput.focus();
      })
    },

    submit() {
      let nameUsable = this.nameUsable();

      if(!nameUsable){
        this.$message.error("Page名重复！")
        return;
      }

      if (this.editType == "add") {
        this.$store.commit("addPage", this.label);
        if (!this.$parent.currentPageId) {
          if (this.$store.state.viewTreeData.length > 0) {
            this.$parent.currentPageId = this.$store.state.viewTreeData[0].id;
          }
        }
      } else {
        this.$store.commit("editPage", {id: this.dataId, label: this.label})
      }

      this.visible = false;
    },

    nameUsable() {
      let itemList = this.$store.state.viewTreeData.filter(item => {
        let flag = false;

        if (this.editType == "add") {
          if (item.label.toUpperCase() == this.label.toUpperCase()) {
            flag = true;
          }
        } else {
          if (item.id != this.dataId && item.label.toUpperCase() == this.label.toUpperCase()) {
            flag = true;
          }
        }

        return flag;
      })

      let flag = true;
      if (itemList.length > 0) {
        flag = false;
      }

      return flag;
    }
  },

  components: {}
}
</script>
<style scoped>
</style>