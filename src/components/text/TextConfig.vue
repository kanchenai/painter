<template>
  <el-form ref="form" size="mini" label-width="150px">
    <el-form-item label="显示文本">
      <el-input v-model="data.props.value" placeholder="请输入控件名"></el-input>
    </el-form-item>
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
      <div style="float: left;margin-left: 10px;">{{ data.style.background||"无" }}</div>
    </el-form-item>
    <el-form-item label="文字颜色">
      <el-color-picker style="float: left;" v-model="data.style.color"></el-color-picker>
      <div style="float: left;margin-left: 10px;">{{ data.style.color||"默认" }}</div>
    </el-form-item>
    <el-form-item label="文字大小">
      <el-input v-model="data.style.fontSize" type="number"></el-input>
    </el-form-item>
    <el-form-item label="文字对齐">
      <el-radio-group style="width: 100%;" v-model="data.style.textAlign">
        <el-radio style="float: left;" label="left">靠左</el-radio>
        <el-radio style="float: left;" label="center">居中</el-radio>
        <el-radio style="float: left;" label="right">靠右</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
<script>

export default {
  name: "TextConfig",
  props: {
    fatherDetail: Object
  },
  data() {
    return {
      data: {
        style: {
          width: 150,
          height: 30,
          left: 0,
          top: 0,
          background: "",
          color: "#ffffff",
          fontSize: 18,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textAlign: "left",
        },
        props: {
          value: ""
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
      this.data.props = {...data.props};
    },

    getData() {
      let data = {
        type: "text",
        style: {...this.data.style},
        props: this.data.props
      };
      console.log(data)
      return data;
    }
  }
}
</script>
<style scoped>
</style>