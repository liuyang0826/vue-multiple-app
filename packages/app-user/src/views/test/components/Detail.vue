<template>
<el-dialog :visible.sync="visible" :title="title" @close="$emit('update:visible', false)" width="500px">
</el-dialog>

</template>

<script>
import pipe from "@/utils/pipe";
export default pipe(
)({
  name: "Detail",
})
</script>

<style lang="scss" scoped></style>
