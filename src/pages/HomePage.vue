<script lang="ts" setup>
import { changePage } from "@/utils/page.ts";

const webSocket = new WebSocket("ws://localhost:8080/demo_war_exploded/echo");
webSocket.onopen = function () {
  console.log("WebSocket 连接已经建立。");
  webSocket.send("Hello, server!");
};
webSocket.onmessage = function (event) {
  console.log("收到服务器消息：", event.data);
};
webSocket.onerror = function (event) {
  console.error("WebSocket 连接出现错误：", event);
};
webSocket.onclose = function () {
  console.log("WebSocket 连接已经关闭。");
};
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
