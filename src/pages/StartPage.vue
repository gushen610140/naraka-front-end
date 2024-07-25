<script lang="ts" setup>
import { onMounted } from "vue";
import { getSessionAPI } from "@/services/session.ts";

onMounted(() => {
  getSessionAPI().then((res: Result<Session[]>) => {
    console.log(res);
  });
});
</script>

<template>
  <h1>Naraka</h1>
  <div class="create btn">Create a Game</div>
  <div class="join btn">Join a Game</div>
</template>

<style scoped>
.btn {
  margin: 2rem 0;
  cursor: pointer;
}
</style>
