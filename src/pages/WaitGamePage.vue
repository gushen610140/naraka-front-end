<script lang="ts" setup>
import { usePlayerStore, useSessionStore, useSocketStore, useWaitRoomStore } from "@/store";
import { computed, onMounted, ref } from "vue";
import io from "socket.io-client";
import { getPlayerAPI, updateStatusAPI, updateStatusNetworkAPI } from "@/api/PlayerAPI.ts";
import { useToast } from "vue-toastification";
import { changePage } from "@/utils/page.ts";
import { removeWaitRoomAPI } from "@/api/WaitRoomAPI.ts";

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
    const socket = io("ws://localhost");

    socket.on("connect", () => {
      useToast().success("连接服务器成功", { timeout: 3000 });
      useSocketStore().setSocket(socket);
    });

    socket.on("player_update", async () => {
      useToast().info("新玩家加入房间", { timeout: 3000 });
      try {
        await flashWaitRoomInfoEvent();
        await flashPlayerInfoEvent();
      } catch (e) {
        await flashWaitRoomInfoEvent();
        await flashPlayerInfoEvent();
      }
    });

    socket.on("status_update", async () => {
      try {
        await flashPlayerInfoEvent();
        await checkReadyStatus();
      } catch (e) {
        await flashPlayerInfoEvent();
        await checkReadyStatus();
      }
    });
  };

  return {
    createSocketConnection,
  };
};

const useButtonInfo = () => {
  const button_1_text = ref("未准备");
  const button_2_text = ref("未准备");

  const button_1_disabled = ref(usePlayerStore().getPlayer().id != useWaitRoomStore().getWaitRoom().player_1_id);
  const button_2_disabled = ref(usePlayerStore().getPlayer().id != useWaitRoomStore().getWaitRoom().player_2_id);

  const button_1_event = async () => {
    button_1_text.value = "已锁定准备";
    button_1_disabled.value = true;
    const status = player_1.value?.status == "not ready" ? "ready" : "not ready";
    await updateStatusAPI(player_1.value?.id as string, status);
    await flashPlayerInfoEvent();
    await updateStatusNetworkAPI();
    await checkReadyStatus();
  };

  const button_2_event = async () => {
    button_2_text.value = "已锁定准备";
    button_2_disabled.value = true;
    const status = player_2.value?.status == "not ready" ? "ready" : "not ready";
    await updateStatusAPI(player_2.value?.id as string, status);
    await flashPlayerInfoEvent();
    await updateStatusNetworkAPI();
    await checkReadyStatus();
  };

  return {
    button_1_text,
    button_2_text,
    button_1_disabled,
    button_2_disabled,
    button_1_event,
    button_2_event,
  };
};

const useStartGame = () => {
  const isChecking = ref(false);

  const checkReadyStatus = async () => {
    if (player_1.value?.status == "ready" && player_2.value?.status == "ready" && !isChecking.value) {
      isChecking.value = true;
      useToast().info("双方已经准备，游戏将在三秒钟后开始", { timeout: 2000 });
      setTimeout(() => {
        useToast().info("双方已经准备，游戏将在两秒钟后开始", { timeout: 2000 });
      }, 1000);
      setTimeout(() => {
        useToast().info("双方已经准备，游戏将在一秒钟后开始", { timeout: 2000 });
      }, 2000);
      setTimeout(() => {
        isChecking.value = false;
        gameStart();
      }, 3000);
    }
  };

  const gameStart = () => {
    if (player_1.value?.status == "ready" && player_2.value?.status == "ready") {
      const player_me_id = usePlayerStore().getPlayer()!.id;
      const player_opponent_id = player_me_id == player_1.value.id ? player_2.value.id : player_1.value.id;
      useSessionStore().initSession(player_me_id, player_opponent_id);
      removeWaitRoomAPI(waitRoom.value.id);
      changePage("/game");
    }
  };

  return {
    checkReadyStatus,
  };
};

const { waitRoom, flashWaitRoomInfoEvent } = useWaitRoomInfo();
const { player_1, player_2, flashPlayerInfoEvent } = usePlayerInfo();
const { createSocketConnection } = useSocket();
const { button_1_text, button_2_text, button_1_disabled, button_2_disabled, button_1_event, button_2_event } =
  useButtonInfo();
const { checkReadyStatus } = useStartGame();

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
        <v-card class="ml-4" title="玩家1" variant="tonal">
          <v-card-item>昵称: {{ player_1?.nickname }}</v-card-item>
          <v-card-item>状态: {{ player_1?.status }}</v-card-item>
          <v-card-actions>
            <v-btn :disabled="button_1_disabled" block variant="tonal" @click="button_1_event">
              {{ button_1_text }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="mr-4" title="玩家2" variant="tonal">
          <v-card-item>昵称: {{ player_2?.nickname }}</v-card-item>
          <v-card-item>状态: {{ player_2?.status }}</v-card-item>
          <v-card-actions>
            <v-btn :disabled="button_2_disabled" block variant="tonal" @click="button_2_event">
              {{ button_2_text }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped></style>
