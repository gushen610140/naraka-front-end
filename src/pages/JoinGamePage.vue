<script lang="ts" setup>
import GameListComp from "@/components/GameListComp.vue";
import GoBackButtonUI from "@/components/UI/GoBackButtonUI.vue";
</script>

<template>
  <GoBackButtonUI
    style="position: absolute; top: 20px; left: 20px"
  ></GoBackButtonUI>
  <GameListComp></GameListComp>
</template>

<style scoped></style>
