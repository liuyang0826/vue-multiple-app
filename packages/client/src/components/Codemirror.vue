<template>
<div ref="rootRef"></div>
</template>

<script setup>
import {onMounted, nextTick} from "vue";
import CodeMirror from "codemirror"
import 'codemirror/theme/idea.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/css/css'
import 'codemirror/addon/edit/closebrackets.js'

const emit = defineEmits(["update:modelValue"])
const props = defineProps(["modelValue", "codeMode"])

const rootRef = $ref()
onMounted(() => {
  nextTick(() => {
    const codeMirror = CodeMirror(rootRef, {
      mode: props.codeMode || "text/javascript",
      lineNumbers: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      theme: "idea"
    })
    codeMirror.setValue(props.modelValue || "")
    codeMirror.on("change", (e) => {
      emit("update:modelValue", e.getValue())
    })
  })
})
</script>

<style scoped>
</style>