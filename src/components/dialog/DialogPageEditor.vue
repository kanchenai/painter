<template>
  <el-dialog
      :title="title"
      :visible.sync="visible"
      v-if="visible"
      width="50%">
    <el-form ref="form" size="mini" label-width="150px">
      <el-form-item label="页面类型">
        <el-select style="width: 100%" v-model="type" :disabled="editType=='edit'" :clearable="true" :filterable="true"
                   placeholder="页面类型">
          <el-option v-for="(item,index) in viewTypeList" :key="index" :label="item.label"
                     :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面名">
        <el-input ref="labelInput" v-model="label" placeholder="页面名"></el-input>
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
      type: "",
      label: "",

      dataId: "",


    }
  },

  computed: {
    viewTypeList() {
      let value = [
        {
          label: "Page",
          type: "page"
        },
        {
          label: "Dialog",
          type: "dialog"
        }
      ];

      return value;
    }
  },

  created() {
    Vue.prototype.$dialogPageEditor = this;
  },

  methods: {
    addShow() {
      this.visible = true;
      this.editType = "add";
      this.title = "新增页面";
      this.type = "";
      this.label = "";
    },

    editShow(id) {
      this.visible = true;
      this.editType = "edit";
      this.dataId = id;
      this.title = "编辑页面";
      let {aimFork} = this.$store.getters.getDataById(id);
      let detail = this.$store.getters.getDetailById(id);
      this.label = aimFork.label;
      this.type = detail.type;
    },

    submit() {
      let nameUsable = this.nameUsable();

      if (!nameUsable) {
        this.$message.error("Page名重复！")
        return;
      }

      if (this.editType == "add") {
        this.$store.commit("addPage", {type: this.type, label: this.label});
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

        let detail = this.$store.getters.getDetailById(item.id);
        if (detail.type != this.type) {
          return flag;
        }

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