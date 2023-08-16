<template>
  <div style="pointer-events: none;" :style="{left:left+'px',top:top+'px'}">
    <div style="position: absolute;overflow: hidden;" :style="{width:width+'px',height:height+'px'}"></div>

    <div class="bg"
         :style="{width:width-2+'px',height:height-2+'px',left:left+'px',top:top+'px'}"></div>

    <div class="position" :style="{left:left+2+'px',top:top+2+'px'}" v-if="$store.state.editMode">
      {{ 'l:' + left + ',' + 't:' + top }}
    </div>
    <div class="size" :style="{left:left+2+'px',top:top+14+'px'}" v-if="$store.state.editMode">
      {{ 'w:' + width + ',' + 'h:' + height }}
    </div>
  </div>
</template>
<script>

/**
 * 只用来布局
 */
export default {
  name: "VirtualView",
  props: {
    detail: Object,
    position:Object,
  },

  computed: {
    fatherDetail() {
      let value = null;
      value = this.$store.getters.getDetailById(this.fatherDataId);
      return value;
    },
    width() {
      let value = 0;
      if (this.detail.style && this.detail.style.width) {
        value = this.detail.style.width;
      }
      return value;
    },
    height() {
      let value = 0;
      if (this.detail.style && this.detail.style.height) {
        value = this.detail.style.height;
      }

      return value;
    },

    left(){
      let value = 0;
      if(this.position){
        value = this.position.left;
      }

      return value;
    },
    top(){
      let value = 0;
      if(this.position){
        value = this.position.top;
      }

      return value;
    },
  },
}
</script>
<style scoped>
.bg {
  position: absolute;
  pointer-events: none;
  opacity: 0.3;
  z-index: 1;
  border: 1px dashed white;
  background: #c7c6c6;
}

.size,
.position {
  position: absolute;
  font-size: 12px;
  line-height: 12px;
  padding: 0 2px;
  color: white;
  z-index: 1;
  pointer-events: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none;
}
</style>