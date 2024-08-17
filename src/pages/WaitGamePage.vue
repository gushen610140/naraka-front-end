<script lang="ts" setup>
import { useWaitRoomStore } from "@/store";
import { computed, ref } from "vue";
import { getPlayerAPI } from "@/api/PlayerAPI.ts";

const useWaitRoomInfo = () => {
  const waitRoom = computed(() => useWaitRoomStore().getWaitRoom());
  const player_1 = ref<Player>();
  const player_2 = ref<Player>();

  if (waitRoom.value != undefined) {
    getPlayerAPI(waitRoom.value.player_1_id).then((res) => {
      player_1.value = res.data;
    });
  }

  return {
    waitRoom,
    player_1,
    player_2,
  };
};

const { waitRoom, player_1, player_2 } = useWaitRoomInfo();
</script>

<template>
  <v-card :title="waitRoom?.room_name" min-width="600">
    <v-row>
      <v-col>
        <v-card title="玩家1" variant="outlined">
          <v-card-item>昵称: {{ player_1?.nickname }}</v-card-item>
          <v-card-item>状态: {{ player_1?.status }}</v-card-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card title="玩家2" variant="outlined">
          <v-card-item>昵称: {{ player_2?.nickname }}</v-card-item>
          <v-card-item>状态: {{ player_2?.status }}</v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped></style>
