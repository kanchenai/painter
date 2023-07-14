<template>
  <div style="position: absolute" :style="style">
    <div class="text">{{text}}</div>
  </div>
</template>
<script>
export default {
  name: "TextView",
  props: {
    data: Object
  },
  computed: {
    style() {
      return {
        width: this.width + 'px',
        height: this.height + 'px',
        left: this.left + 'px',
        top: this.top + 'px',
      }
    },
    width() {
      let value = 120;
      if (this.data.style && this.data.style.width) {
        value = parseInt(this.data.style.width);
      }

      return value;
    },
    height() {
      let value = 60;
      if (this.data.style && this.data.style.height) {
        value = parseInt(this.data.style.height);
      }

      return value;
    },
    left() {
      let value = 0;

      if (this.data.style && this.data.style.left) {
        value = parseInt(this.data.style.left);
      }

      return value;
    },
    top() {
      let value = 0;
      if (this.data.style && this.data.style.top) {
        value = parseInt(this.data.style.top);
      }
      return value;
    },
    text(){
      let value = "";
      if(this.data.props && this.data.props.value){
        value = this.data.props.value;
      }

      return value;
    }
  },
}
</script>
<style scoped>
.text {
  position: absolute;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  font-size: 22px;
  color: white;
}
</style>