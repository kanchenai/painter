<template>
  <el-dialog
      :title="title"
      :visible.sync="visible"
      v-if="visible"
      width="50%">
    <el-form ref="form" size="mini" label-width="150px">
      <el-form-item label="控件类型">
        <el-select style="width: 100%" v-model="type" :disabled="editType=='edit'" :clearable="true" :filterable="true" placeholder="控件类型">
          <el-option v-for="(item,index) in viewTypeList" :key="index" :label="item.label"
                     :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="控件名">
        <el-input v-model="name" placeholder="请输入控件名"></el-input>
      </el-form-item>
    </el-form>
    <group-config ref="groupConfig" v-if="type=='group'"></group-config>
    <focus-config ref="focusConfig" v-if="type=='focus'"></focus-config>
    <button-config ref="buttonConfig" v-if="type=='button'"></button-config>
    <base-config ref="baseConfig" v-if="type=='div'||type=='img'" :father-data-id="fatherDataId" :type="type"></base-config>
    <text-config ref="textConfig" v-if="type=='text'"></text-config>
    <div style="width: 100%">
      <el-button type="primary" size="mini" @click="submit">确认</el-button>
      <el-button size="mini" @click="visible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Vue from "vue";
import ButtonConfig from "@/components/button/ButtonConfig.vue";
import GroupConfig from "@/components/group/GroupConfig.vue";
import FocusConfig from "@/components/focus/FocusConfig.vue";
import BaseConfig from "@/components/base/BaseConfig.vue";
import TextConfig from "@/components/text/TextConfig.vue";

export default {
  name: "DialogViewEditor",
  data() {
    return {
      visible: false,
      title: "",
      editType: "",
      type: "",
      name: "",

      fatherDataId: "",
      dataId: "",
    }
  },

  computed: {
    fatherDetail() {
      return this.$store.getters.getDetailById(this.fatherDataId);
    },

    viewTypeList() {
      let value = [
        {
          label: "Div",
          type: "div"
        },
        {
          label: "Image",
          type: "img"
        },
        {
          label: "Text",
          type: "text"
        },
      ];
      if (this.editType == "edit" || this.fatherDetail.type == "group" || this.fatherDetail.type == "page") {
        value = value.concat([
          {
            label: "Group",
            type: "group"
          },
          {
            label: "Focus",
            type: "focus"
          },
          // {
          //   label: "Button",
          //   type: "button"
          // }
        ])
      }

      return value;
    }
  },

  created() {
    window.dialogViewEditor = this;
    Vue.prototype.$dialogViewEditor = this;
  },

  methods: {
    addShow(fatherId) {
      this.visible = true;
      this.editType = "add";
      this.fatherDataId = fatherId;
      this.dataId = "";

      this.title = "新增控件";

      this.type = "";
      this.name = "";
    },

    editShow(id) {
      this.visible = true;
      this.editType = "edit";
      this.dataId = id;
      let {fatherFork} = this.$store.getters.getDataById(this.dataId);
      this.fatherDataId = fatherFork.id;

      this.title = "编辑控件";
      this.setConfigData();
    },

    submit() {
      let data = this.getConfigData();

      if (this.editType == "add") {
        this.$store.commit("addView", {fatherId: this.fatherDataId, data, name: this.name})
      } else {
        this.$store.commit("editView", {id: this.dataId, data, name: this.name})
      }

      this.visible = false;
    },

    getConfigData() {
      let data = null;
      switch (this.type) {
        case "group":
          data = this.$refs.groupConfig.getData();
          break;
        case "focus":
          data = this.$refs.focusConfig.getData();
          break;
        case "button":
          data = this.$refs.buttonConfig.getData();
          break;
        case "img":
        case "div":
          data = this.$refs.baseConfig.getData();
          break;
        case "text":
          data = this.$refs.textConfig.getData();
          break;
      }

      return data;
    },

    setConfigData() {
      if (!this.dataId) {
        return;
      }
      let detail = this.$store.getters.getDetailById(this.dataId);
      detail = JSON.parse(JSON.stringify(detail));
      this.type = detail.type;

      let {aimFork} = this.$store.getters.getDataById(this.dataId);
      this.name = aimFork.label;

      this.$nextTick(() => {
        switch (this.type) {
          case "group":
            this.$refs.groupConfig.setData(detail);
            break;
          case "focus":
            this.$refs.focusConfig.setData(detail);
            break;
          case "button":
            this.$refs.buttonConfig.setData(detail);
            break;
          case "img":
          case "div":
            this.$refs.baseConfig.setData(detail);
            break;
          case "text":
            this.$refs.textConfig.setData(detail);
            break;
        }
      })

    }
  },

  components: {
    TextConfig,
    BaseConfig,
    ButtonConfig,
    GroupConfig,
    FocusConfig
  }
}
</script>
<style scoped>
</style>