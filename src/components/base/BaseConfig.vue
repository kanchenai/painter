<template>
  <el-form ref="form" size="mini" label-width="150px">
    <el-form-item label="坐标(left,top)">
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
    <el-form-item label="背景颜色" v-if="type!='img'">
      <el-color-picker style="float: left;" v-model="data.style.background"></el-color-picker>
      <div style="float: left;margin-left: 10px;">{{ data.style.background }}</div>
    </el-form-item>
    <el-form-item label="图片" v-if="type=='img'">
      <div style="width: 100%;">
        <el-upload style="width: 100%;display: unset;"
                   action="#"
                   :limit="1"
                   :auto-upload="false"
                   :file-list="picList"
                   list-type="picture"
                   :on-change="changeBgPic">
          <div style="width: 100%;float: left;">
            <el-button style="float: left;" type="primary" size="mini">选择</el-button>
            <div slot="tip" class="el-upload__tip" style="float: left;margin-left: 10px;">
              点击按钮选择背景图片，只能上传jpg/png文件
            </div>
          </div>
        </el-upload>
      </div>
    </el-form-item>
  </el-form>
</template>
<script>

export default {
  name: "ButtonConfig",
  props: {
    type: String
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
          src: "",
        },
      },
      picList: []
    }
  },

  methods: {
    changeBgPic(file, fileList) {
      this.data.props.src = URL.createObjectURL(file.raw);
    },

    /**
     * 编辑时的原数据
     */
    setData(data) {
      this.data.style = {...data.style};
      if (this.type == "img") {
        this.data.props.src = data.props.src;
        this.picList = [{name: "", url: this.data.props.src}]
      }
    },

    getData() {
      let data = {
        type: this.type,
        style: {...this.data.style},
        props: {
          ...this.data.props
        },
      };

      return data;
    }
  }
}
</script>
<style scoped>

</style>