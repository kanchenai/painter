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
  </el-form>
</template>
<script>

export default {
  name: "ButtonConfig",
  data() {
    return {
      data: {
        style: {
          width: 176,
          height: 272,
          left: 0,
          top: 0,
        },
        children: []
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
      this.data.children = data.children;
    },

    getData() {
      let data = {
        type: "focus",
        style: {...this.data.style},
        children: this.data.children
      };
      console.log(data)
      return data;
    }
  }
}
</script>
<style scoped>

</style>