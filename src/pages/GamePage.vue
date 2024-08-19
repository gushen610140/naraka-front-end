<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useWaitRoomStore } from "@/store";

const useWaitRoomInfo = () => {
  const waitRoom = computed(() => useWaitRoomStore().getWaitRoom());

  const flashWaitRoomInfoEvent = async () => {
    await useWaitRoomStore().setWaitRoom(waitRoom.value?.id as string);
  };

  return {
    waitRoom,
    flashWaitRoomInfoEvent,
  };
};

const { waitRoom, flashWaitRoomInfoEvent } = useWaitRoomInfo();

onMounted(() => {
  flashWaitRoomInfoEvent();
});
</script>

<template>
  <h1>{{ waitRoom?.room_name }}</h1>
</template>

<style scoped></style>
