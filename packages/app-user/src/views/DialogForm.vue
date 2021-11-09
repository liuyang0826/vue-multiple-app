<template>
  <div>Dialog</div>
</template>

<script>
/**
 * @Describe: Describe
 * @Author: 丿Coder
 * @Date: 2021-10-30 22:11
 */
import {pipe, useModal} from "../utils";

export default pipe(useModal({
  onShow() {
    console.log("onShow", this);
  }
}))({
  name: "DialogForm",
  created () {
    console.log(1111, this);
  }
});
</script>

<style scoped lang="scss"></style>
