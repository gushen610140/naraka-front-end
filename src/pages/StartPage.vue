<script lang="ts" setup>
import { changePage } from "@/utils/page.ts";
</script>

<template>
  <div class="flex flex-col gap-6">
    <v-btn size="x-large" text="创建游戏" @click="changePage('/create_game')"></v-btn>
    <v-btn size="x-large" text="加入游戏" @click="changePage('/join_game')"></v-btn>
    <v-btn size="x-large" text="设置"></v-btn>
    <v-btn size="x-large" text="退出"></v-btn>
  </div>
</template>

<style scoped></style>
