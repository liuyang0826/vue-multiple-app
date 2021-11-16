<template>
  <div class="home">
    {{ searchLoading }}
    <el-form>
      <el-form-item label=""></el-form-item>
    </el-form>
    <button @click="handleSearch">点击</button>
    <button @click="handleAdd">新增</button>
    <div>212</div>
    <el-dialog :visible.sync="addVisible" title="dsadsa">
      <dialog-form :visible="addVisible" :data="addForm" />
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { Dialog } from "element-ui"
import DialogForm from "./DialogForm";
import {
  pipe, useModalCtrl,
  useTableCrud
} from "../utils";

const searchOptions = {
  getTableData () {
    console.log("getTableData", this);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },
  hasPager: true,
  immediate: true
};

export default pipe(
    useTableCrud(searchOptions),
    useModalCtrl({
      namespace: "add",
      afterHandler() {
        console.log(this, arguments);
      }
    }),
    useModalCtrl({ namespace: "edit" }),
)({
  name: "Home",
  components: {
    HelloWorld,
    ElDialog: Dialog,
    DialogForm,
  },
  created () {
    console.log(this);
  },
  methods: {
    handleClick () {
      console.log(1);
    }
  }
});
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
