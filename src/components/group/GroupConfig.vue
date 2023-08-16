<template>
  <el-form ref="form" size="mini" label-width="150px">
    <el-form-item label="坐标(left,top)" v-if="showPosition">
      <el-col :span="11">
        <el-input v-model="data.style.left" type="number" placeholder="left"></el-input>
      </el-col>
      <el-col class="line" :span="2">,</el-col>
      <el-col :span="11">
        <el-input v-model="data.style.top" type="number" placeholder="top"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="大小(width,height)">
      <el-col :span="11">
        <el-input v-model="data.style.width" type="number" placeholder="width"></el-input>
      </el-col>
      <el-col class="line" :span="2">,</el-col>
      <el-col :span="11">
        <el-input v-model="data.style.height" type="number" placeholder="height"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="背景颜色">
      <el-color-picker style="float: left;" v-model="data.style.background"></el-color-picker>
      <div style="float: left;margin-left: 10px;">{{ data.style.background || "无" }}</div>
    </el-form-item>
    <el-form-item label="初始焦点">
      <el-radio-group style="width: 100%;" v-model="data.props.firstFocus">
        <el-radio style="float: left;" :label="true">是</el-radio>
        <el-radio style="float: left;" :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
<script>

export default {
  name: "GroupConfig",
  props: {
    fatherDetail: Object
  },
  data() {
    return {
      data: {
        style: {
          width: 300,
          height: 300,
          left: 0,
          top: 0,
          background: ""
        },
        props: {
          firstFocus: false
        }
      },
    }
  },

  computed: {
    showPosition() {
      let flag = true;
      if (this.fatherDetail && this.fatherDetail.type == "recycle") {
        flag = false;
      }

      return flag;
    }
  },

  methods: {
    /**
     * 编辑时的原数据
     */
    setData(data) {
      console.log(data)
      this.data.style = {...data.style}
    },

    getData() {
      let data = {
        type: "group",
        style: {...this.data.style},
      };
      console.log(data)
      return data;
    }
  }
}
</script>
<style scoped>

</style>