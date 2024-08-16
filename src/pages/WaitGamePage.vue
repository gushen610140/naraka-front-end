<script lang="ts" setup>
import PlayerShowCardUI from "@/components/UI/PlayerShowCardUI.vue";
import GoBackButtonUI from "@/components/UI/GoBackButtonUI.vue";
</script>

<template>
  <GoBackButtonUI
    style="position: absolute; top: 20px; left: 20px"
  ></GoBackButtonUI>
  <div style="display: flex; gap: 5rem">
    <PlayerShowCardUI player_name="我是1号"></PlayerShowCardUI>
    <PlayerShowCardUI player_name="我是2号"></PlayerShowCardUI>
  </div>
</template>

<style scoped></style>
