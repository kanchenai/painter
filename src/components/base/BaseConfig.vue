<template>
  <el-form ref="form" size="mini" label-width="150px">
    <el-form-item label="焦点效果" v-if="needFocusSetting">
      <el-radio-group style="width: 100%;" v-model="data.props.id">
        <el-radio style="float: left;" :label="'focus'">是</el-radio>
        <el-radio style="float: left;" :label="''">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="坐标(left,top)" v-if="!data.props.id">
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
    <el-form-item label="圆角">
      <el-input v-model="data.style.borderRadius" type="number"></el-input>
    </el-form-item>
    <el-form-item label="背景颜色" v-if="type!='img'">
      <el-color-picker style="float: left;" v-model="data.style.background"></el-color-picker>
      <div style="float: left;margin-left: 10px;">{{ data.style.background || "无" }}</div>
    </el-form-item>
    <el-form-item label="图片" v-if="type=='img'">
      <div style="width: 100%;">
        <el-upload style="width: 100%;display: unset;"
                   action="#"
                   :limit="1"
                   :auto-upload="false"
                   :file-list="picList"
                   list-type="picture"
                   :on-change="changePic">
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

import utils from "@/utils/viewUtils";

export default {
  name: "ButtonConfig",
  props: {
    type: String,
    fatherDataId: String
  },
  data() {
    return {
      data: {
        style: {
          width: 0,
          height: 0,
          left: 0,
          top: 0,
          background: "",
          borderRadius: 0
        },
        props: {
          src: {url: "", type: ""},
          id: ""
        },
      },
      picList: [],
    }
  },

  computed: {
    fatherDetail() {
      return this.$store.getters.getDetailById(this.fatherDataId);
    },

    needFocusSetting() {
      let flag = false;
      let fatherType = this.fatherDetail.type;
      if (fatherType == "focus" || fatherType == "button") {
        flag = true;
      }

      return flag;
    }
  },

  watch: {
    type: {
      handler() {
        this.data.props.id = "";
        if (this.type == "img" && this.data.style.borderRadius == 0) {
          this.data.style.borderRadius = 7;
        }
      },
      immediate: true
    },

    "data.props.id": {
      handler() {
        if (this.data.props.id == "focus" && utils.insideConnot.indexOf(this.fatherDetail.type) >= 0
            && this.data.style.width == 0 && this.data.style.height == 0) {
          this.data.style.width = this.fatherDetail.style.width;
          this.data.style.height = this.fatherDetail.style.height;
        }
      }
    }
  },

  methods: {
    async changePic(file, fileList) {
      console.log(file)
      let imageType = "";
      let index = file.name.lastIndexOf(".");
      if (index >= 0) {
        imageType = file.name.substring(index + 1);
      }
      this.data.props.src = {url: URL.createObjectURL(file.raw), type: imageType};

      if (this.data.style.width == 0 && this.data.style.height == 0) {
        let {width, height} = await utils.getImageSize(file);
        this.data.style.width = width;
        this.data.style.height = height;
      }

    },

    /**
     * 编辑时的原数据
     */
    setData(data) {
      this.data.style = {...data.style};
      this.data.props = {...data.props}
      if (this.type == "img") {
        if (this.data.props.src) {
          this.picList = [{name: "", url: this.data.props.src.url}]
        } else {
          this.picList = []
        }

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