<script lang="ts" setup>
import { useWaitRoomStore } from "@/store";
import { computed, onMounted, ref } from "vue";
import io from "socket.io-client";
import { getPlayerAPI } from "@/api/PlayerAPI.ts";
import { useToast } from "vue-toastification";

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

const usePlayerInfo = () => {
  const player_1 = ref<Player>();
  const player_2 = ref<Player>();

  const flashPlayerInfoEvent = async () => {
    const { data: player_1_data } = await getPlayerAPI(waitRoom.value?.player_1_id as string);
    const { data: player_2_data } = await getPlayerAPI(waitRoom.value?.player_2_id as string);
    player_1.value = player_1_data;
    player_2.value = player_2_data;
  };

  return {
    player_1,
    player_2,
    flashPlayerInfoEvent,
  };
};

const useSocket = () => {
  const createSocketConnection = () => {
    useToast().info("正在连接到服务器");
    const socket = io("ws://localhost");

    socket.on("connect", () => {
      useToast().success("连接服务器成功");
    });

    socket.on("player_update", async () => {
      useToast().info("新玩家加入房间");
      await flashWaitRoomInfoEvent();
      await flashPlayerInfoEvent();
    });
  };

  return {
    createSocketConnection,
  };
};

const { waitRoom, flashWaitRoomInfoEvent } = useWaitRoomInfo();
const { player_1, player_2, flashPlayerInfoEvent } = usePlayerInfo();
const { createSocketConnection } = useSocket();

onMounted(() => {
  createSocketConnection();
  flashWaitRoomInfoEvent();
  flashPlayerInfoEvent();
});
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
