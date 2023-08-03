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
    <el-form-item label="fragment数量">
      <el-input v-model="data.other.fragmentNum" @change="fragmentNumChange" type="number"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>

export default {
  name: "FrameConfig",
  data() {
    return {
      data: {
        style: {
          width: 1280,
          height: 600,
          left: 0,
          top: 120,
        },
        other: {
          fragmentNum: 1,
          selectedIndex: 0
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
      this.data.other = {...data.other}
    },

    getData() {
      let data = {
        type: "frame",
        style: {...this.data.style},
        other: {...this.data.other},
      };
      console.log(data)
      return data;
    },

    fragmentNumChange(value) {
      if (value < 1) {
        this.data.other.fragmentNum = 1;
      }
    }
  }
}
</script>
<style scoped>

</style>