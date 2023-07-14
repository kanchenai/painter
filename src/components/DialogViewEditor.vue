<template>
  <el-dialog
      :title="title"
      :visible.sync="visible"
      v-if="visible"
      width="50%">
    <el-form ref="form" size="mini" label-width="150px">
      <el-form-item label="控件类型">
        <el-select style="width: 100%" v-model="type" :disabled="editType=='edit'" placeholder="控件类型">
          <el-option v-for="(item,index) in viewTypeList" :key="index" :label="item.label"
                     :value="item.type"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <button-config ref="buttonConfig" v-if="type=='button'"></button-config>
    <group-config ref="groupConfig" v-if="type=='group'"></group-config>
    <base-config ref="baseConfig" v-if="type=='div'||type=='img'" :type="type"></base-config>
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
import BaseConfig from "@/components/base/BaseConfig.vue";
export default {
  name: "DialogViewEditor",
  data() {
    return {
      visible: false,
      title: "",
      editType: "",
      type: "",

      dataId: {},
      viewTypeList: [
        {
          label: "Div",
          type: "div"
        },
        {
          label: "Image",
          type: "img"
        },
        {
          label: "Button",
          type: "button"
        },
        {
          label: "Group",
          type: "group"
        },
      ]
    }
  },

  created() {
    Vue.prototype.$dialogViewEditor = this;
  },

  methods: {
    addShow(fatherId) {
      this.visible = true;
      this.editType = "add";
      this.dataId = fatherId;

      this.title = "新增控件";

      this.type = "";
    },

    editShow(id) {
      this.visible = true;
      this.editType = "edit";
      this.dataId = id;

      this.title = "编辑控件";
      this.setConfigData();
    },

    submit() {
      let data = this.getConfigData();

      if (this.editType == "add") {
        this.$store.commit("addPainterChild", {id: this.dataId, data})
      } else {
        this.$store.commit("editPainterData", {id: this.dataId, data})
      }

      this.visible = false;
    },

    getConfigData() {
      let data = null;
      switch (this.type) {
        case "button":
          data = this.$refs.buttonConfig.getData();
          break;
        case "group":
          data = this.$refs.groupConfig.getData();
          break;
        case "img":
        case "div":
          data = this.$refs.baseConfig.getData();
          break;
      }

      return data;
    },

    setConfigData() {
      if (!this.dataId) {
        return;
      }
      let data = this.$store.getters.getDataById(this.dataId);
      data = JSON.parse(JSON.stringify(data));
      this.type = data.type;

      this.$nextTick(() => {
        switch (this.type) {
          case "button":
            this.$refs.buttonConfig.setData(data);
            break;
          case "group":
            this.$refs.groupConfig.setData(data);
            break;
          case "img":
          case "div":
            data = this.$refs.baseConfig.setData(data);
            break;
        }
      })

    }
  },

  components: {
    BaseConfig,
    ButtonConfig,
    GroupConfig
  }
}
</script>
<style scoped>
</style>