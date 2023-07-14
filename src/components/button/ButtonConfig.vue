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
    <el-form-item label="按钮文字">
      <el-input v-model="data.props['value']"></el-input>
    </el-form-item>
    <el-form-item label="显示详细设置">
      <el-radio-group style="width: 100%;" v-model="showDetail">
        <el-radio style="float: left;" :label="true">是</el-radio>
        <el-radio style="float: left;" :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="按钮背景" v-show="showDetail">
      <el-radio-group style="width: 100%;" v-model="bgType">
        <el-radio style="float: left;" :label="'normal'">默认</el-radio>
        <el-radio style="float: left;" :label="'custom'">定制</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-show="showDetail&&bgType!='normal'">
      <div style="width: 100%;">
        <el-upload style="width: 100%;display: unset;"
                   action="#"
                   :limit="1"
                   :auto-upload="false"
                   :file-list="bgPicList"
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

    <el-form-item label="上焦放大比" v-show="showDetail">
      <el-input v-model="data.props['focus-enlarge']" type="number"></el-input>
    </el-form-item>
    <el-form-item label="上焦效果" v-show="showDetail">
      <el-radio-group style="width: 100%;" v-model="focusType">
        <el-radio style="float: left;" :label="'normal'">默认</el-radio>
        <el-radio style="float: left;" :label="'custom'">定制</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-show="showDetail&&focusType=='normal'">
      <el-color-picker style="float: left;" v-model="data.props['focus-color']"></el-color-picker>
      <div style="float: left;margin-left: 10px;">{{ data.props['focus-color'] }}</div>
    </el-form-item>
    <el-form-item v-show="showDetail&&focusType!='normal'">
      <div style="width: 100%;">
        <el-upload style="width: 100%;display: unset;"
                   action="#"
                   :limit="1"
                   :auto-upload="false"
                   :file-list="focusPicList"
                   list-type="picture"
                   :on-change="changeFocusPic">
          <div style="width: 100%;float: left;">
            <el-button style="float: left;" type="primary" size="mini">选择</el-button>
            <div slot="tip" class="el-upload__tip" style="float: left;margin-left: 10px;">
              点击按钮选择焦点图片，只能上传jpg/png文件
            </div>
          </div>
        </el-upload>
        <el-row style="margin-top: 10px;">
          <el-col class="line" :span="4">width</el-col>
          <el-col :span="8">
            <el-input v-model="data.focus.width" type="number" placeholder="width"></el-input>
          </el-col>
          <el-col class="line" :span="4">,height</el-col>
          <el-col :span="8">
            <el-input v-model="data.focus.height" type="number" placeholder="height"></el-input>
          </el-col>
        </el-row>
      </div>
    </el-form-item>
    <el-form-item label="文字颜色" v-show="showDetail">
      <el-color-picker style="float: left;" v-model="data.props['value-color']"></el-color-picker>
      <div style="float: left;margin-left: 10px;">{{ data.props['value-color'] }}</div>
    </el-form-item>
    <el-form-item label="圆角半径" v-show="showDetail">
      <el-input v-model="data.props['radius']" type="number"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import utils from "@/utils/utils";

export default {
  name: "ButtonConfig",
  data() {
    return {
      data: {
        style: {
          width: 120,
          height: 60,
          left: 0,
          top: 0
        },
        props: {
          "value": "按钮",
          "focus-enlarge": 100,
          "focus-color": "#de2910",
          "value-color": "#dcdfe6",
          "radius": 7
        },
        bg: {
          src: ""
        },
        focus: {
          src: "",
          width: 120,
          height: 60
        }
      },
      showDetail: false,
      bgType: "normal",
      focusType: "normal",
      bgPicList:[],
      focusPicList:[],
    }
  },

  methods: {
    changeBgPic(file, fileList) {
      this.data.bg.src = URL.createObjectURL(file.raw);

      this.bgPicList = [
        {name: "", url: file.url}
      ]
    },

    async changeFocusPic(file, fileList) {
      let {width, height} = await utils.getImageSize(file);
      this.data.focus.width = width;
      this.data.focus.height = height;
      this.data.focus.src = URL.createObjectURL(file.raw);

      this.focusPicList = [
        {name: "", url: file.url}
      ]
    },

    /**
     * 编辑时的原数据
     */
    setData(data) {
      this.data.style = {...data.style};
      this.data.props = {...data.props};

      if (data.children && data.children.length > 0) {
        data.children.forEach(child => {
          if(child.id == "focus"){
            this.data.focus.src = child.props.src;
            this.data.focus.width = child.style.width;
            this.data.focus.height = child.style.height;

            this.focusPicList = [
              {name:"",url:this.data.focus.src}
            ]
          }else if(child.id == "bg"){
            this.data.bg.src = child.props.src;

            this.bgPicList = [
              {name:"",url:this.data.bg.src}
            ]
          }
        })
      }

      if(this.data.focus.src){
        this.focusType = "custom";
      }

      if(this.data.bg.src){
        this.bgType = "custom";
      }
    },

    getData() {
      let data = {
        type: "button",
        style: {...this.data.style},
        props: {
          ...this.data.props
        },
        children: []
      };

      if (this.bgType != "normal") {
        let bg = {
          id: "bg",
          type: "img",
          props: {
            src: this.data.bg.src
          }
        };

        data.children.push(bg);
      }

      if (this.focusType != "normal") {
        let focus = {
          id: "focus",
          type: "img",
          style: {
            width: this.data.focus.width,
            height: this.data.focus.height
          },
          props: {
            src: this.data.focus.src
          }
        };

        data.children.push(focus);
      }

      return data;
    }
  }
}
</script>
<style scoped>

</style>