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
    <el-form-item label="方向">
      <el-radio-group style="width: 100%;" v-model="data.props.orientation">
        <el-radio style="float: left;" label="v">纵向</el-radio>
        <el-radio style="float: left;" label="h">横向</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="margin">
      <el-input v-model="data.props['view-margin']" type="number" placeholder="margin"></el-input>
    </el-form-item>
    <el-form-item label="列数" v-show="data.props.orientation=='v'">
      <el-input v-model="data.props['view-col']" type="number" placeholder="列表的列值"></el-input>
    </el-form-item>

    <el-form-item label="行数" v-show="data.props.orientation=='h'">
      <el-input v-model="data.props['view-row']" type="number" placeholder="列表的行值"></el-input>
    </el-form-item>

    <el-form-item label="预览数量">
      <el-input v-model="data.other.dataNum" type="number" placeholder="仅做效果展示"></el-input>
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
  name: "RecycleConfig",
  data() {
    return {
      data: {
        style: {
          width: 300,
          height: 720,
          left: 0,
          top: 0,
        },
        props: {
          firstFocus: false,
          orientation: "v",
          "view-col": 1,
          "view-row": 1,
          "view-margin": 0
        },
        other: {
          dataNum: 6
        }
      },
    }
  },

  methods: {
    /**
     * 编辑时的原数据
     */
    setData(data) {
      console.log(data)
      this.data.style = {...data.style}
      this.data.props = {...data.props}
      this.data.other = {...data.other}
    },

    getData() {
      let data = {
        type: "recycle",
        style: {...this.data.style},
        props: {...this.data.props},
        other: {...this.data.other},
      };
      return data;
    },
  }
}
</script>
<style scoped>

</style>