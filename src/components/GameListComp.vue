<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getSessionAPI } from "@/services/session.ts";
import GameCardUI from "@/components/UI/GameCardUI.vue";

const gameList = ref<Session[]>();
onMounted(() => {
  getSessionAPI().then((res: Result<Session[]>) => {
    gameList.value = res.data;
  });
});
</script>

<template>
  <div class="game_list_container">
    <h1>Current Games</h1>
    <GameCardUI
      v-for="gameSessionInfo in gameList"
      :gameSessionInfo="gameSessionInfo"
    ></GameCardUI>
  </div>
</template>

<style scoped></style>
