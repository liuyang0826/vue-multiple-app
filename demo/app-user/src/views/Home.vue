<template>
  <div class="home">
    <el-form>
      <el-form-item label=""></el-form-item>
    </el-form>
    <button @click="handleSearch">点击</button>
    <button @click="handleAdd">新增</button>
    <div>212</div>
  </div>
</template>

<script>

export default {
  name: "Home",
  created () {
    console.log(this);
  },
  methods: {
    handleClick () {
      console.log(1);
    }
  }
};
</script>

<style scoped>
.home ::v-deep a {
  color: red;
  animation: fn 1s linear;
}

@keyframes fn {
  0% {
    color: #ffffff;
  }
  100% {
    color: blue;
  }
}
</style>
