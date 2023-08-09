<template>
  <el-dialog
      :title="title"
      :visible.sync="visible"
      v-if="visible"
      width="50%">
    <el-form ref="form" size="mini" label-width="150px">
      <el-form-item label="fragment名">
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
import viewUtils from "@/utils/viewUtils";

export default {
  name: "DialogFragmentEditor",
  data() {
    return {
      visible: false,
      title: "",
      editType: "",
      label: "",

      dataId: "",
      fatherDataId: "",
    }
  },

  computed: {
    fatherDetail() {
      let value = null;
      value = this.$store.getters.getDetailById(this.fatherDataId);
      return value;
    },
  },

  created() {
    window.dialogFragmentEditor = this;
    Vue.prototype.$dialogFragmentEditor = this;
  },

  methods: {
    addShow(fatherId) {
      this.visible = true;
      this.editType = "add";
      this.fatherDataId = fatherId;
      this.title = "新增";
      this.label = "";

      this.$nextTick(() => {
        this.$refs.labelInput.focus();
      })
    },

    editShow(id) {
      this.visible = true;
      this.editType = "edit";
      this.dataId = id;
      let {fatherFork, aimFork} = this.$store.getters.getDataById(this.dataId);
      this.fatherDataId = fatherFork.id;
      this.title = "编辑";

      this.label = aimFork.label;

      this.$nextTick(() => {
        this.$refs.labelInput.focus();
      })
    },

    submit() {
      if (!this.nameUsable()) {
        this.$message.error("Fragment名重复！")
        return;
      }

      if (this.editType == "add") {
        let data = {
          type: "fragment",
          style: {
            width: this.fatherDetail.style.width,
            height: this.fatherDetail.style.height,
          }
        }

        this.$store.commit("addView", {fatherId: this.fatherDataId, data: data, name: this.label})
      } else {
        let data = this.$store.getters.getDetailById(this.dataId);

        this.$store.commit("editView", {id: this.dataId, data, name: this.label})
      }

      this.visible = false;
    },

    nameUsable() {
      let {aimFork} = this.$store.getters.getDataById(this.fatherDataId);

      let itemList = aimFork.children.filter(item => {
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