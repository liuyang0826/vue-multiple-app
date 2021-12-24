<template>
<div ref="rootRef"></div>
</template>

<script setup>
import {onMounted, nextTick} from "vue";
import CodeMirror from "codemirror"
import 'codemirror/theme/idea.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/edit/closebrackets.js'
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";

const rootRef = $ref()
onMounted(() => {
  nextTick(() => {
    const codeMirror = CodeMirror(rootRef, {
      mode: "text/javascript",
      lineNumbers: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      theme: "idea"
    })
    codeMirror.on("blur", (e) => {
      codeMirror.setValue(prettier.format(e.getValue(), {
        semi: false,
        parser: "babel",
        plugins: [parserBabel]
      }));
    })
  })
})
</script>

<style scoped>
</style>