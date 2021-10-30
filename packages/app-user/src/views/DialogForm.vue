<template>
  <div>Dialog</div>
</template>

<script>/**
 * @Describe: Describe
 * @Author: 丿Coder
 * @Date: 2021-10-30 22:11
 */
import { pipe, useForm } from "../utils";

export default pipe(useForm())({
  name: "DialogForm",
  created () {}
});
</script>

<style scoped lang="scss"></style>
